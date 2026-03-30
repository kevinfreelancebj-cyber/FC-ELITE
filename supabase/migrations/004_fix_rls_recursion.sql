-- MIGRATION: 004_fix_rls_recursion.sql
-- Fixes the 500 Internal Server Error caused by infinite recursion in RLS policies

-- 1. Create a secure function to check for admin role bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  _is_admin BOOLEAN;
BEGIN
  SELECT (role = 'admin') INTO _is_admin FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(_is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop all the recursive admin policies
DROP POLICY IF EXISTS "Admin full access: profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access: teams" ON public.teams;
DROP POLICY IF EXISTS "Admin full access: leagues" ON public.leagues;
DROP POLICY IF EXISTS "Admin full access: seasons" ON public.seasons;
DROP POLICY IF EXISTS "Admin full access: standings" ON public.standings;
DROP POLICY IF EXISTS "Admin full access: matches" ON public.matches;
DROP POLICY IF EXISTS "Admin full access: match_events" ON public.match_events;
DROP POLICY IF EXISTS "Admin full access: players" ON public.players;
DROP POLICY IF EXISTS "Admin full access: player_stats" ON public.player_stats;
DROP POLICY IF EXISTS "Admin full access: transfers" ON public.transfer_listings;
DROP POLICY IF EXISTS "Admin full access: bids" ON public.transfer_bids;
DROP POLICY IF EXISTS "Admin full access: tactics" ON public.tactics;
DROP POLICY IF EXISTS "Admin full access: alerts" ON public.alerts;

-- 3. Recreate the admin policies using the safe function
CREATE POLICY "Admin full access: profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: teams" ON public.teams FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: leagues" ON public.leagues FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: seasons" ON public.seasons FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: standings" ON public.standings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: matches" ON public.matches FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: match_events" ON public.match_events FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: players" ON public.players FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: player_stats" ON public.player_stats FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: transfers" ON public.transfer_listings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: bids" ON public.transfer_bids FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: tactics" ON public.tactics FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access: alerts" ON public.alerts FOR ALL USING (public.is_admin());
