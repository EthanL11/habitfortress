// API/profile/delete.js
import express from 'express';
import supabase from '../../config/supabaseClient.js'; // Adjust path as needed

const router = express.Router();

/**
 * DELETE a profile by its ID.
 * Route: DELETE /profiles/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single(); 

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found.' });

    console.log('Profile deleted:', data);
    res.status(200).json({ message: 'Profile deleted successfully.', deletedProfile: data });
  } catch (error) {
    console.error('Error deleting profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;