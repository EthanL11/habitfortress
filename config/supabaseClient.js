// config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env variables *from within this file*
dotenv.config();

// --- DEBUGGING ---
// This will tell us if this file is loading the variables
console.log("--- DEBUGGING supabaseClient.js ---");
console.log("SUPABASE_URL loaded:", process.env.SUPABASE_URL ? "Yes" : "No");
console.log("-----------------------------------");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Supabase client initialized.');
export default supabase;