-- ============================================================
-- FC ELITE — Initial Database Schema
-- Supabase / PostgreSQL Migration
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- ENUM TYPES
-- ──────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'captain', 'player');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'countered');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'error', 'critical');
CREATE TYPE alert_category AS ENUM ('match_result', 'financial_foul', 'transfer', 'server', 'user_report', 'system');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'withdrawn', 'expired');
CREATE TYPE match_event_type AS ENUM ('goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'penalty_scored', 'penalty_missed', 'own_goal');
CREATE TYPE transfer_window_status AS ENUM ('open', 'closed', 'upcoming');

-- ──────────────────────────────────────────────────────────────
-- 1. PROFILES (extends Supabase Auth users)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'player',
  xp          INTEGER NOT NULL DEFAULT 0,
  level       INTEGER NOT NULL DEFAULT 1,
  rank_title  TEXT DEFAULT 'Rookie',
  is_banned   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 2. TEAMS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE teams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT UNIQUE NOT NULL,
  short_name    TEXT NOT NULL,          -- e.g. "FCE"
  logo_url      TEXT,
  primary_color TEXT DEFAULT '#5cfd80', -- hex color
  budget        NUMERIC(15,2) NOT NULL DEFAULT 100000000.00, -- €100M initial
  wage_cap      NUMERIC(12,2) NOT NULL DEFAULT 2000000.00,   -- €2M/week
  created_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 3. TEAM MEMBERS (links profiles ↔ teams)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE team_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       user_role NOT NULL DEFAULT 'player',  -- role within the team
  jersey_number INTEGER,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at    TIMESTAMPTZ,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(team_id, profile_id, is_active)
);

-- ──────────────────────────────────────────────────────────────
-- 4. LEAGUES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE leagues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,       -- e.g. "Global Division 1"
  tier        INTEGER NOT NULL DEFAULT 1,
  max_teams   INTEGER NOT NULL DEFAULT 20,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 5. SEASONS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE seasons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id   UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,              -- e.g. "Season 2024-25"
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  current_week INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 6. STANDINGS (league table)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE standings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id   UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  played      INTEGER NOT NULL DEFAULT 0,
  wins        INTEGER NOT NULL DEFAULT 0,
  draws       INTEGER NOT NULL DEFAULT 0,
  losses      INTEGER NOT NULL DEFAULT 0,
  goals_for   INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points      INTEGER GENERATED ALWAYS AS (wins * 3 + draws) STORED,
  form        TEXT[] DEFAULT '{}',  -- last 5 results: ['W','W','D','L','W']
  rank        INTEGER,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(season_id, team_id)
);

-- ──────────────────────────────────────────────────────────────
-- 7. MATCHES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE matches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id      UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  week           INTEGER NOT NULL,
  home_team_id   UUID NOT NULL REFERENCES teams(id),
  away_team_id   UUID NOT NULL REFERENCES teams(id),
  home_score     INTEGER,
  away_score     INTEGER,
  status         match_status NOT NULL DEFAULT 'scheduled',
  venue          TEXT,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (home_team_id <> away_team_id)
);

-- ──────────────────────────────────────────────────────────────
-- 8. MATCH EVENTS (goals, cards, etc.)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE match_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id     UUID NOT NULL REFERENCES teams(id),
  player_id   UUID NOT NULL,  -- references players table
  event_type  match_event_type NOT NULL,
  minute      INTEGER NOT NULL CHECK (minute >= 0 AND minute <= 120),
  details     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 9. PLAYERS (player cards / entities)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  age             INTEGER NOT NULL CHECK (age >= 15 AND age <= 45),
  nationality     TEXT NOT NULL,
  position        TEXT NOT NULL,         -- GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST
  secondary_position TEXT,
  overall_rating  INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 99),
  potential       INTEGER CHECK (potential >= 1 AND potential <= 99),
  image_url       TEXT,
  
  -- Attribute breakdown
  pace            INTEGER DEFAULT 50 CHECK (pace >= 1 AND pace <= 99),
  shooting        INTEGER DEFAULT 50 CHECK (shooting >= 1 AND shooting <= 99),
  passing         INTEGER DEFAULT 50 CHECK (passing >= 1 AND passing <= 99),
  dribbling       INTEGER DEFAULT 50 CHECK (dribbling >= 1 AND dribbling <= 99),
  defending       INTEGER DEFAULT 50 CHECK (defending >= 1 AND defending <= 99),
  physical        INTEGER DEFAULT 50 CHECK (physical >= 1 AND physical <= 99),
  
  -- Financial
  market_value    NUMERIC(15,2) NOT NULL DEFAULT 0,
  wage            NUMERIC(12,2) NOT NULL DEFAULT 0,
  release_clause  NUMERIC(15,2),
  contract_until  DATE,
  
  -- Ownership
  team_id         UUID REFERENCES teams(id) ON DELETE SET NULL,
  
  -- Star rating (1-5)
  star_rating     INTEGER DEFAULT 3 CHECK (star_rating >= 1 AND star_rating <= 5),
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 10. PLAYER STATS (seasonal performance)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE player_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  season_id       UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  team_id         UUID NOT NULL REFERENCES teams(id),
  
  appearances     INTEGER NOT NULL DEFAULT 0,
  goals           INTEGER NOT NULL DEFAULT 0,
  assists         INTEGER NOT NULL DEFAULT 0,
  yellow_cards    INTEGER NOT NULL DEFAULT 0,
  red_cards       INTEGER NOT NULL DEFAULT 0,
  minutes_played  INTEGER NOT NULL DEFAULT 0,
  
  -- Advanced metrics
  shot_conversion NUMERIC(5,2) DEFAULT 0,   -- percentage
  pass_accuracy   NUMERIC(5,2) DEFAULT 0,   -- percentage
  top_speed       NUMERIC(5,1) DEFAULT 0,   -- km/h
  mvp_awards      INTEGER NOT NULL DEFAULT 0,
  
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, season_id)
);

-- ──────────────────────────────────────────────────────────────
-- 11. CAREER ENTRIES (player career timeline)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE career_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_name   TEXT NOT NULL,        -- historical, not FK (teams may not exist)
  team_logo   TEXT,
  start_year  INTEGER NOT NULL,
  end_year    INTEGER,              -- NULL = current club
  appearances INTEGER DEFAULT 0,
  goals       INTEGER DEFAULT 0,
  is_youth    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 12. TRANSFER WINDOWS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE transfer_windows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id   UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,          -- e.g. "Summer Window 2024"
  opens_at    TIMESTAMPTZ NOT NULL,
  closes_at   TIMESTAMPTZ NOT NULL,
  status      transfer_window_status NOT NULL DEFAULT 'upcoming',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 13. TRANSFER LISTINGS (players on the market)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE transfer_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  window_id       UUID NOT NULL REFERENCES transfer_windows(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id),
  selling_team_id UUID NOT NULL REFERENCES teams(id),
  asking_price    NUMERIC(15,2) NOT NULL,
  listing_type    TEXT NOT NULL DEFAULT 'listed',  -- 'listed', 'release_clause', 'loan'
  tag             TEXT,                            -- 'Hot Prospect', 'Galactico', etc.
  tag_color       TEXT DEFAULT 'primary',
  status          listing_status NOT NULL DEFAULT 'active',
  total_bids      INTEGER NOT NULL DEFAULT 0,
  listed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 14. TRANSFER BIDS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE transfer_bids (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES transfer_listings(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id),
  bidding_team_id UUID NOT NULL REFERENCES teams(id),
  bidder_id       UUID NOT NULL REFERENCES profiles(id),
  bid_amount      NUMERIC(15,2) NOT NULL,
  wage_offered    NUMERIC(12,2),
  counter_amount  NUMERIC(15,2),        -- counter-offer from selling team
  status          bid_status NOT NULL DEFAULT 'pending',
  message         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
-- 15. TACTICS (team tactical setup)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE tactics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Default',
  formation       TEXT NOT NULL DEFAULT '4-3-3',  -- e.g. '4-3-3', '4-2-3-1', '3-5-2'
  
  -- Team Instructions
  mentality       INTEGER NOT NULL DEFAULT 3 CHECK (mentality >= 1 AND mentality <= 5),
    -- 1=Defensive, 2=Cautious, 3=Balanced, 4=Attacking, 5=All-out Attack
  pressing        INTEGER NOT NULL DEFAULT 50 CHECK (pressing >= 1 AND pressing <= 100),
  buildup_style   TEXT NOT NULL DEFAULT 'possession',
    -- 'possession', 'direct', 'counter', 'long_ball'
  
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, name)
);

-- ──────────────────────────────────────────────────────────────
-- 16. TACTIC ASSIGNMENTS (player positions in a tactic)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE tactic_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tactic_id   UUID NOT NULL REFERENCES tactics(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id),
  position    TEXT NOT NULL,           -- e.g. 'GK', 'CB', 'LW', 'ST'
  
  -- Position on pitch (percentages for UI rendering)
  pos_x       NUMERIC(5,2) NOT NULL,  -- left % (0-100)
  pos_y       NUMERIC(5,2) NOT NULL,  -- top %  (0-100)
  
  is_starter  BOOLEAN NOT NULL DEFAULT TRUE,
  jersey_number INTEGER,
  role_instruction TEXT,               -- 'stay back', 'get forward', etc.
  
  UNIQUE(tactic_id, player_id)
);

-- ──────────────────────────────────────────────────────────────
-- 17. ALERTS (admin notifications & system alerts)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category        alert_category NOT NULL DEFAULT 'system',
  severity        alert_severity NOT NULL DEFAULT 'info',
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  
  -- Optional references
  target_user_id  UUID REFERENCES profiles(id),
  related_match_id UUID REFERENCES matches(id),
  related_team_id  UUID REFERENCES teams(id),
  
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  is_dismissed    BOOLEAN NOT NULL DEFAULT FALSE,
  action_url      TEXT,               -- deeplink to relevant page
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX idx_standings_season       ON standings(season_id);
CREATE INDEX idx_standings_points       ON standings(season_id, points DESC);
CREATE INDEX idx_matches_season         ON matches(season_id);
CREATE INDEX idx_matches_status         ON matches(status);
CREATE INDEX idx_matches_teams          ON matches(home_team_id, away_team_id);
CREATE INDEX idx_match_events_match     ON match_events(match_id);
CREATE INDEX idx_players_team           ON players(team_id);
CREATE INDEX idx_players_position       ON players(position);
CREATE INDEX idx_players_rating         ON players(overall_rating DESC);
CREATE INDEX idx_player_stats_player    ON player_stats(player_id);
CREATE INDEX idx_player_stats_season    ON player_stats(season_id);
CREATE INDEX idx_transfer_listings_window ON transfer_listings(window_id);
CREATE INDEX idx_transfer_listings_status ON transfer_listings(status);
CREATE INDEX idx_transfer_bids_listing  ON transfer_bids(listing_id);
CREATE INDEX idx_transfer_bids_status   ON transfer_bids(status);
CREATE INDEX idx_tactics_team           ON tactics(team_id);
CREATE INDEX idx_tactic_assignments_tactic ON tactic_assignments(tactic_id);
CREATE INDEX idx_alerts_category        ON alerts(category);
CREATE INDEX idx_alerts_user            ON alerts(target_user_id);
CREATE INDEX idx_alerts_unread          ON alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_team_members_team      ON team_members(team_id);
CREATE INDEX idx_team_members_profile   ON team_members(profile_id);
CREATE INDEX idx_career_entries_player  ON career_entries(player_id);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactic_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- ── PUBLIC READ POLICIES ──
-- Everyone can read leagues, seasons, standings, matches, players, etc.

CREATE POLICY "Public read: profiles"        ON profiles        FOR SELECT USING (true);
CREATE POLICY "Public read: teams"           ON teams           FOR SELECT USING (true);
CREATE POLICY "Public read: team_members"    ON team_members    FOR SELECT USING (true);
CREATE POLICY "Public read: leagues"         ON leagues         FOR SELECT USING (true);
CREATE POLICY "Public read: seasons"         ON seasons         FOR SELECT USING (true);
CREATE POLICY "Public read: standings"       ON standings       FOR SELECT USING (true);
CREATE POLICY "Public read: matches"         ON matches         FOR SELECT USING (true);
CREATE POLICY "Public read: match_events"    ON match_events    FOR SELECT USING (true);
CREATE POLICY "Public read: players"         ON players         FOR SELECT USING (true);
CREATE POLICY "Public read: player_stats"    ON player_stats    FOR SELECT USING (true);
CREATE POLICY "Public read: career_entries"  ON career_entries   FOR SELECT USING (true);
CREATE POLICY "Public read: transfer_windows" ON transfer_windows FOR SELECT USING (true);
CREATE POLICY "Public read: transfer_listings" ON transfer_listings FOR SELECT USING (true);
CREATE POLICY "Public read: tactics"         ON tactics         FOR SELECT USING (true);
CREATE POLICY "Public read: tactic_assignments" ON tactic_assignments FOR SELECT USING (true);

-- ── USER-SPECIFIC WRITE POLICIES ──

-- Users can update their own profile
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can see their own alerts
CREATE POLICY "Users read own alerts"
  ON alerts FOR SELECT
  USING (target_user_id = auth.uid() OR target_user_id IS NULL);

-- Users can place bids
CREATE POLICY "Users create bids"
  ON transfer_bids FOR INSERT
  WITH CHECK (bidder_id = auth.uid());

-- Users can update their own bids (withdraw)
CREATE POLICY "Users update own bids"
  ON transfer_bids FOR UPDATE
  USING (bidder_id = auth.uid());

-- ── ADMIN FULL ACCESS ──

CREATE POLICY "Admin full access: profiles"     ON profiles     FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: teams"        ON teams        FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: leagues"      ON leagues      FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: seasons"      ON seasons      FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: standings"    ON standings    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: matches"      ON matches      FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: match_events" ON match_events FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: players"      ON players      FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: player_stats" ON player_stats FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: transfers"    ON transfer_listings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: bids"         ON transfer_bids FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: tactics"      ON tactics      FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access: alerts"       ON alerts       FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- AUTOMATIC TIMESTAMPS (updated_at trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at       BEFORE UPDATE ON profiles       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_teams_updated_at          BEFORE UPDATE ON teams          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_standings_updated_at      BEFORE UPDATE ON standings      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_players_updated_at        BEFORE UPDATE ON players        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_player_stats_updated_at   BEFORE UPDATE ON player_stats   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_transfer_listings_updated BEFORE UPDATE ON transfer_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_transfer_bids_updated     BEFORE UPDATE ON transfer_bids  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_tactics_updated           BEFORE UPDATE ON tactics        FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
