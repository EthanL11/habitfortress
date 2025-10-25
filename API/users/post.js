// API/users/post.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // This admin function creates a new user in auth.users
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Automatically confirms the email
    });

    if (error) throw error;

    // The database trigger will automatically create the profile.
    // We don't need to do it here.

    res.status(201).json(data.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;