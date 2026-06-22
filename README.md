# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado. Permite cadastro e autenticação de usuários, controle de saldo e a realização de partidas (apostas) num tabuleiro 5x5.

## Tecnologias Utilizadas

* Node.js (v24)
* Express.js
* PostgreSQL (`pg`)
* bcryptjs (hash de senha)
* dotenv
* cors
* nodemon

## Integrantes

* André Frieiro
* Kayann Leandro de Sá
* Thiago Elias de Souza


## Instalação

Clone o repositório:

```
git clone https://github.com/usuario/api-campo-minado.git
```

Acesse a pasta do projeto:

```
cd api-campo-minado
```

Instale as dependências:

```
npm install
```

## Configuração

Crie o banco de dados e execute o script de schema:

```
createdb campo_minado
psql -d campo_minado -f database.sql
```

Crie um arquivo `.env` na raiz (use `.env.example` como base):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
NODE_ENV=development
```

## Executando a aplicação

```
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
src/
  config/         conexão com o banco e helper de transação
  models/         modelagem das entidades (Usuario, Jogo)
  repositories/   acesso ao banco de dados
  services/       regras de negócio
  controllers/    recebimento das requisições HTTP
  routes/         mapeamento das rotas
  utils/          erros, hash de senha e validações
  app.js          ponto de entrada
```

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastra um novo usuário |
| POST | `/auth/login` | Autentica o usuário |
| PATCH | `/auth/reset-password` | Define uma nova senha |

### Usuário

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users/:id` | Dados do usuário |
| GET | `/users/dashboard?idUser=1` | Estatísticas pessoais |
| PUT | `/users/:id` | Cadastra/define o saldo |
| DELETE | `/users/:id` | Exclui o usuário e seus jogos |

### Jogo

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/games/start` | Inicia uma aposta |
| POST | `/games/:gameId/reveal` | Revela uma posição |
| POST | `/games/:gameId/cashout` | Encerra e saca o prêmio |

## Regras do Jogo

* Tabuleiro 5x5 com posicionamento aleatório de **5 bombas** (constante `TOTAL_BOMBAS` em `services/jogoService.js`).
* `linha` e `coluna` na revelação variam de **0 a 4**.
* Premiação: `valorAposta × (1 + diamantes × 0.33)`.
* Bomba zera o prêmio e encerra a partida; a aposta já é debitada no início.
* Um usuário não pode iniciar uma nova partida com outra em andamento.

## Exemplos de requisição

Cadastro:

```
POST /auth/register
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```

Iniciar partida:

```
POST /games/start
{ "idUser": 1, "valorAposta": 100 }
```

Revelar posição:

```
POST /games/1/reveal
{ "linha": 2, "coluna": 3 }
```
