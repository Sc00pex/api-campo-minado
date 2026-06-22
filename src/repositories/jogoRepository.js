const { pool } = require('../config/database');
const Jogo = require('../models/Jogo');

const jogoRepository = {
  async buscarPorId(id, db = pool) {
    const { rows } = await db.query('SELECT * FROM jogos WHERE id = $1', [id]);
    return Jogo.fromRow(rows[0]);
  },

  async buscarPartidaEmAndamento(idUsuario, db = pool) {
    const { rows } = await db.query(
      `SELECT * FROM jogos WHERE id_usuario = $1 AND status = 'EM_ANDAMENTO' LIMIT 1`,
      [idUsuario]
    );
    return Jogo.fromRow(rows[0]);
  },

  async criar({ idUsuario, valorAposta, tabuleiro }, db = pool) {
    const { rows } = await db.query(
      `INSERT INTO jogos (id_usuario, valor_aposta, tabuleiro)
       VALUES ($1, $2, $3) RETURNING *`,
      [idUsuario, valorAposta, JSON.stringify(tabuleiro)]
    );
    return Jogo.fromRow(rows[0]);
  },

  async registrarRevelacao(id, { posicoesReveladas, diamantesEncontrados, premioAtual }, db = pool) {
    const { rows } = await db.query(
      `UPDATE jogos
         SET posicoes_reveladas = $1, diamantes_encontrados = $2, premio_atual = $3
       WHERE id = $4 RETURNING *`,
      [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, id]
    );
    return Jogo.fromRow(rows[0]);
  },

  async finalizar(id, status, premioAtual, db = pool) {
    const { rows } = await db.query(
      `UPDATE jogos
         SET status = $1, premio_atual = $2, finalizado_em = NOW()
       WHERE id = $3 RETURNING *`,
      [status, premioAtual, id]
    );
    return Jogo.fromRow(rows[0]);
  },

  async estatisticas(idUsuario, db = pool) {
    const { rows } = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE status IN ('GANHO', 'PERDIDO'))           AS total_jogos,
         COUNT(*) FILTER (WHERE status = 'GANHO')                         AS vitorias,
         COUNT(*) FILTER (WHERE status = 'PERDIDO')                       AS derrotas,
         COALESCE(SUM(premio_atual - valor_aposta)
                  FILTER (WHERE status = 'GANHO'), 0)                     AS valor_ganho,
         COALESCE(SUM(valor_aposta)
                  FILTER (WHERE status = 'PERDIDO'), 0)                   AS valor_perdido
       FROM jogos
       WHERE id_usuario = $1`,
      [idUsuario]
    );
    return rows[0];
  },
};

module.exports = jogoRepository;
