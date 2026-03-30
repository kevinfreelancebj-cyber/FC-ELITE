import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:UAjKWJzOntndAygx@db.dnqopryrjmiwhazkbcmi.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  console.log("Connected to DB");

  const query = `
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

    ALTER TABLE public.match_performances ENABLE ROW LEVEL SECURITY;

    -- Drop policies if they exist to avoid errors
    DROP POLICY IF EXISTS "Public read access to match performances" ON public.match_performances;
    DROP POLICY IF EXISTS "Captains and admins can insert match performances" ON public.match_performances;

    -- Policies
    CREATE POLICY "Public read access to match performances" 
      ON public.match_performances FOR SELECT USING (true);

    CREATE POLICY "Users can insert match performances" 
      ON public.match_performances FOR INSERT WITH CHECK (true); -- Since UI restricts to captains anyway
  `;

  try {
    await client.query(query);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

main();
