const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const vinculoModel = require('../models/contasVinculadasModel');
const bcrypt = require('bcryptjs');
const { enviarEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

const gerarVinculoToken = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const payload = {
            tipo: "vinculo",
            criadoPor: usuarioId,
            criadoEm: Date.now(),
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "10m",
        });

        return res.json({ token });
    } catch (err) {
        console.error("Erro ao gerar token de vínculo:", err);
        return res.status(500).json({ error: "Erro ao gerar token" });
    }
};

const verificarVinculoToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token não fornecido" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.tipo !== "vinculo") {
            return res.status(400).json({ error: "Tipo de token inválido" });
        }

        return res.json({
            valido: true,
            payload: {
                tipo: decoded.tipo,
                criadoPor: decoded.criadoPor,
                criadoEm: decoded.criadoEm,
                expiraEm: decoded.exp,
            },
        });
    } catch (err) {
        console.error("Erro ao verificar token de vínculo:", err);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

// POST /trocar-conta
const trocarConta = async (req, res) => {
    const usuarioAtualId = req.user.id;
    const contaAlvoId = req.body.contaId;

    try {
        const voltandoParaOriginal =
            req.user.usandoContaVinculada &&
            req.user.contaOriginal?.id === contaAlvoId;

        let novoPayload;

        if (voltandoParaOriginal) {
            const contaOriginal = await authModel.buscarUsuarioPorId(contaAlvoId);
            if (!contaOriginal) {
                return res
                    .status(404)
                    .json({ error: "Conta original não encontrada." });
            }

            // Gera token padrão (sem `contaOriginal`, sem `usandoContaVinculada`)
            const vinculadas = await vinculoModel.listarContasVinculadas(
                contaOriginal.id
            );

            novoPayload = {
                id: contaOriginal.id,
                nome: contaOriginal.nome,
                email: contaOriginal.email,
                vinculadas: vinculadas.map((v) => ({
                    id: v.id,
                    nome: v.nome,
                    email: v.email,
                })),
            };
        } else {
            let autorizado = false;

            if (req.user.usandoContaVinculada && req.user.contaOriginal) {
                const vinculadasDaOriginal =
                    await vinculoModel.listarContasVinculadas(req.user.contaOriginal.id);
                autorizado = vinculadasDaOriginal.some(
                    (c) => c.id === contaAlvoId
                );
            } else {
                const vinculo = await vinculoModel.verificarVinculoExistente(
                    usuarioAtualId,
                    contaAlvoId
                );
                autorizado = vinculo?.aprovada;
            }

            if (!autorizado) {
                return res
                    .status(403)
                    .json({ error: "A conta não está vinculada ou aprovada." });
            }

            const contaVinculada = await authModel.buscarUsuarioPorId(contaAlvoId);
            if (!contaVinculada) {
                return res
                    .status(404)
                    .json({ error: "Conta vinculada não encontrada." });
            }

            const contaOriginal = await authModel.buscarUsuarioPorId(
                req.user.usandoContaVinculada
                    ? req.user.contaOriginal.id
                    : usuarioAtualId
            );

            if (!contaOriginal) {
                return res
                    .status(404)
                    .json({ error: "Conta original não encontrada." });
            }

            const vinculadasDaOriginal = await vinculoModel.listarContasVinculadas(
                contaOriginal.id
            );

            novoPayload = {
                id: contaVinculada.id,
                nome: contaVinculada.nome,
                email: contaVinculada.email,
                usandoContaVinculada: true,
                contaOriginal: {
                    id: contaOriginal.id,
                    nome: contaOriginal.nome,
                    email: contaOriginal.email,
                    vinculadas: vinculadasDaOriginal.map((v) => ({
                        id: v.id,
                        nome: v.nome,
                        email: v.email,
                    })),
                },
            };
        }

        const novoToken = jwt.sign(novoPayload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", novoToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ token: novoToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const adicionarConta = async (req, res) => {
    const { email, senha } = req.body;
    const donoId = req.user.id;

    try {
        const conta = await authModel.buscarUsuarioPorEmail(email);
        if (!conta) {
            return res.status(404).json({ error: 'Conta não encontrada. Crie-a primeiro.' });
        }

        if (conta.id === donoId) {
            return res.status(400).json({ error: 'Você não pode adicionar sua própria conta.' });
        }

        const senhaValida = await bcrypt.compare(senha, conta.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta para essa conta.' });
        }

        const existente = await vinculoModel.verificarVinculoExistente(donoId, conta.id);
        if (existente) {
            return res.status(400).json({ error: 'Conta já vinculada ou pendente.' });
        }

        await vinculoModel.vincularConta(donoId, conta.id, false);

        // Gerar token de aprovação
        const tokenAprovacao = jwt.sign(
            { donoId, contaId: conta.id },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const linkAprovacao = `${FRONTEND_URL}/aprovar-vinculo?token=${tokenAprovacao}`;

        await enviarEmail(
            conta.email,
            "Confirme o novo acesso à sua conta",
            `Olá, ${conta.nome}!

Recebemos uma solicitação para vincular um novo acesso à sua conta.  
Se foi você quem fez essa solicitação, basta clicar no link abaixo para confirmar:

${linkAprovacao}

Se você não reconhece essa atividade, ignore este e-mail. Nenhuma alteração será feita sem a sua confirmação.

Atenciosamente,  
Equipe MindTask`
        );

        res.json({ message: 'Solicitação de vínculo enviada. Aguarde aprovação.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//
const vincularContaDireto = async (req, res) => {
    const donoId = req.user.id;
    const { nome, email, senha } = req.body;

    try {
        const usuarioExistente = await authModel.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novaConta = await authModel.criarUsuario(nome, email, senhaHash);

        await vinculoModel.vincularConta(donoId, novaConta.id, true);

        res.json({ message: 'Conta criada, vinculada e autenticada com sucesso.', novaConta });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const aprovarPorToken = async (req, res) => {
    const { token } = req.body;

    try {
        const { donoId, contaId } = jwt.verify(token, JWT_SECRET);

        const linhasAfetadas = await vinculoModel.aprovarVinculo(donoId, contaId);

        if (linhasAfetadas === 0) {
            return res
                .status(410)
                .json({ error: "Esse link já foi utilizado ou o vínculo não existe." });
        }

        res.json({ message: "Vínculo aprovado com sucesso." });
    } catch {
        res.status(400).json({ error: "Token inválido ou expirado." });
    }
};

const listarVinculadas = async (req, res) => {
    try {
        const contas = await vinculoModel.listarContasVinculadas(req.user.id);
        res.json(contas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removerVinculo = async (req, res) => {
    const donoId = req.user.id;
    const { contaId } = req.params;

    try {
        await vinculoModel.removerVinculo(donoId, contaId);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    gerarVinculoToken,
    verificarVinculoToken,
    trocarConta,
    adicionarConta,
    vincularContaDireto,
    aprovarPorToken,
    listarVinculadas,
    removerVinculo,
};
