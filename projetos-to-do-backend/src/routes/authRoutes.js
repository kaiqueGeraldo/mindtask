const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middleware = require('../middlewares/middleware');

router.get('/user', middleware, authController.getUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/enviar-token-recuperacao', authController.tokenRecuperacao);
router.put('/redefinir-senha', authController.redefinirSenha);

module.exports = router;
