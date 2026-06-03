
-- PureLive Club · Supabase Schema
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  lang TEXT DEFAULT 'en',
  wellness_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (tracks every AI chat interaction)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  user_name TEXT,
  user_email TEXT,
  goal TEXT,
  smoothie TEXT,
  lang TEXT,
  message TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smoothie favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  smoothie_name TEXT,
  category TEXT,
  lang TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App analytics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT,
  page TEXT,
  lang TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can add data)
CREATE POLICY "Allow public insert" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);

-- Public read for analytics only
CREATE POLICY "Allow public read analytics" ON analytics FOR SELECT USING (true);

-- ══ NUEVAS TABLAS — Mayo 2026 ══

-- Mensajes privados entre usuarios
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID,
  to_user_id UUID,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contenido moderado por IA
CREATE TABLE IF NOT EXISTS moderated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID,
  room_slug TEXT,
  is_blocked BOOLEAN DEFAULT false,
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas públicas
CREATE POLICY IF NOT EXISTS "insert_pm" ON private_messages FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "insert_push" ON push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "insert_mod" ON moderated_content FOR INSERT WITH CHECK (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pm_read ON private_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_mod_blocked ON moderated_content(is_blocked);
