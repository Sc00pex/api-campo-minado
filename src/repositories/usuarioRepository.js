const { pool } = require('../config/database');
const Usuario = require('../models/Usuario');

const usuarioRepository = {
  async buscarPorEmail(email, db = pool) {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return Usuario.fromRow(rows[0]);
  },

  async buscarPorId(id, db = pool) {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return Usuario.fromRow(rows[0]);
  },

  async criar({ nome, email, dataNascimento, senha }, db = pool) {
    const { rows } = await db.query(
      `INSERT INTO usuarios (nome, email, data_nascimento, senha)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, email, dataNascimento, senha]
    );
    return Usuario.fromRow(rows[0]);
  },

  async atualizarSenha(id, novaSenha, db = pool) {
    await db.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [novaSenha, id]);
  },

  async definirSaldo(id, saldo, db = pool) {
    const { rows } = await db.query(
      'UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING *',
      [saldo, id]
    );
    return Usuario.fromRow(rows[0]);
  },

  async ajustarSaldo(id, delta, db = pool) {
    const { rows } = await db.query(
      'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2 RETURNING *',
      [delta, id]
    );
    return Usuario.fromRow(rows[0]);
  },

  async deletar(id, db = pool) {
    const { rowCount } = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return rowCount > 0;
  },
};

module.exports = usuarioRepository;
