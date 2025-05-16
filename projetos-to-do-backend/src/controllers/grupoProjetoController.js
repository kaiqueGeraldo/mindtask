const grupoProjetoModel = require('../models/grupoProjetoModel');

// Listar grupos de um usuário
const listarGrupos = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const grupos = await grupoProjetoModel.buscarGruposPorUsuario(usuarioId);
        res.json(grupos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Criar novo grupo
const criarGrupo = async (req, res) => {
    const { usuario_id, nome } = req.body;
    try {
        const novoGrupo = await grupoProjetoModel.criarGrupo(usuario_id, nome);
        res.status(201).json(novoGrupo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar grupo
const atualizarGrupo = async (req, res) => {
    const { id } = req.params;
    const campos = req.body;

    try {
        const grupoAtualizado = await grupoProjetoModel.atualizarGrupo(id, campos);
        res.json(grupoAtualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar ordem dos grupos
const atualizarOrdemGrupos = async (req, res) => {
    const { grupos } = req.body;

    if (!Array.isArray(grupos)) {
        return res.status(400).json({ error: "Formato inválido para 'grupos'" });
    }

    try {
        const resultado = await grupoProjetoModel.atualizarOrdemGrupos(grupos);
        res.json(resultado);
    } catch (err) {
        console.log("Erro ao atualizar ordem:", err);
        res.status(500).json({ error: err.message });
    }
};

// Desagrupar projetos
const desagruparProjetos = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await grupoProjetoModel.desagruparProjetos(Number(id));

        if (resultado.sucesso) {
            res.json({ sucesso: true, mensagem: "Projetos desagrupados com sucesso" });
        } else {
            res.status(400).json({ error: "Erro ao desagrupar projetos" });
        }
    } catch (err) {
        console.log("Erro ao desagrupar projetos:", err);
        res.status(500).json({ error: err.message });
    }
};

// Deletar grupo
const deletarGrupo = async (req, res) => {
    const { id } = req.params;
    try {
        await grupoProjetoModel.deletarGrupo(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listarGrupos,
    criarGrupo,
    atualizarGrupo,
    atualizarOrdemGrupos,
    desagruparProjetos,
    deletarGrupo
};
