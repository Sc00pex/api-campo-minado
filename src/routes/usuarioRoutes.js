const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/dashboard', usuarioController.dashboard);
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', usuarioController.definirSaldo);
router.delete('/:id', usuarioController.deletar);

module.exports = router;
