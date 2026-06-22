const { Router } = require('express');
const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const jogoRoutes = require('./jogoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usuarioRoutes);
router.use('/games', jogoRoutes);

module.exports = router;
