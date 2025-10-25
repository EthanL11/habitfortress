// server.js
import dotenv from 'dotenv';
dotenv.config(); // Still good practice to load this first

import express from 'express';
import cors from 'cors';

// --- Import Routers ---
// This import will now work, because it loads its own .env file
import './config/supabaseClient.js'; 
import postProfileRouter from './API/profile/post.js';
import patchProfileRouter from './API/profile/patch.js';
import deleteProfileRouter from './API/profile/delete.js';

// --- App Setup ---
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Mount Routers ---
app.use('/profiles', postProfileRouter);
app.use('/profiles', patchProfileRouter);
app.use('/profiles', deleteProfileRouter);

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Mounted /profiles routes from API/profile/');
});