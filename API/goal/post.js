// API/goals/post.js
import express from 'express';
import supabase from '../../config/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  // Extract goal data from request body
  // 'id' and 'created_at' are auto-generated
  const { user_id, name, description, target_date, is_completed = false, type } = req.body;

  // Validate required fields
  if (!user_id || !name) {
    return res.status(400).send({ error: 'Missing required fields: user_id and name' });
  }

  try {
    const { data, error } = await supabase
      .from('goals')
      .insert([
        { user_id, name, description, target_date, is_completed, type }
      ])
      .select();

    if (error) throw error;

    // Send back the newly created goal data
    res.status(201).send(data[0]);
  } catch (error) {
    console.error('Error creating goal:', error.message);
    res.status(500).send({ error: error.message });
  }
});

export default router;