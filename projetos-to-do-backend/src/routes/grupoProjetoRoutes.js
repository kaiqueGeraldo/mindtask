const express = require('express');
const router = express.Router();
const grupoProjetoController = require('../controllers/grupoProjetoController');

router.get('/:usuarioId', grupoProjetoController.listarGrupos);
router.post('/', grupoProjetoController.criarGrupo);
router.post('/:id/desagrupar', grupoProjetoController.desagruparProjetos);
router.put('/ordem', grupoProjetoController.atualizarOrdemGrupos);
router.put('/:id', grupoProjetoController.atualizarGrupo);
router.delete('/:id', grupoProjetoController.deletarGrupo);

module.exports = router;
