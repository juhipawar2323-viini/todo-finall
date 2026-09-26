const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/$/, '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the backend.');
}

// This API uses custom JWT authentication, so all database access happens
// server-side with the service-role key. Never use an anon key here.
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
