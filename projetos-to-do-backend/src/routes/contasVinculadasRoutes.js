const express = require('express');
const router = express.Router();
const controller = require('../controllers/contasVinculadasController');
const authMiddleware = require('../middlewares/middleware');

router.post('/trocar-conta', authMiddleware, controller.trocarConta);
router.post('/vincular-login', authMiddleware, controller.adicionarConta);
router.post('/vincular-cadastro', authMiddleware, controller.vincularContaDireto);
router.post('/aprovar-token', controller.aprovarPorToken);
router.get('/listar', controller.listarVinculadas); 
router.get('/token',authMiddleware, controller.gerarVinculoToken); 
router.post('/verificar-vinculo-token', controller.verificarVinculoToken); 
router.delete('/:contaId', authMiddleware, controller.removerVinculo);

module.exports = router;
