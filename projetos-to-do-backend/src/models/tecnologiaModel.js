const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

// Buscar projeto por id
const buscarPorProjetoId = async (projetoId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`
            SELECT t.id, t.nome, t.categoria
            FROM projeto_tecnologia pt
            INNER JOIN tecnologias t ON t.id = pt.tecnologia_id
            WHERE pt.projeto_id = @projeto_id
        `);
    return result.recordset;
};

// Listar todas tecnologias disponíveis
const listarTecnologias = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM tecnologias ORDER BY categoria ASC, nome ASC');
    return result.recordset;
};

// Listar tecnologias associadas a um projeto
const listarTecnologiasPorProjeto = async (projetoId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .query(`
            SELECT t.*
            FROM tecnologias t
            INNER JOIN projeto_tecnologia pt ON pt.tecnologia_id = t.id
            WHERE pt.projeto_id = @projeto_id
        `);
    return result.recordset;
};

// Atualizar tecnologias de um projeto
const atualizarTecnologiasProjeto = async (projetoId, tecnologiaIds) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);

        await request
            .input('projeto_id', sql.Int, projetoId)
            .query(`DELETE FROM projeto_tecnologia WHERE projeto_id = @projeto_id`);

        if (tecnologiaIds.length > 0) {
            const valuesSql = tecnologiaIds
                .map((_, i) => `SELECT @projeto_id AS projeto_id, @tec${i} AS tecnologia_id`)
                .join(' UNION ALL ');

            const insertRequest = new sql.Request(transaction);
            insertRequest.input('projeto_id', sql.Int, projetoId);

            tecnologiaIds.forEach((id, i) => {
                insertRequest.input(`tec${i}`, sql.Int, id);
            });

            await insertRequest.query(`
        INSERT INTO projeto_tecnologia (projeto_id, tecnologia_id)
        ${valuesSql}
      `);
        }

        await transaction.request()
            .input("projeto_id", sql.Int, projetoId)
            .query(`UPDATE projetos SET atualizado_em = GETDATE() WHERE id = @projeto_id`);

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Remover tecnologia de um projeto
const removerTecnologiaProjeto = async (projetoId, tecnologiaId) => {
    const pool = await poolPromise;
    await pool.request()
        .input('projeto_id', sql.Int, projetoId)
        .input('tecnologia_id', sql.Int, tecnologiaId)
        .query(`
      DELETE FROM projeto_tecnologia WHERE projeto_id = @projeto_id AND tecnologia_id = @tecnologia_id;
      UPDATE projetos SET atualizado_em = GETDATE() WHERE id = @projeto_id;
    `);
};

// Remover todas as tecnologias de um projeto
const removerTecnologiasPorProjetoIds = async (ids, transaction) => {
    if (!Array.isArray(ids)) ids = [ids];
    if (ids.length === 0) return;

    const request = transaction.request();
    ids.forEach((id, index) => {
        request.input(`id${index}`, sql.Int, id);
    });

    const placeholders = ids.map((_, index) => `@id${index}`).join(", ");
    await request.query(`DELETE FROM projeto_tecnologia WHERE projeto_id IN (${placeholders})`);
};

module.exports = {
    buscarPorProjetoId,
    listarTecnologias,
    listarTecnologiasPorProjeto,
    atualizarTecnologiasProjeto,
    removerTecnologiaProjeto,
    removerTecnologiasPorProjetoIds,
};
