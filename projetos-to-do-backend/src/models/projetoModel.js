const { poolPromise } = require('../config/dbConfig');
const tecnologiaModel = require('../models/tecnologiaModel');
const tarefaModel = require('../models/tarefaModel');
const sql = require('mssql');

// Buscar projetos de um usuário
const buscarProjetosPorUsuario = async (usuarioId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .query(`
        SELECT 
            p.id,
            p.usuario_id,
            p.grupo_id,
            p.nome,
            p.descricao,
            p.status,
            p.favorito,
            p.ordem,
            p.criado_em,
            p.atualizado_em,
            p.concluido_em,
  
            (
                SELECT 
                    t.id, 
                    t.nome, 
                    t.categoria
                FROM projeto_tecnologia pt
                INNER JOIN tecnologias t ON t.id = pt.tecnologia_id
                WHERE pt.projeto_id = p.id
                FOR JSON PATH
            ) AS tecnologias,
  
            (
                SELECT 
                    id, 
                    titulo, 
                    feito, 
                    criado_em,
                    ordem_pendente,
                    ordem_concluida
                FROM tarefas
                WHERE projeto_id = p.id
                FOR JSON PATH
            ) AS tarefas
  
        FROM projetos p
        WHERE p.usuario_id = @usuario_id
        ORDER BY p.ordem ASC
      `);

    const projetos = result.recordset.map(projeto => ({
        ...projeto,
        tecnologias: JSON.parse(projeto.tecnologias || '[]'),
        tarefas: JSON.parse(projeto.tarefas || '[]'),
    }));

    return projetos;
};

// Buscar projeto por id
const buscarProjetoPorId = async (id, usuarioId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('usuario_id', sql.Int, usuarioId)
        .query(`
            SELECT 
                p.id,
                p.usuario_id,
                p.grupo_id,
                p.nome,
                p.descricao,
                p.status,
                p.favorito,
                p.ordem,
                p.criado_em,
                p.atualizado_em,
                p.concluido_em,

                -- Subquery: tecnologias
                (
                    SELECT 
                        t.id, 
                        t.nome, 
                        t.categoria
                    FROM projeto_tecnologia pt
                    INNER JOIN tecnologias t ON t.id = pt.tecnologia_id
                    WHERE pt.projeto_id = p.id
                    FOR JSON PATH
                ) AS tecnologias,

                -- Subquery: tarefas
                  (
                    SELECT 
                        id, 
                        titulo, 
                        feito, 
                        criado_em,
                        ordem_pendente,
                        ordem_concluida
                    FROM tarefas
                    WHERE projeto_id = p.id
                    FOR JSON PATH
                ) AS tarefas

            FROM projetos p
            WHERE p.id = @id AND p.usuario_id = @usuario_id
        `);

    if (!result.recordset[0]) return null;

    const projeto = result.recordset[0];
    projeto.tecnologias = JSON.parse(projeto.tecnologias || '[]');
    projeto.tarefas = JSON.parse(projeto.tarefas || '[]');

    return projeto;
};

// Criar novo projeto
const criarProjeto = async ({ usuario_id, grupo_id, nome, descricao }) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        let novaOrdem = 0;

        if (grupo_id !== null && grupo_id !== undefined) {
            const ordemRequest = transaction.request()
                .input('grupo_id', sql.Int, grupo_id);

            const ordemResult = await ordemRequest.query(`
                SELECT ISNULL(MAX(ordem), -1) + 1 AS nova_ordem 
                FROM projetos 
                WHERE grupo_id = @grupo_id
            `);

            novaOrdem = ordemResult.recordset[0].nova_ordem;

            // Atualiza expandido para true (1) se estiver false (0)
            const updateExpandidoRequest = transaction.request()
                .input('grupo_id', sql.Int, grupo_id);

            await updateExpandidoRequest.query(`
                UPDATE grupos_projeto
                SET expandido = 1
                WHERE id = @grupo_id AND expandido = 0
            `);
        } else {
            const ordemRequest = transaction.request()
                .input('usuario_id', sql.Int, usuario_id);

            const ordemResult = await ordemRequest.query(`
                SELECT ISNULL(MAX(ordem), -1) + 1 AS nova_ordem 
                FROM projetos 
                WHERE grupo_id IS NULL AND usuario_id = @usuario_id
            `);

            novaOrdem = ordemResult.recordset[0].nova_ordem;
        }

        const insertRequest = transaction.request()
            .input('usuario_id', sql.Int, usuario_id)
            .input('grupo_id', sql.Int, grupo_id)
            .input('nome', sql.VarChar(100), nome)
            .input('descricao', sql.Text, descricao)
            .input('ordem', sql.Int, novaOrdem);

        const projetoResult = await insertRequest.query(`
            INSERT INTO projetos (
                usuario_id, grupo_id, nome, descricao, status, favorito, criado_em, atualizado_em, ordem, concluido_em
            )
            OUTPUT INSERTED.*
            VALUES (
                @usuario_id, @grupo_id, @nome, @descricao, 0, 0, GETDATE(), GETDATE(), @ordem, NULL
            )
        `);

        await transaction.commit();
        return projetoResult.recordset[0];
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Atualizar projeto
const atualizarProjeto = async (id, dadosAtualizados) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = transaction.request();
        request.input('id', sql.Int, id);

        const campos = [];
        const tipos = {
            grupo_id: sql.Int,
            nome: sql.VarChar(100),
            descricao: sql.Text,
            status: sql.Int,
            favorito: sql.Bit,
        };

        for (const [chave, valor] of Object.entries(dadosAtualizados)) {
            if (tipos[chave] !== undefined && valor !== undefined) {
                request.input(chave, tipos[chave], valor);
                campos.push(`${chave} = @${chave}`);
            }
        }

        if (dadosAtualizados.status === 2) {
            campos.push(`concluido_em = GETDATE()`);
        } else if (dadosAtualizados.status !== undefined && dadosAtualizados.status !== 2) {
            campos.push(`concluido_em = NULL`);
        }

        let projeto;

        if (campos.length > 0) {
            const query = `
        UPDATE projetos
        SET ${campos.join(', ')}, atualizado_em = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `;
            const result = await request.query(query);
            projeto = result.recordset[0];
        } else {
            const result = await request.query(`SELECT * FROM projetos WHERE id = @id`);
            projeto = result.recordset[0];
        }

        // Atualizar tecnologias
        if (Array.isArray(dadosAtualizados.tecnologias)) {
            await tecnologiaModel.atualizarTecnologiasProjeto(transaction, id, dadosAtualizados.tecnologias);
        }

        // Atualizar tarefas
        if (Array.isArray(dadosAtualizados.tarefas)) {
            await tarefaModel.atualizarTarefasProjeto(transaction, id, dadosAtualizados.tarefas);
        }

        await transaction.commit();
        return projeto;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Atualizar nome de um projeto
const atualizarNomeProjeto = async (id, novoNome) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("nome", sql.VarChar(100), novoNome)
        .query(`
        UPDATE projetos
        SET nome = @nome,
            atualizado_em = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return result.recordset[0];
};

// Atualizar grupo de um projeto
const atualizarGrupoDoProjeto = async (id, grupo_id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('grupo_id', sql.Int, grupo_id)
        .query(`
            UPDATE projetos
            SET grupo_id = @grupo_id,
                atualizado_em = GETDATE()
            OUTPUT INSERTED.*
            WHERE id = @id
        `);
    return result.recordset[0];
};

// Atualizar ordem de um projeto
const atualizarOrdemProjetos = async (projetos) => {
    const pool = await poolPromise;

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (const { id, ordem } of projetos) {
            await transaction.request()
                .input('id', sql.Int, id)
                .input('ordem', sql.Int, ordem)
                .query(`
            UPDATE projetos
            SET ordem = @ordem,
                atualizado_em = GETDATE()
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

const deletarProjeto = async (projetoId) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const projetoResult = await transaction.request()
            .input('id', sql.Int, projetoId)
            .query('SELECT * FROM projetos WHERE id = @id');

        if (projetoResult.recordset.length === 0) {
            await transaction.rollback();
            return null;
        }

        await tecnologiaModel.removerTecnologiasPorProjetoIds([projetoId], transaction);
        await tarefaModel.removerTarefasPorIds([projetoId], transaction);

        await transaction.request()
            .input('id', sql.Int, projetoId)
            .query('DELETE FROM projetos WHERE id = @id');

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

module.exports = {
    buscarProjetosPorUsuario,
    buscarProjetoPorId,
    criarProjeto,
    atualizarProjeto,
    atualizarNomeProjeto,
    atualizarGrupoDoProjeto,
    atualizarOrdemProjetos,
    deletarProjeto
};
