const usuarioRepository = require('../repositories/usuarioRepository');
const jogoRepository = require('../repositories/jogoRepository');
const AppError = require('../utils/AppError');
const { saldoValido } = require('../utils/validators');

const usuarioService = {
  async buscarPorId(id) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      saldo: usuario.saldo,
    };
  },

  async dashboard(idUsuario) {
    if (!idUsuario) throw new AppError('Informe o idUser na query string.');
    const usuario = await usuarioRepository.buscarPorId(idUsuario);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);

    const e = await jogoRepository.estatisticas(idUsuario);
    return {
      totalJogos: Number(e.total_jogos),
      vitorias: Number(e.vitorias),
      derrotas: Number(e.derrotas),
      valorGanho: Number(e.valor_ganho),
      valorPerdido: Number(e.valor_perdido),
    };
  },

  async definirSaldo(id, saldo) {
    if (!saldoValido(saldo)) {
      throw new AppError('Saldo inválido: use um valor não negativo com até duas casas decimais.');
    }
    const usuario = await usuarioRepository.definirSaldo(id, saldo);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);
    return { id: usuario.id, saldo: usuario.saldo };
  },

  async deletar(id) {
    const removido = await usuarioRepository.deletar(id);
    if (!removido) throw new AppError('Usuário não encontrado.', 404);
    return { mensagem: 'Usuário e jogos vinculados removidos com sucesso.' };
  },
};

module.exports = usuarioService;
