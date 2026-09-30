-- ==========================================================================
-- ESTRUTURA COMPLETA DO BANCO DE DADOS SUPABASE: Josalva & Valtair
-- Projeto Supabase: ssfgxswkdbrjvqcpxcfp
-- Execute este script no SQL Editor do painel do Supabase (https://supabase.com/dashboard)
-- ==========================================================================

-- 1. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVP)
CREATE TABLE IF NOT EXISTS confirmacoes (
  id BIGSERIAL PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  vai_comparecer TEXT NOT NULL,
  quantidade_acompanhantes INTEGER DEFAULT 0,
  nomes_acompanhantes TEXT,
  mensagem_noivos TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela alternativa/espelho 'presencas' para compatibilidade total
CREATE TABLE IF NOT EXISTS presencas (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  confirmado BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'Confirmado',
  acompanhantes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DO MURAL DE RECADOS
CREATE TABLE IF NOT EXISTS recados (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT,
  autor TEXT,
  mensagem TEXT NOT NULL,
  curtidas INTEGER DEFAULT 1,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS) E PERMISSÕES PÚBLICAS (ANON)
ALTER TABLE confirmacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE recados ENABLE ROW LEVEL SECURITY;

-- Políticas para confirmacoes
DROP POLICY IF EXISTS "Permitir leitura pública de confirmações" ON confirmacoes;
DROP POLICY IF EXISTS "Permitir inserção pública de confirmações" ON confirmacoes;
CREATE POLICY "Permitir leitura pública de confirmações" ON confirmacoes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de confirmações" ON confirmacoes FOR INSERT WITH CHECK (true);

-- Políticas para presencas
DROP POLICY IF EXISTS "Permitir leitura pública de presenças" ON presencas;
DROP POLICY IF EXISTS "Permitir inserção pública de presenças" ON presencas;
CREATE POLICY "Permitir leitura pública de presenças" ON presencas FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de presenças" ON presencas FOR INSERT WITH CHECK (true);

-- Políticas para recados
DROP POLICY IF EXISTS "Permitir leitura pública de recados" ON recados;
DROP POLICY IF EXISTS "Permitir inserção pública de recados" ON recados;
DROP POLICY IF EXISTS "Permitir atualização de recados" ON recados;
CREATE POLICY "Permitir leitura pública de recados" ON recados FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de recados" ON recados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de recados" ON recados FOR UPDATE USING (true);
