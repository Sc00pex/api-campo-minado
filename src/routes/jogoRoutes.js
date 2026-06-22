const { Router } = require('express');
const jogoController = require('../controllers/jogoController');

const router = Router();

router.post('/start', jogoController.iniciar);
router.post('/:gameId/reveal', jogoController.revelar);
router.post('/:gameId/cashout', jogoController.cashout);

module.exports = router;
