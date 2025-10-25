// server.js
import dotenv from 'dotenv';
dotenv.config(); // Still good practice to load this first

import express from 'express';
import cors from 'cors';

// --- Import Supabase Client (initializes it) ---
import './config/supabaseClient.js'; 

// --- Import Profile Routers ---
import getProfileRouter from './API/profile/get.js';
import postProfileRouter from './API/profile/post.js';
import patchProfileRouter from './API/profile/patch.js';
import deleteProfileRouter from './API/profile/delete.js';

// --- Import Building Routers ---
import getBuildingRouter from './API/building/get.js';
import postBuildingRouter from './API/building/post.js';
import patchBuildingRouter from './API/building/patch.js';
import deleteBuildingRouter from './API/building/delete.js';

// --- Import Goal Routers ---
import getGoalRouter from './API/goals/get.js';
import postGoalRouter from './API/goals/post.js';
import patchGoalRouter from './API/goals/patch.js';
import deleteGoalRouter from './API/goals/delete.js';

// --- Import User (Admin) Routers ---
import getUserRouter from './API/users/get.js';
import postUserRouter from './API/users/post.js';
import deleteUserRouter from './API/users/delete.js';

// --- Import Auth Router ---
import loginRouter from './API/auth/login.js';

// --- App Setup ---
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Mount Profile Routers ---
app.use('/profile', getProfileRouter);
app.use('/profile', postProfileRouter);
app.use('/profile', patchProfileRouter);
app.use('/profile', deleteProfileRouter);

// --- Mount Building Routers ---
app.use('/building', getBuildingRouter);
app.use('/building', postBuildingRouter);
app.use('/building', patchBuildingRouter);
app.use('/building', deleteBuildingRouter);

// --- Mount Goal Routers ---
app.use('/goals', getGoalRouter);
app.use('/goals', postGoalRouter);
app.use('/goals', patchGoalRouter);
app.use('/goals', deleteGoalRouter);

// --- Mount User (Admin) Routers ---
app.use('/users', getUserRouter);
app.use('/users', postUserRouter);
app.use('/users', deleteUserRouter);

// --- Mount Auth Router ---
app.use('/auth', loginRouter);

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Mounted /profiles routes from API/profile/');
  console.log('Mounted /building routes from API/building/');
  console.log('Mounted /goals routes from API/goals/');
  console.log('Mounted /users routes from API/users/');
  console.log('Mounted /auth routes from API/auth/');
});