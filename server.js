// server.js
import dotenv from 'dotenv';
dotenv.config(); // Still good practice to load this first

import express from 'express';
import cors from 'cors';
import cron from 'node-cron'; // --- IMPORT CRON ---

// --- Import Supabase Client ---
// This file must 'export default supabase' for the cron job to work
import supabase from './config/supabaseClient.js'; 

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

// --- ------------------------------ ---
// --- SCHEDULED TASKS ---
// --- ------------------------------ ---

/**
 * JOB 1: Runs at 00:00 (Midnight)
 * This function runs at midnight to enforce accountability.
 * 1. Finds all unique users.
 * 2. For each user, counts active goals (is_completed = false) where the user 
 * failed to check in (accountability = false).
 * 3. Updates a number of buildings' status to "destroyed" equal to that count.
 */
const handleMidnightAccountabilityCheck = async () => {
  console.log('Running 00:00 accountability check...');
  
  try {
    // 1. Get all distinct user_ids from the goals table
    const { data: users, error: usersError } = await supabase
      .from('goals')
      .select('user_id', { distinct: true });

    if (usersError) throw new Error(usersError.message);

    // 2. Loop through each user
    for (const user of users) {
      const userId = user.user_id;
      
      // 3. Count their failed goals
      // A "failed" goal is:
      // - Not completed (is_completed = false)
      // - Not accountable (accountability = false)
      // We no longer check the target_date for the daily punishment.
      const { count, error: countError } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true }) // Special syntax to get only the count
        .eq('user_id', userId)
        .eq('is_completed', false)
        .eq('accountability', false); // <-- We removed the .lte('target_date', ...) check

      if (countError) {
        console.error(`Error counting goals for user ${userId}:`, countError.message);
        continue; // Skip to the next user
      }

      const failedGoalCount = count || 0;

      if (failedGoalCount > 0) {
        console.log(`User ${userId} has ${failedGoalCount} failed goals. Updating buildings to "destroyed"...`);

        // 4. Find that many buildings to destroy
        // (This finds the 'oldest' buildings by default that are not already destroyed)
        const { data: buildingsToUpdate, error: buildingsError } = await supabase
          .from('building') 
          .select('id')
          .eq('user_id', userId)
          .neq('status', 'destroyed') // Only select buildings NOT already destroyed
          .limit(failedGoalCount);
        
        if (buildingsError) {
          console.error(`Error fetching buildings for user ${userId}:`, buildingsError.message);
          continue;
        }

        if (buildingsToUpdate.length > 0) {
          // 5. Update their status to "destroyed"
          const idsToUpdate = buildingsToUpdate.map(b => b.id);
          
          const { error: updateError } = await supabase
            .from('building')
            .update({ status: 'destroyed' }) // Set status to "destroyed"
            .in('id', idsToUpdate);
          
          if (updateError) {
            console.error(`Error updating buildings for user ${userId}:`, updateError.message);
          } else {
            console.log(`Successfully set status to "destroyed" for ${idsToUpdate.length} buildings for user ${userId}.`);
          }
        } else {
          console.log(`User ${userId} had ${failedGoalCount} failed goals, but no active buildings to destroy.`);
        }
      } else {
        console.log(`User ${userId} has no failed goals. No action taken.`);
      }
    }
    console.log('Midnight accountability check finished.');

  } catch (error) {
    console.error('An error occurred during the midnight check:', error);
  }
};


/**
 * JOB 2: Runs at 00:01 (12:01 AM)
 * This function runs at 12:01 AM to reset accountability status for all goals.
 */
const handleGoalAccountabilityReset = async () => {
  console.log('Running 00:01 accountability reset...');
  try {
    const { error } = await supabase
      .from('goals')
      .update({ accountability: false }) // Set accountability to false
      .eq('accountability', true);      // Only for goals where it's currently true

    if (error) {
      console.error('Error resetting goal accountability:', error.message);
    } else {
      console.log('Successfully reset goal accountability for all users.');
    }
  } catch (error) {
    console.error('An error occurred during the accountability reset:', error);
  }
};


/**
 * JOB 3: Runs at 00:02 (12:02 AM)
 * This function auto-completes goals where the target_date is today.
 */
const handleAutoCompletionCheck = async () => {
  console.log('Running 00:02 auto-completion check...');
  
  try {
    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    console.log(`Checking for goals with target_date = ${todayString} to mark as complete.`);

    // 1. Find all goals due today that are not yet completed
    const { data, error } = await supabase
      .from('goals')
      .update({ is_completed: true }) // Set is_completed to true
      .eq('target_date', todayString) // Where the target_date is today
      .eq('is_completed', false)      // And it's not already complete
      .select(); // Return the updated rows

    if (error) {
      console.error('Error auto-completing goals:', error.message);
    } else {
      if (data && data.length > 0) {
        console.log(`Successfully auto-completed ${data.length} goals for ${todayString}.`);
      } else {
        console.log(`No goals found to auto-complete for ${todayString}.`);
      }
    }
  } catch (error) {
    console.error('An error occurred during the auto-completion check:', error);
  }
};


// Schedule Job 1 to run at midnight (0 minutes, 0 hours) every day
cron.schedule('0 0 * * *', handleMidnightAccountabilityCheck, {
  timezone: "America/New_York" // Specify your server's timezone
});
console.log('Cron job scheduled: Midnight accountability check will run at 00:00.');


// Schedule Job 2 to run at 12:01 AM (1 minute, 0 hours) every day
cron.schedule('1 0 * * *', handleGoalAccountabilityReset, {
  timezone: "America/New_York" // Specify your server's timezone
});
console.log('Cron job scheduled: Goal accountability reset will run at 00:01.');


// Schedule Job 3 to run at 12:02 AM (2 minutes, 0 hours) every day
cron.schedule('2 0 * * *', handleAutoCompletionCheck, {
  timezone: "America/New_York" // Specify your server's timezone
});
console.log('Cron job scheduled: Goal auto-completion will run at 00:02.');


// --- ------------------------------ ---
// --- END SCHEDULED TASKS ---
// --- ------------------------------ ---


// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Mounted /profiles routes from API/profile/');
  console.log('Mounted /building routes from API/building/');
  console.log('Mounted /goals routes from API/goals/');
  console.log('Mounted /users routes from API/users/');
  console.log('Mounted /auth routes from API/auth/');
});