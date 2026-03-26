// ============================================================
// FC ELITE — Database Types (auto-generated from schema)
// ============================================================

// ── Enums ──

export type UserRole = 'admin' | 'captain' | 'player';
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'countered';
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
export type AlertCategory = 'match_result' | 'financial_foul' | 'transfer' | 'server' | 'user_report' | 'system';
export type ListingStatus = 'active' | 'sold' | 'withdrawn' | 'expired';
export type MatchEventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty_scored' | 'penalty_missed' | 'own_goal';
export type TransferWindowStatus = 'open' | 'closed' | 'upcoming';
export type BuildupStyle = 'possession' | 'direct' | 'counter' | 'long_ball';

// ── Table Types ──

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  xp: number;
  level: number;
  rank_title: string;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string;
  budget: number;
  wage_cap: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  role: UserRole;
  jersey_number: number | null;
  joined_at: string;
  left_at: string | null;
  is_active: boolean;
}

export interface League {
  id: string;
  name: string;
  tier: number;
  max_teams: number;
  description: string | null;
  created_at: string;
}

export interface Season {
  id: string;
  league_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  current_week: number;
  created_at: string;
}

export interface Standing {
  id: string;
  season_id: string;
  team_id: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number; // computed
  points: number;          // computed
  form: string[];
  rank: number | null;
  updated_at: string;
}

export interface Match {
  id: string;
  season_id: string;
  week: number;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  venue: string | null;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  team_id: string;
  player_id: string;
  event_type: MatchEventType;
  minute: number;
  details: Record<string, unknown>;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: string;
  secondary_position: string | null;
  overall_rating: number;
  potential: number | null;
  image_url: string | null;

  // Attributes
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;

  // Financial
  market_value: number;
  wage: number;
  release_clause: number | null;
  contract_until: string | null;

  // Ownership
  team_id: string | null;
  star_rating: number;

  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  id: string;
  player_id: string;
  season_id: string;
  team_id: string;
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  shot_conversion: number;
  pass_accuracy: number;
  top_speed: number;
  mvp_awards: number;
  updated_at: string;
}

export interface CareerEntry {
  id: string;
  player_id: string;
  team_name: string;
  team_logo: string | null;
  start_year: number;
  end_year: number | null;
  appearances: number;
  goals: number;
  is_youth: boolean;
  created_at: string;
}

export interface TransferWindow {
  id: string;
  season_id: string;
  name: string;
  opens_at: string;
  closes_at: string;
  status: TransferWindowStatus;
  created_at: string;
}

export interface TransferListing {
  id: string;
  window_id: string;
  player_id: string;
  selling_team_id: string;
  asking_price: number;
  listing_type: string;
  tag: string | null;
  tag_color: string;
  status: ListingStatus;
  total_bids: number;
  listed_at: string;
  updated_at: string;
}

export interface TransferBid {
  id: string;
  listing_id: string;
  player_id: string;
  bidding_team_id: string;
  bidder_id: string;
  bid_amount: number;
  wage_offered: number | null;
  counter_amount: number | null;
  status: BidStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tactic {
  id: string;
  team_id: string;
  name: string;
  formation: string;
  mentality: number;
  pressing: number;
  buildup_style: BuildupStyle;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TacticAssignment {
  id: string;
  tactic_id: string;
  player_id: string;
  position: string;
  pos_x: number;
  pos_y: number;
  is_starter: boolean;
  jersey_number: number | null;
  role_instruction: string | null;
}

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  target_user_id: string | null;
  related_match_id: string | null;
  related_team_id: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  action_url: string | null;
  created_at: string;
}

// ── Database helper type (for supabase.from('table')) ──

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      teams: { Row: Team };
      team_members: { Row: TeamMember };
      leagues: { Row: League };
      seasons: { Row: Season };
      standings: { Row: Standing };
      matches: { Row: Match };
      match_events: { Row: MatchEvent };
      players: { Row: Player };
      player_stats: { Row: PlayerStats };
      career_entries: { Row: CareerEntry };
      transfer_windows: { Row: TransferWindow };
      transfer_listings: { Row: TransferListing };
      transfer_bids: { Row: TransferBid };
      tactics: { Row: Tactic };
      tactic_assignments: { Row: TacticAssignment };
      alerts: { Row: Alert };
    };
  };
}
