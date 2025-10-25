// API/building/delete.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

// Route to delete a specific building by its ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('building')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Send a 204 No Content response on successful deletion
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting building:', error.message);
    res.status(500).send({ error: error.message });
  }
});

export default router;