const usuarioRepository = require('../repositories/usuarioRepository');
const AppError = require('../utils/AppError');
const { gerarHash, compararSenha } = require('../utils/password');
const { validarRequisitosSenha, emailValido, dataValida } = require('../utils/validators');

const authService = {
  async registrar({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
    if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
      throw new AppError('Todos os campos são obrigatórios.');
    }
    if (!emailValido(email)) throw new AppError('E-mail inválido.');
    if (!dataValida(dataNascimento)) throw new AppError('Data de nascimento inválida.');

    const errosSenha = validarRequisitosSenha(senha);
    if (errosSenha.length > 0) {
      throw new AppError(`A senha deve conter: ${errosSenha.join(', ')}.`);
    }
    if (senha !== confirmacaoSenha) {
      throw new AppError('A senha e a confirmação não coincidem.');
    }
    if (await usuarioRepository.buscarPorEmail(email)) {
      throw new AppError('E-mail já cadastrado.', 409);
    }

    const senhaHash = await gerarHash(senha);
    const usuario = await usuarioRepository.criar({ nome, email, dataNascimento, senha: senhaHash });
    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  },

  async login({ email, senha }) {
    if (!email || !senha) throw new AppError('E-mail e senha são obrigatórios.');

    const usuario = await usuarioRepository.buscarPorEmail(email);
    const senhaConfere = usuario && (await compararSenha(senha, usuario.senha));
    if (!senhaConfere) throw new AppError('Credenciais inválidas.', 401);

    return {
      nome: usuario.nome,
      email: usuario.email,
      dataNascimento: usuario.dataNascimento,
    };
  },

  async resetarSenha({ id, novaSenha }) {
    if (!id || !novaSenha) throw new AppError('Id e nova senha são obrigatórios.');

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);

    const errosSenha = validarRequisitosSenha(novaSenha);
    if (errosSenha.length > 0) {
      throw new AppError(`A senha deve conter: ${errosSenha.join(', ')}.`);
    }

    if (await compararSenha(novaSenha, usuario.senha)) {
      throw new AppError('A nova senha não pode ser igual à senha atual.');
    }

    await usuarioRepository.atualizarSenha(id, await gerarHash(novaSenha));
    return { mensagem: 'Senha atualizada com sucesso.' };
  },
};

module.exports = authService;
