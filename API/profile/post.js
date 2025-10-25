// API/profile/post.js
import express from 'express';
import supabase from '../../config/supabaseClient.js'; // Adjust path as needed

const router = express.Router();

/**
 * CREATE (Insert) a new profile.
 * Route: POST /profiles/
 * Expects: { "id": "user-uuid", "username": "new_user", "points": 10 }
 */
router.post('/', async (req, res) => {
  const { id, username, points } = req.body;

  if (!id || !username) {
    return res.status(400).json({ error: 'User ID and username are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: id, 
          username: username, 
          points: points || 0 
        },
      ])
      .select()
      .single(); 

    if (error) throw error;

    console.log('Profile created:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;