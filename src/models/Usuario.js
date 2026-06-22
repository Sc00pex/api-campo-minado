class Usuario {
  constructor({ id, nome, email, data_nascimento, senha, saldo }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.dataNascimento = data_nascimento;
    this.senha = senha;
    this.saldo = saldo != null ? Number(saldo) : 0;
  }

  static fromRow(row) {
    return row ? new Usuario(row) : null;
  }
}

module.exports = Usuario;
