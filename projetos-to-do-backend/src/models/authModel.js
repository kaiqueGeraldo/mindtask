const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../config/dbConfig');

// Buscar usuário por login ou email
const buscarUsuarioPorEmail = async (email) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('email', sql.VarChar(100), email)
        .query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = @email');
    return result.recordset[0];
};

// Buscar usuário por id
const buscarUsuarioPorId = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT id, nome, email, senha_hash FROM usuarios WHERE id = @id');
    return result.recordset[0];
};

// Criar novo usuário
const criarUsuario = async (nome, email, senhaHash) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('nome', sql.VarChar(100), nome)
        .input('email', sql.VarChar(100), email)
        .input('senha_hash', sql.VarChar(255), senhaHash)
        .query(`
            INSERT INTO usuarios (nome, email, senha_hash, criado_em)
            OUTPUT INSERTED.*
            VALUES (@nome, @email, @senha_hash, GETDATE())
        `);

    return result.recordset[0];
};

// Salvar token de recuperação
const salvarTokenRecuperacao = async (email, token) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar(150), email)
            .input('token_recuperacao', sql.VarChar(255), token)
            .input('token_expira_em', sql.DateTime, new Date(Date.now() + 10 * 60 * 1000))
            .query(`
                UPDATE usuarios
                SET token_recuperacao = @token_recuperacao, token_expira_em = @token_expira_em
                WHERE email = @email
            `);

        return result.rowsAffected > 0;
    } catch (error) {
        console.error('Erro ao salvar token:', error);
        return false;
    }
};

// Buscar usuário por token de recuperação
const buscarUsuarioPorToken = async (token) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT id, email, token_recuperacao, token_expira_em FROM usuarios WHERE token_recuperacao IS NOT NULL`);

        for (const usuario of result.recordset) {
            if (await bcrypt.compare(token, usuario.token_recuperacao)) {
                return usuario;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar usuário por token:', error);
        return null;
    }
};

// Redefinir senha e limpar o token de recuperação
const atualizarSenha = async (id, novaSenhaHash) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('senha_hash', sql.VarChar(255), novaSenhaHash)
            .query(`
                UPDATE usuarios
                SET senha_hash = @senha_hash, token_recuperacao = NULL, token_expira_em = NULL
                WHERE id = @id
            `);
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
    }
};

module.exports = {
    buscarUsuarioPorEmail,
    buscarUsuarioPorId,
    criarUsuario,
    salvarTokenRecuperacao,
    buscarUsuarioPorToken,
    atualizarSenha,
};
