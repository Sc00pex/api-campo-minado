const jogoService = require('../services/jogoService');

const jogoController = {
  async iniciar(req, res, next) {
    try {
      res.status(201).json(await jogoService.iniciar(req.body));
    } catch (erro) {
      next(erro);
    }
  },

  async revelar(req, res, next) {
    try {
      res.status(200).json(await jogoService.revelar(req.params.gameId, req.body));
    } catch (erro) {
      next(erro);
    }
  },

  async cashout(req, res, next) {
    try {
      res.status(200).json(await jogoService.cashout(req.params.gameId));
    } catch (erro) {
      next(erro);
    }
  },
};

module.exports = jogoController;
