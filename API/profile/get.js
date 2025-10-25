// API/profile/get.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

// --- GET CURRENT USER's profile (NEW SECURE ROUTE) ---
// This route MUST be defined *before* the '/:id' route
router.get('/me', async (req, res) => {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided.' });
    }
    const token = authHeader.split(' ')[1]; // Format is "Bearer <token>"

    // 2. Verify the token with Supabase and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // 3. Use the authenticated user's ID to fetch their profile
    const { data, error } = await supabase
      .from('profiles')
      .select('username, points') // Only select what the header needs
      .eq('id', user.id) // 'id' in 'profiles' table must match 'id' in 'auth.users'
      .single();

    if (error) throw error;

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Profile not found for this user.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --- GET ALL profiles ---
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET ONE profile by ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single(); // .single() returns one object, not an array

    if (error) throw error;

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;