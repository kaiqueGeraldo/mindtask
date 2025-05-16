const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

router.get('/usuario/:usuarioId', projetoController.listarProjetos);
router.get("/:id", projetoController.obterProjetoPorId);
router.post('/', projetoController.criarProjeto);
router.put('/ordem', projetoController.atualizarOrdemProjetos);
router.put('/grupo/:id', projetoController.atualizarGrupoDoProjeto);
router.put("/nome/:id", projetoController.atualizarNomeProjeto);
router.put('/:id', projetoController.atualizarProjeto);
router.delete('/:id', projetoController.deletarProjeto);

module.exports = router;
