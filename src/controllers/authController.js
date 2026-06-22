const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const resultado = await authService.registrar(req.body);
      res.status(201).json(resultado);
    } catch (erro) {
      next(erro);
    }
  },

  async login(req, res, next) {
    try {
      const resultado = await authService.login(req.body);
      res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const resultado = await authService.resetarSenha(req.body);
      res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  },
};

module.exports = authController;
