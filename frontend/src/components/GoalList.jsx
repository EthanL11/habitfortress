
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import GoalItem from './GoalItem'; 
import Modal from './Modal';
import styles from './GoalList.module.css';
import EditGoalForm from './EditGoalForm';

export default function GoalList() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    const fetchGoalsFromApi = async () => {
      setLoading(true);
      setError(null); 

      try {
        // 1. Get the currently logged-in user from Supabase frontend client
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Check if we successfully got the user
        if (authError || !user) {
          throw new Error("Could not get user session. Please log in again.");
        }

        // 2. Construct the API URL using the user's ID
        const userId = user.id;
        const apiUrl = `http://localhost:5000/goals/user/${userId}`; // <-- Dynamic URL

        // 3. Call YOUR API endpoint using fetch
        const response = await fetch(apiUrl, {
          method: 'GET', // It's a GET request to fetch data
          headers: {
            'Content-Type': 'application/json', 
          }
        });

        // 4. Check if the API call failed
        if (!response.ok) {
          // Try to get a specific error message from the API response if possible
          let errorMsg = `Failed to fetch goals (Status: ${response.status})`;
          try {
              const errorData = await response.json();
              errorMsg = errorData.message || errorData.error || errorMsg;
          } catch(e) { /* Ignore if response wasn't JSON */ }
          throw new Error(errorMsg);
        }

        // 5. Parse the JSON data (the array of goals)
        const goalsData = await response.json(); 
        
        // 6. Update the component's state with the fetched goals
        setGoals(goalsData); 

      } catch (err) {
        console.error("Error fetching goals from API:", err);
        setError(err.message); // Set the error state to display it
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchGoalsFromApi();
    
  // The empty array means this useEffect runs only once when the component mounts
  }, []); 

  // --- Render logic based on state ---

  const handleOpenEditModal = (goal) => {
    setSelectedGoal(goal); // Remember which goal was clicked
    setIsModalOpen(true);  // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null); // Forget which goal was selected
  };

  // --- 👇 NEW FUNCTIONS FOR UPDATING/DELETING (Passed to EditGoalForm) ---
  const handleUpdateGoal = async (goalId, updatedData) => {
    // Note: We return the promise here so EditGoalForm can handle loading/errors
    
    // !!! CONFIRM URL is /goals/:id !!!
    const response = await fetch(`http://localhost:5000/goals/${goalId}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(updatedData) // Send only changed fields
    });

    if (!response.ok) {
      let errorMsg = 'Failed to update goal.';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch(e) {/* Ignore */}
      throw new Error(errorMsg); // This rejects the promise for EditGoalForm
    }

    const savedGoal = await response.json(); // Get the updated goal back from API

    // Update local state and close modal
    setGoals(goals.map(g => g.id === savedGoal.id ? savedGoal : g));
    handleCloseModal();
    // Promise resolves successfully here
  };

  // --- 👇 UPDATE handleDeleteGoal (No Auth Header) ---
  const handleDeleteGoal = async (goalId) => {
    // Use confirm() carefully or build a custom confirmation modal
    if (window.confirm("Are you sure you want to delete this goal?")) {
        try {
           // !!! CONFIRM URL is /goals/:id !!!
           const response = await fetch(`http://localhost:5000/goals/${goalId}`, {
             method: 'DELETE',
             headers: {
               // 'Authorization': `Bearer ${token}` // REMOVED
               // Body might be empty or { "id": goalId } depending on API
             }
           });

           if (!response.ok) {
              let errorMsg = 'Failed to delete goal.';
              try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.error || errorMsg;
              } catch(e) {/* Ignore */}
              throw new Error(errorMsg);
           }

           // If API call successful, update local state and close modal
           setGoals(goals.filter(g => g.id !== goalId));
           handleCloseModal();

        } catch (err) {
            console.error("Delete Error:", err);
            // Show an error message to the user
            // Consider using a more user-friendly notification than alert
            alert("Error deleting goal: " + err.message); 
        }
    }
  };

  if (loading) {
    return <p>Loading your goals...</p>;
  }

  // Display error message if fetching failed
  if (error) {
    return <p style={{ color: 'red' }}>Error loading goals: {error}</p>; 
  }

  if (goals.length === 0) {
    return <p>You haven't added any goals yet. Let's build!</p>;
  }

  // Render the list of GoalItem components if everything succeeded
  return (
    <div className={styles.goalList}>
      {goals.map(goal => {
        const goalTypeString = goal.type === 1 ? 'Habit' : (goal.type === 0 ? 'Addiction' : 'Unknown');

        return (
          <GoalItem
            key={goal.id}
            
            goal={goal} 
            onEditClick={handleOpenEditModal} 
            name={goal.name}
            type={goalTypeString}
            description={goal.description}
            targetDate={goal.target_date}
            iscompleted={goal.is_completed}
          />
        );
      })}

      {}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedGoal && ( 
            <EditGoalForm
              goal={selectedGoal}
              onSave={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
        )}
      </Modal>
    </div>
  );
}