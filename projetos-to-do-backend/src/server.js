const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const grupoProjetoRoutes = require('./routes/grupoProjetoRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const tecnologiaRoutes = require('./routes/tecnologiaRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes');
const contasVinculadasRoutes = require('./routes/contasVinculadasRoutes')

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/grupos', grupoProjetoRoutes);
app.use('/api/projetos', projetoRoutes);
app.use('/api/tecnologias', tecnologiaRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/contas', contasVinculadasRoutes);

// Conexão com o banco e inicialização do servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
