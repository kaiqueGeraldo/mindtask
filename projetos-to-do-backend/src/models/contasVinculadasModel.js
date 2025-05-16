const sql = require('mssql');
const { poolPromise } = require('../config/dbConfig');

const vincularConta = async (dono_id, conta_vinculada_id, aprovada = false) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('dono_id', sql.Int, dono_id);
    request.input('conta_vinculada_id', sql.Int, conta_vinculada_id);
    request.input('aprovada', sql.Bit, aprovada ? 1 : 0);
    await request.query(`
      INSERT INTO contas_vinculadas (dono_id, conta_vinculada_id, aprovada, aprovado_em)
      VALUES (@dono_id, @conta_vinculada_id, @aprovada, GETDATE())
  `);
};

const listarContasVinculadas = async (dono_id) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('dono_id', sql.Int, dono_id);
    const result = await request.query(`
        SELECT u.id, u.nome, u.email
        FROM contas_vinculadas cv
        JOIN usuarios u ON u.id = cv.conta_vinculada_id
        WHERE cv.dono_id = @dono_id AND cv.aprovada = 1
    `);
    return result.recordset;
};

const aprovarVinculo = async (dono_id, conta_vinculada_id) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("dono_id", sql.Int, dono_id);
    request.input("conta_vinculada_id", sql.Int, conta_vinculada_id);

    const result = await request.query(`
    UPDATE contas_vinculadas
    SET aprovada = 1,
        aprovado_em = GETDATE()
    WHERE dono_id = @dono_id
      AND conta_vinculada_id = @conta_vinculada_id
      AND aprovada = 0 
  `);

    return result.rowsAffected?.[0] || 0;
};

const verificarVinculoExistente = async (dono_id, conta_vinculada_id) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('dono_id', sql.Int, dono_id);
    request.input('conta_vinculada_id', sql.Int, conta_vinculada_id);
    const result = await request.query(`
        SELECT * FROM contas_vinculadas
        WHERE dono_id = @dono_id AND conta_vinculada_id = @conta_vinculada_id
    `);
    return result.recordset[0];
};

const removerVinculo = async (donoId, contaId) => {
    const pool = await poolPromise;
    await pool.request()
        .input('donoId', sql.Int, donoId)
        .input('contaId', sql.Int, contaId)
        .query(`
            DELETE FROM contas_vinculadas 
            WHERE dono_id = @donoId AND conta_vinculada_id = @contaId
        `);
};

module.exports = {
    vincularConta,
    listarContasVinculadas,
    aprovarVinculo,
    verificarVinculoExistente,
    removerVinculo
};
