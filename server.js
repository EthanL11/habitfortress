// --- Imports ---
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// --- Import Routers ---
// Note: We import supabaseClient.js here just to ensure it runs
// and is initialized before the routes, but it's not strictly needed
// if dotenv.config() runs first.
import './config/supabaseClient.js'; // This initializes the client
import postProfileRouter from './API/profile/post.js';
import patchProfileRouter from './API/profile/patch.js';
import deleteProfileRouter from './API/profile/delete.js';

// --- Setup ---
dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Mount Routers ---
// All routes from these files will be prefixed with /profiles
app.use('/profiles', postProfileRouter);
app.use('/profiles', patchProfileRouter);
app.use('/profiles', deleteProfileRouter);

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Mounted /profiles routes from API/profile/');
});