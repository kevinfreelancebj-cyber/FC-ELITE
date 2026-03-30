-- MIGRATION: 003_match_performances.sql
-- Run this in your Supabase SQL Editor to add the Table needed for Player Rankings (Banger Update!)

CREATE TABLE IF NOT EXISTS public.match_performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    is_mvp BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active la sécurité (RLS)
ALTER TABLE public.match_performances ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique
CREATE POLICY "Public read access to match performances" 
    ON public.match_performances FOR SELECT USING (true);

-- Permettre l'insertion par les utilisateurs authentifiés (Capitaines)
CREATE POLICY "Users can insert match performances" 
    ON public.match_performances FOR INSERT WITH CHECK (true);
    
-- Permettre la suppression (pour réinitialiser un score par ex)
CREATE POLICY "Users can delete match performances"
    ON public.match_performances FOR DELETE USING (true);
