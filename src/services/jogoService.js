const { withTransaction } = require('../config/database');
const jogoRepository = require('../repositories/jogoRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const AppError = require('../utils/AppError');

const TAMANHO = 5;           
const TOTAL_BOMBAS = 5;      
const MULTIPLICADOR = 0.33;   

function gerarTabuleiro() {
  const total = TAMANHO * TAMANHO;
  const celulas = Array(total).fill('DIAMANTE');
  const indices = [...Array(total).keys()];

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let k = 0; k < TOTAL_BOMBAS; k++) celulas[indices[k]] = 'BOMBA';

  const grid = [];
  for (let linha = 0; linha < TAMANHO; linha++) {
    grid.push(celulas.slice(linha * TAMANHO, linha * TAMANHO + TAMANHO));
  }
  return grid;
}


function calcularPremio(valorAposta, diamantes) {
  const premio = valorAposta * (1 + diamantes * MULTIPLICADOR);
  return Math.round(premio * 100) / 100;
}

const jogoService = {
  async iniciar({ idUser, valorAposta }) {
    if (!idUser) throw new AppError('idUser é obrigatório.');
    if (typeof valorAposta !== 'number' || valorAposta <= 0) {
      throw new AppError('valorAposta deve ser um número positivo.');
    }

    return withTransaction(async (db) => {
      const usuario = await usuarioRepository.buscarPorId(idUser, db);
      if (!usuario) throw new AppError('Usuário não encontrado.', 404);

      const emAndamento = await jogoRepository.buscarPartidaEmAndamento(idUser, db);
      if (emAndamento) {
        throw new AppError('Você já possui uma partida em andamento.', 409);
      }
      if (usuario.saldo < valorAposta) {
        throw new AppError('Saldo insuficiente para essa aposta.');
      }

      await usuarioRepository.ajustarSaldo(idUser, -valorAposta, db);
      const jogo = await jogoRepository.criar(
        { idUsuario: idUser, valorAposta, tabuleiro: gerarTabuleiro() },
        db
      );
      return { gameId: jogo.id };
    });
  },

  async revelar(gameId, { linha, coluna }) {
    if (!Number.isInteger(linha) || !Number.isInteger(coluna) ||
        linha < 0 || linha >= TAMANHO || coluna < 0 || coluna >= TAMANHO) {
      throw new AppError(`linha e coluna devem ser inteiros de 0 a ${TAMANHO - 1}.`);
    }

    const jogo = await jogoRepository.buscarPorId(gameId);
    if (!jogo) throw new AppError('Partida não encontrada.', 404);
    if (jogo.status !== 'EM_ANDAMENTO') {
      throw new AppError('Esta partida já foi finalizada.', 409);
    }

    const jaRevelada = jogo.posicoesReveladas.some((p) => p.linha === linha && p.coluna === coluna);
    if (jaRevelada) {
      throw new AppError('Posição já escolhida. Escolha outra posição.', 409);
    }

    if (jogo.tabuleiro[linha][coluna] === 'BOMBA') {
      await jogoRepository.finalizar(gameId, 'PERDIDO', 0);
      return { resultado: 'BOMBA', status: 'PERDIDO' };
    }

    const posicoesReveladas = [...jogo.posicoesReveladas, { linha, coluna }];
    const diamantesEncontrados = jogo.diamantesEncontrados + 1;
    const premioAtual = calcularPremio(jogo.valorAposta, diamantesEncontrados);
    await jogoRepository.registrarRevelacao(gameId, {
      posicoesReveladas,
      diamantesEncontrados,
      premioAtual,
    });

    return { resultado: 'DIAMANTE', diamantesEncontrados, premioAtual };
  },

  async cashout(gameId) {
    return withTransaction(async (db) => {
      const jogo = await jogoRepository.buscarPorId(gameId, db);
      if (!jogo) throw new AppError('Partida não encontrada.', 404);
      if (jogo.status !== 'EM_ANDAMENTO') {
        throw new AppError('Esta partida já foi finalizada.', 409);
      }

      const valorFinal = calcularPremio(jogo.valorAposta, jogo.diamantesEncontrados);
      await usuarioRepository.ajustarSaldo(jogo.idUsuario, valorFinal, db);
      await jogoRepository.finalizar(gameId, 'GANHO', valorFinal, db);

      return {
        status: 'GANHO',
        diamantesEncontrados: jogo.diamantesEncontrados,
        valorSacado: valorFinal,
      };
    });
  },
};

module.exports = jogoService;
