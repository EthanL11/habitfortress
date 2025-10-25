import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // This function signs in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    // On success, 'data' contains the user object and a session object.
    // The session (data.session) contains the access_token (JWT) 
    // and refresh_token. You would send this back to your client.
    res.status(200).json(data);

  } catch (error) {
    // If credentials are bad, Supabase throws an error
    res.status(401).json({ error: error.message });
  }
});

export default router;