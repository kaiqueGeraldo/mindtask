const tecnologiaModel = require('../models/tecnologiaModel');

// Listar tecnologias disponíveis
const listarTecnologias = async (req, res) => {
    try {
        const tecnologias = await tecnologiaModel.listarTecnologias();
        res.json(tecnologias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar tecnologias de um projeto
const listarTecnologiasPorProjeto = async (req, res) => {
    const { projetoId } = req.params;
    try {
        const tecnologias = await tecnologiaModel.listarTecnologiasPorProjeto(projetoId);
        res.json(tecnologias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar tecnologias de um projeto
const atualizarTecnologias = async (req, res) => {
    const projetoId = parseInt(req.params.id);
    const { tecnologiaIds } = req.body;

    if (!Array.isArray(tecnologiaIds)) {
        return res.status(400).json({ erro: "Lista de tecnologias inválida." });
    }

    try {
        await tecnologiaModel.atualizarTecnologiasProjeto(projetoId, tecnologiaIds);
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Erro ao atualizar tecnologias:", err);
        res.status(500).json({ erro: "Erro interno ao atualizar tecnologias." });
    }
};

// Remover tecnologia de um projeto
const removerTecnologiaProjeto = async (req, res) => {
    const { projeto_id, tecnologia_id } = req.params;
    try {
        await tecnologiaModel.removerTecnologiaProjeto(Number(projeto_id), Number(tecnologia_id));
        res.status(204).send();
    } catch (err) {
        console.error("Erro ao remover tecnologia do projeto:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listarTecnologias,
    listarTecnologiasPorProjeto,
    atualizarTecnologias,
    removerTecnologiaProjeto,
};
