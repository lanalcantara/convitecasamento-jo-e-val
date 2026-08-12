-- ==========================================================================
-- ESTRUTURA DO BANCO DE DADOS SUPABASE: Josalva & Valtair
-- Execute este script no SQL Editor do seu painel do Supabase (ssfgxswkdbrjvqcpxcfp)
-- ==========================================================================

-- 1. TABELA DE CONFIRMAÇÕES DE PRESENÇA
CREATE TABLE IF NOT EXISTS confirmacoes (
  id BIGSERIAL PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  vai_comparecer TEXT NOT NULL,
  quantidade_acompanhantes INTEGER DEFAULT 0,
  nomes_acompanhantes TEXT,
  mensagem_noivos TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DO MURAL DE RECADOS
CREATE TABLE IF NOT EXISTS recados (
  id BIGSERIAL PRIMARY KEY,
  autor TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  curtidas INTEGER DEFAULT 1,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR RLS E PERMITIR ACESSO PÚBLICO (ANON)
ALTER TABLE confirmacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de confirmações" ON confirmacoes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de confirmações" ON confirmacoes FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura pública de recados" ON recados FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de recados" ON recados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de curtidas em recados" ON recados FOR UPDATE USING (true);
