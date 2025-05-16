const express = require('express');
const router = express.Router();
const tecnologiaController = require('../controllers/tecnologiaController');

router.get('/', tecnologiaController.listarTecnologias);
router.get('/:projetoId', tecnologiaController.listarTecnologiasPorProjeto);
router.put("/:id", tecnologiaController.atualizarTecnologias);
router.delete("/:projeto_id/:tecnologia_id", tecnologiaController.removerTecnologiaProjeto);

module.exports = router;
