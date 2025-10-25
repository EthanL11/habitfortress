// API/profile/patch.js
import express from 'express';
import supabase from '../../config/supabaseClient.js'; // Adjust path as needed

const router = express.Router();

/**
 * UPDATE an existing profile by its ID.
 * Route: PATCH /profiles/:id
 * Expects: { "username": "updated_name", "points": 50 }
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found.' });

    console.log('Profile updated:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;