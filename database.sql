CREATE TABLE IF NOT EXISTS usuarios (
    id               SERIAL PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    data_nascimento  DATE NOT NULL,
    senha            VARCHAR(255) NOT NULL,
    saldo            NUMERIC(12, 2) NOT NULL DEFAULT 0,
    criado_em        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jogos (
    id                     SERIAL PRIMARY KEY,
    id_usuario             INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    valor_aposta           NUMERIC(12, 2) NOT NULL,
    tabuleiro              JSONB NOT NULL,
    posicoes_reveladas     JSONB NOT NULL DEFAULT '[]'::jsonb,
    diamantes_encontrados  INTEGER NOT NULL DEFAULT 0,
    premio_atual           NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status                 VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
    criado_em              TIMESTAMP NOT NULL DEFAULT NOW(),
    finalizado_em          TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jogos_usuario_status ON jogos (id_usuario, status);
