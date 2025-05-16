const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const vinculoModel = require('../models/contasVinculadasModel');
const { enviarEmail } = require('../services/emailService')

const JWT_SECRET = process.env.JWT_SECRET;

// Recuperar informações do usuário logado
const getUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const vinculadas = await vinculoModel.listarContasVinculadas(req.user.id);

        let contaOriginal = null;

        if (req.user.usandoContaVinculada && req.user.contaOriginal?.id) {
            const vinculadasDaOriginal = await vinculoModel.listarContasVinculadas(req.user.contaOriginal.id);

            contaOriginal = {
                id: req.user.contaOriginal.id,
                nome: req.user.contaOriginal.nome,
                email: req.user.contaOriginal.email,
                vinculadas: vinculadasDaOriginal,
            };
        }

        res.json({
            id: req.user.id,
            nome: req.user.nome,
            email: req.user.email,
            vinculadas,
            usandoContaVinculada: req.user.usandoContaVinculada,
            contaOriginal,
        });
    } catch (err) {
        console.error("Erro ao obter usuário:", err);
        res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const usuarioExistente = await authModel.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        await authModel.criarUsuario(nome, email, senhaHash);
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await authModel.buscarUsuarioPorEmail(email);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaCorreta) return res.status(401).json({ error: 'Senha inválida.' });

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        const vinculadas = await vinculoModel.listarContasVinculadas(usuario.id);

        res.json({
            message: 'Login bem-sucedido!',
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
            vinculadas,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logout
const logout = async (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.json({ message: "Logout realizado com sucesso" });
}

// Gerar token
const gerarToken = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// Solicitação de token para alterar senha
const tokenRecuperacao = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await authModel.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(404).json({ error: 'E-mail não encontrado!' });
        }

        const token = gerarToken();
        const tokenHash = await bcrypt.hash(token, 10);

        const sucesso = await authModel.salvarTokenRecuperacao(email, tokenHash);
        if (!sucesso) {
            return res.status(500).json({ error: 'Erro ao salvar token de recuperação!' });
        }

        await enviarEmail(email, 'Recuperação de Senha', `Use este código para redefinir sua senha: ${token}`);

        res.status(200).json({ message: 'Código de recuperação enviado por e-mail!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao solicitar recuperação de senha', details: err.message });
    }
};

// Redefinição de senha
const redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        const usuario = await authModel.buscarUsuarioPorToken(token);

        if (!usuario) {
            return res.status(400).json({ error: 'Token inválido ou expirado!' });
        }

        if (!usuario.token_expira_em || new Date(usuario.token_expira_em) < new Date()) {
            return res.status(400).json({ error: 'Token expirado!' });
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
        await authModel.atualizarSenha(usuario.id, novaSenhaHash);

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao redefinir senha', details: err.message });
    }
};

module.exports = {
    getUser,
    register,
    login,
    logout,
    tokenRecuperacao,
    redefinirSenha,
};
