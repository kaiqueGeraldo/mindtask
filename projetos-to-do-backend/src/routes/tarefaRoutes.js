const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

router.get('/:projetoId', tarefaController.listarTarefas);
router.post('/atualizar-ordem', tarefaController.atualizarOrdemTarefas);
router.post('/', tarefaController.criarTarefa);
router.put('/:id', tarefaController.atualizarTarefa);
router.delete('/:id', tarefaController.deletarTarefa);

module.exports = router;
