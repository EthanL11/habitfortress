// API/profile/get.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

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