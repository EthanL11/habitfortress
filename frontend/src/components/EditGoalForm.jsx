// src/components/EditGoalForm.jsx
import { useState } from 'react';
import styles from './EditGoalForm.module.css'; // We'll create this CSS file next

// Props received from GoalList:
// - goal: The goal object being edited
// - onSave: Function to call when saving changes (takes goalId, updatedData)
// - onDelete: Function to call when deleting (takes goalId)
export default function EditGoalForm({ goal, onSave, onDelete }) {
  // --- State for Form Fields ---
  // Initialize state with the values from the 'goal' prop
  const [name, setName] = useState(goal.name);
  const [description, setDescription] = useState(goal.description || ''); // Handle null description
  // Format date for input type="date" which expects 'YYYY-MM-DD'
  // goal.target_date might be null or undefined, check first
  const initialDate = goal.target_date ? goal.target_date.substring(0, 10) : '';
  const [targetDate, setTargetDate] = useState(initialDate);
  const [isCompleted, setIsCompleted] = useState(goal.is_completed);
  // Add state for other editable fields if needed (e.g., type, accountability)
  // const [type, setType] = useState(goal.type); // Example: assuming type is editable

  // --- State for UI Feedback ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Handle Save Button Click ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setIsLoading(true);

    // Prepare the data payload to send to the API
    const updatedData = {
      name: name,
      description: description,
      // Send null if the date input is cleared, otherwise send the YYYY-MM-DD string
      target_date: targetDate ? targetDate : null,
      is_completed: isCompleted,
      // Add other fields if they are editable
      // type: type,
    };

    // Call the onSave function passed down from GoalList.
    // This function contains the actual fetch() call to the PATCH API.
    // It returns a promise, so we can chain .catch() and .finally() here.
    onSave(goal.id, updatedData)
      .catch(err => {
        // If the onSave function (in GoalList) throws an error, catch it here
        console.error("Error saving goal:", err);
        setError(err.message || "Failed to save changes. Please try again.");
        setIsLoading(false); // Re-enable form ONLY if there was an error
      });
      // Don't set setIsLoading(false) here unconditionally, because on success,
      // the parent component (GoalList) closes the modal, unmounting this form.
  };

  // --- Handle Delete Button Click ---
  const handleDelete = () => {
    setError(null); // Clear errors before attempting delete
    // Call the onDelete function passed down from GoalList.
    // This function contains the confirmation and the fetch() call to the DELETE API.
    onDelete(goal.id);
    // GoalList handles closing the modal after successful delete or if user cancels confirm()
  };

  // --- JSX for the Form ---
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Edit Goal: {goal.name}</h2> {/* Show original name */}

      {/* Display API errors */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Name Input */}
      <div className={styles.inputGroup}>
        <label htmlFor={`goalName-${goal.id}`}>Name</label> {/* Use goal.id for unique ID */}
        <input
          id={`goalName-${goal.id}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // Make name required
          disabled={isLoading} // Disable input while loading
        />
      </div>

      {/* Description Input */}
      <div className={styles.inputGroup}>
        <label htmlFor={`goalDescription-${goal.id}`}>Description</label>
        <textarea
          id={`goalDescription-${goal.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Target Date Input */}
      <div className={styles.inputGroup}>
        <label htmlFor={`goalTargetDate-${goal.id}`}>Target Date</label>
        <input
          id={`goalTargetDate-${goal.id}`}
          type="date" // Use date input type for easy date picking
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Is Completed Checkbox */}
      <div className={styles.checkboxGroup}>
          <input
              id={`goalIsCompleted-${goal.id}`}
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              disabled={isLoading}
          />
          <label htmlFor={`goalIsCompleted-${goal.id}`}>Mark as Completed</label>
      </div>

      {/* Add inputs for other fields like 'type' if needed */}

      {/* Buttons */}
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        {/* Type="button" prevents this from submitting the form */}
        <button type="button" onClick={handleDelete} className={styles.deleteButton} disabled={isLoading}>
          Delete Goal
        </button>
      </div>
    </form>
  );
}