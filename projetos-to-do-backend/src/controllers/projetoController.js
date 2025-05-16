const projetoModel = require('../models/projetoModel');

// Listar projetos de um usuário
const listarProjetos = async (req, res) => {
    const { usuarioId } = req.params;

    if (!usuarioId) {
        return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    try {
        const projetos = await projetoModel.buscarProjetosPorUsuario(Number(usuarioId));
        res.status(200).json(projetos);
    } catch (err) {
        console.error("Erro ao listar projetos:", err);
        res.status(500).json({ error: "Erro ao listar projetos" });
    }
};

// Buscar projeto por id
const obterProjetoPorId = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.user?.id || req.query.usuarioId;

    if (!usuarioId) {
        return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    try {
        const projeto = await projetoModel.buscarProjetoPorId(Number(id), Number(usuarioId));

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado ou não pertence ao usuário" });
        }

        res.status(200).json(projeto);
    } catch (err) {
        console.error("Erro ao buscar projeto por ID:", err);
        res.status(500).json({ error: "Erro ao buscar projeto" });
    }
};

// Criar novo projeto
const criarProjeto = async (req, res) => {
    const { usuario_id, grupo_id, nome, descricao } = req.body;

    try {
        const novoProjeto = await projetoModel.criarProjeto({
            usuario_id,
            grupo_id: grupo_id ?? null,
            nome,
            descricao: descricao ?? ''
        });

        res.status(201).json(novoProjeto);
    } catch (err) {
        console.error('Erro ao criar projeto:', err);
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
};

// Atualizar projeto
const atualizarProjeto = async (req, res) => {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    try {
        const projeto = await projetoModel.atualizarProjeto(Number(id), dadosAtualizados);
        res.status(200).json(projeto);
    } catch (err) {
        console.error("Erro ao atualizar projeto:", err);
        res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
};

// Atualizar nome de um projeto
const atualizarNomeProjeto = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ error: "Nome é obrigatório." });
    }

    try {
        const projetoAtualizado = await projetoModel.atualizarNomeProjeto(id, nome.trim());
        res.json(projetoAtualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar grupo de um projeto
const atualizarGrupoDoProjeto = async (req, res) => {
    const { id } = req.params;
    const { grupo_id } = req.body;

    try {
        const projetoAtualizado = await projetoModel.atualizarGrupoDoProjeto(id, grupo_id);
        res.json(projetoAtualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar ordem de um projeto
const atualizarOrdemProjetos = async (req, res) => {
    const { projetos } = req.body;

    if (!Array.isArray(projetos)) {
        return res.status(400).json({ error: "Formato inválido para 'projetos'" });
    }

    try {
        const resultado = await projetoModel.atualizarOrdemProjetos(projetos);
        res.json(resultado);
    } catch (err) {
        console.error("Erro na transação:", err);
        res.status(500).json({ error: err.message });
    }
};

// Deletar projeto
const deletarProjeto = async (req, res) => {
    const { id } = req.params;
    const projetoId = Number(id);

    try {
        const resultado = await projetoModel.deletarProjeto(projetoId);

        if (!resultado) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Erro ao deletar projeto:", err);
        res.status(500).json({ error: "Erro ao deletar projeto" });
    }
};

module.exports = {
    listarProjetos,
    obterProjetoPorId,
    criarProjeto,
    atualizarProjeto,
    atualizarNomeProjeto,
    atualizarGrupoDoProjeto,
    atualizarOrdemProjetos,
    deletarProjeto
};
