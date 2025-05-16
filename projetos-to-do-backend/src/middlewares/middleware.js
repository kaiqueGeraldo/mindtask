const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado! Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
            nome: decoded.nome,
            email: decoded.email,
            usandoContaVinculada: Boolean(decoded.usandoContaVinculada),
            contaOriginal: decoded.contaOriginal ?? null,
        };

        next();
    } catch (err) {
        console.error("Erro ao verificar token:", err.message);
        res.status(401).json({ error: 'Token inválido!' });
    }
};

module.exports = authMiddleware;
