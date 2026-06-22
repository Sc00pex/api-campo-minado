const usuarioService = require('../services/usuarioService');

const usuarioController = {
  async buscarPorId(req, res, next) {
    try {
      res.status(200).json(await usuarioService.buscarPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  },

  async dashboard(req, res, next) {
    try {
      res.status(200).json(await usuarioService.dashboard(req.query.idUser));
    } catch (erro) {
      next(erro);
    }
  },

  async definirSaldo(req, res, next) {
    try {
      res.status(200).json(await usuarioService.definirSaldo(req.params.id, req.body.saldo));
    } catch (erro) {
      next(erro);
    }
  },

  async deletar(req, res, next) {
    try {
      res.status(200).json(await usuarioService.deletar(req.params.id));
    } catch (erro) {
      next(erro);
    }
  },
};

module.exports = usuarioController;
