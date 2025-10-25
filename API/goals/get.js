// API/goals/get.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

// --- GET ALL goals for a specific user ---
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Note: Using 'goals' table name from your schema diagram
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET ONE goal by ID ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Note: Using 'goals' table name from your schema diagram
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;