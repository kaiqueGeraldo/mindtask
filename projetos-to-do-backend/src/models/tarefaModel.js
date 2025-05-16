const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');


// Buscar tarefas por projeto ID
const buscarPorProjetoId = async (projetoId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`
        SELECT id, titulo, feito, criado_em
        FROM tarefas
        WHERE projeto_id = @projeto_id
      `);
    return result.recordset;
};

// Listar tarefas de um projeto
const listarTarefas = async (projetoId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`
            SELECT * 
            FROM tarefas 
            WHERE projeto_id = @projeto_id 
        `);
    return result.recordset;
};

// Criar novas tarefas para um projeto
const criarTarefa = async (projetoId, titulo, ordem_pendente) => {
    const pool = await poolPromise;

    // Se ordem_pendente for undefined/null, calcula a próxima ordem
    if (ordem_pendente == null) {
        const max = await pool.request()
            .input('projeto_id', sql.Int, projetoId)
            .query(`
                SELECT ISNULL(MAX(ordem_pendente), 0) + 1 AS proxima_ordem
                FROM tarefas
                WHERE projeto_id = @projeto_id AND feito = 0
            `);
        ordem_pendente = max.recordset[0].proxima_ordem;
    }

    const result = await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .input('titulo', sql.VarChar, titulo)
        .input('ordem_pendente', sql.Int, ordem_pendente)
        .query(`
        INSERT INTO tarefas (projeto_id, titulo, feito, criado_em, ordem_pendente)
        OUTPUT INSERTED.*
        VALUES (@projeto_id, @titulo, 0, GETDATE(), @ordem_pendente)
    `);

    await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`UPDATE projetos SET atualizado_em = GETDATE() WHERE id = @projeto_id`);

    return result.recordset[0];
};

// Atualizar uma tarefa existente
const atualizarTarefa = async (id, dadosAtualizados) => {
    const pool = await poolPromise;
    const request = pool.request().input('id', sql.Int, id);

    const sets = [];

    let projetoId = null;

    if (dadosAtualizados.titulo !== undefined) {
        request.input('titulo', sql.VarChar(255), dadosAtualizados.titulo);
        sets.push('titulo = @titulo');
    }

    if (dadosAtualizados.feito !== undefined) {
        const feito = dadosAtualizados.feito;

        const tarefaResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT projeto_id FROM tarefas WHERE id = @id');

        if (tarefaResult.recordset.length === 0) {
            throw new Error('Tarefa não encontrada');
        }

        projetoId = tarefaResult.recordset[0].projeto_id;

        const campoOrdem = feito ? 'ordem_concluida' : 'ordem_pendente';
        const ordemResult = await pool.request()
            .input('projeto_id', sql.Int, projetoId)
            .query(`
                SELECT ISNULL(MAX(${campoOrdem}), 0) + 1 AS proxima_ordem
                FROM tarefas
                WHERE projeto_id = @projeto_id AND feito = ${feito ? 1 : 0}
            `);

        const novaOrdem = ordemResult.recordset[0].proxima_ordem;

        request.input('feito', sql.Bit, feito);
        request.input('novaOrdem', sql.Int, novaOrdem);
        sets.push('feito = @feito');

        if (feito) {
            sets.push('ordem_concluida = @novaOrdem');
            sets.push('ordem_pendente = NULL');
        } else {
            sets.push('ordem_pendente = @novaOrdem');
            sets.push('ordem_concluida = NULL');
        }
    }

    const setClause = sets.join(', ');

    if (!setClause) throw new Error('Nenhum campo para atualizar');

    const result = await request.query(`
        UPDATE tarefas
        SET ${setClause}
        OUTPUT INSERTED.*
        WHERE id = @id
    `);

    // Atualiza o campo atualizar_em do projeto
    if (!projetoId) {
        // Se não foi definido antes (ex: só título atualizado), buscar o projeto_id
        const tarefaResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT projeto_id FROM tarefas WHERE id = @id');

        if (tarefaResult.recordset.length === 0) {
            throw new Error('Tarefa não encontrada para atualizar o projeto');
        }

        projetoId = tarefaResult.recordset[0].projeto_id;
    }

    await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`
            UPDATE projetos
            SET atualizado_em = GETDATE()
            WHERE id = @projeto_id
        `);

    return result.recordset[0];
};

// Atualizar ordem de múltiplas tarefas
const atualizarOrdemTarefas = async (tarefas) => {
    if (!Array.isArray(tarefas) || tarefas.length === 0) return;

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (let i = 0; i < tarefas.length; i++) {
            const { id, ordem_pendente, ordem_concluida } = tarefas[i];
            const req = new sql.Request(transaction);

            req.input('id', sql.Int, id);

            let setClauses = [];
            if (ordem_pendente !== undefined) {
                req.input('ordem_pendente', sql.Int, ordem_pendente);
                setClauses.push('ordem_pendente = @ordem_pendente');
            }
            if (ordem_concluida !== undefined) {
                req.input('ordem_concluida', sql.Int, ordem_concluida);
                setClauses.push('ordem_concluida = @ordem_concluida');
            }

            if (setClauses.length === 0) continue;

            const query = `
                UPDATE tarefas
                SET ${setClauses.join(', ')}
                WHERE id = @id
            `;

            await req.query(query);
        }

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Remover uma tarefa de um projeto
const removerTarefa = async (id) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT projeto_id FROM tarefas WHERE id = @id');

    if (result.recordset.length > 0) {
        const projetoId = result.recordset[0].projeto_id;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tarefas WHERE id = @id');

        await pool.request()
            .input('projeto_id', sql.Int, projetoId)
            .query('UPDATE projetos SET atualizado_em = GETDATE() WHERE id = @projeto_id');
    }
};

// Remover todas as tarefas de um projeto
const removerTarefasPorIds = async (ids, transaction) => {
    if (!Array.isArray(ids)) ids = [ids];
    if (ids.length === 0) return;

    const request = transaction.request();
    ids.forEach((id, index) => {
        request.input(`id${index}`, sql.Int, id);
    });

    const placeholders = ids.map((_, index) => `@id${index}`).join(", ");
    await request.query(`DELETE FROM tarefas WHERE projeto_id IN (${placeholders})`);
};

module.exports = {
    buscarPorProjetoId,
    listarTarefas,
    criarTarefa,
    atualizarTarefa,
    atualizarOrdemTarefas,
    removerTarefa,
    removerTarefasPorIds,
};