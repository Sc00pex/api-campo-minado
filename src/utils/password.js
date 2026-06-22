const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function gerarHash(senha) {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

async function compararSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}

module.exports = { gerarHash, compararSenha };
