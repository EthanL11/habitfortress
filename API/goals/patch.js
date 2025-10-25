// API/goals/patch.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

// Route to update a specific goal by its ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  // Get all fields that could be updated
  const { name, description, target_date, is_completed, type } = req.body;

  try {
    const { data, error } = await supabase
      .from('goals')
      .update({ name, description, target_date, is_completed, type })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).send({ error: 'Goal not found' });
    }

    // Send back the updated goal data
    res.status(200).send(data[0]);
  } catch (error) {
    console.error('Error updating goal:', error.message);
    res.status(500).send({ error: error.message });
  }
});

export default router;