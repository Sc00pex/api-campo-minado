const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const AppError = require('./utils/AppError');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'online', api: 'Campo Minado' }));

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Recurso não encontrado.' });
});

app.use((erro, req, res, _next) => {
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({ erro: erro.message });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

module.exports = app;
