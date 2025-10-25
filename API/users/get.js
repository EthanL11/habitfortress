// API/users/get.js
import express from 'express';
import supabase from '../../config/supabaseClient.js'; // Your existing client

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // This is the admin-level function to list users
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    res.status(200).json(data.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;