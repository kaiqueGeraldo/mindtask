const tarefaModel = require('../models/tarefaModel');

// Listar tarefas de um projeto
const listarTarefas = async (req, res) => {
    const { projetoId } = req.params;
    try {
        const tarefas = await tarefaModel.listarTarefas(projetoId);
        res.json(tarefas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Criar nova tarefa
const criarTarefa = async (req, res) => {
    const { projeto_id, projetoId, titulo, ordem_pendente } = req.body;
    const id = projeto_id || projetoId;

    try {
        const novaTarefa = await tarefaModel.criarTarefa(id, titulo, ordem_pendente);
        res.status(201).json(novaTarefa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar tarefa
const atualizarTarefa = async (req, res) => {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
        const tarefaAtualizada = await tarefaModel.atualizarTarefa(parseInt(id), dadosAtualizados);
        res.json(tarefaAtualizada);
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err);
        res.status(500).json({ error: err.message });
    }
};

// Atualizar ordem das tarefas
const atualizarOrdemTarefas = async (req, res) => {
    const tarefas = req.body;

    if (!Array.isArray(tarefas)) {
        return res.status(400).json({ error: 'Formato inválido. Esperado array de tarefas.' });
    }

    try {
        await tarefaModel.atualizarOrdemTarefas(tarefas);
        res.json({ sucesso: true });
    } catch (err) {
        console.error('Erro ao atualizar ordem das tarefas:', err);
        res.status(500).json({ error: 'Erro ao atualizar ordem das tarefas.' });
    }
};

// Deletar tarefa
const deletarTarefa = async (req, res) => {
    const { id } = req.params;
    try {
        await tarefaModel.removerTarefa(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listarTarefas,
    criarTarefa,
    atualizarTarefa,
    atualizarOrdemTarefas,
    deletarTarefa
};
