class Jogo {
  constructor(row) {
    this.id = row.id;
    this.idUsuario = row.id_usuario;
    this.valorAposta = Number(row.valor_aposta);
    this.tabuleiro = row.tabuleiro;
    this.posicoesReveladas = row.posicoes_reveladas || [];
    this.diamantesEncontrados = row.diamantes_encontrados;
    this.premioAtual = Number(row.premio_atual);
    this.status = row.status;
  }

  static fromRow(row) {
    return row ? new Jogo(row) : null;
  }
}

module.exports = Jogo;
