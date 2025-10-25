// API/building/patch.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

// Route to update a specific building by its ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // { name, status, cost, lvl, etc. }

  try {
    const { data, error } = await supabase
      .from('building')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).send({ error: 'Building not found' });
    }

    // Send back the updated building data
    res.status(200).send(data[0]);
  } catch (error) {
    console.error('Error updating building:', error.message);
    res.status(500).send({ error: error.message });
  }
});

export default router;