// API/users/delete.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // This admin function deletes a user by their ID
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    if (error) throw error;

    res.status(200).json({ message: 'User deleted successfully.', user: data.user });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;