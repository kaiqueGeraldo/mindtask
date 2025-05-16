const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

// Buscar todos os grupos de um usuário
const buscarGruposPorUsuario = async (usuarioId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .query('SELECT * FROM grupos_projeto WHERE usuario_id = @usuario_id');
    return result.recordset;
};

// Criar novo grupo
const criarGrupo = async (usuarioId, nome) => {
    const pool = await poolPromise;

    const ordemResult = await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .query(`
            SELECT ISNULL(MAX(ordem), -1) + 1 AS nova_ordem
            FROM grupos_projeto
            WHERE usuario_id = @usuario_id
        `);

    const novaOrdem = ordemResult.recordset[0].nova_ordem;

    const result = await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .input('nome', sql.VarChar(100), nome)
        .input('ordem', sql.Int, novaOrdem)
        .input('expandido', sql.Bit, 1)
        .query(`
            INSERT INTO grupos_projeto (usuario_id, nome, criado_em, ordem, expandido)
            OUTPUT INSERTED.*
            VALUES (@usuario_id, @nome, GETDATE(), @ordem, @expandido)
        `);

    return result.recordset[0];
};

// Atualizar grupo
const atualizarGrupo = async (id, campos) => {
    const pool = await poolPromise;

    const updates = [];
    const request = pool.request().input('id', sql.Int, id);

    if (campos.nome !== undefined) {
        updates.push('nome = @nome');
        request.input('nome', sql.VarChar(100), campos.nome);
    }

    if (campos.expandido !== undefined) {
        updates.push('expandido = @expandido');
        request.input('expandido', sql.Bit, campos.expandido ? 1 : 0);
    }

    if (updates.length === 0) {
        throw new Error('Nenhum campo para atualizar.');
    }

    const result = await request.query(`
        UPDATE grupos_projeto
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE id = @id
    `);

    return result.recordset[0];
};

// Atualizar ordem dos grupos
const atualizarOrdemGrupos = async (grupos) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (const { id, ordem } of grupos) {

            await transaction.request()
                .input('id', sql.Int, id)
                .input('ordem', sql.Int, ordem)
                .query(`
                    UPDATE grupos_projeto
                    SET ordem = @ordem
                    WHERE id = @id
                `);
        }

        await transaction.commit();
        return { sucesso: true };
    } catch (error) {
        console.error("Erro na transação:", error);
        await transaction.rollback();
        throw error;
    }
};

// Desagrupar projetos
const desagruparProjetos = async (grupo_id) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        await transaction.request()
            .input('grupo_id', sql.Int, grupo_id)
            .query(`
          UPDATE projetos
          SET grupo_id = NULL
          WHERE grupo_id = @grupo_id
        `);

        await transaction.commit();
        return { sucesso: true };
    } catch (error) {
        console.error("Erro na transação:", error);
        await transaction.rollback();
        throw error;
    }
};

// Deletar grupo
const deletarGrupo = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM grupos_projeto WHERE id = @id');
};

module.exports = {
    buscarGruposPorUsuario,
    criarGrupo,
    atualizarGrupo,
    atualizarOrdemGrupos,
    desagruparProjetos,
    deletarGrupo
};
