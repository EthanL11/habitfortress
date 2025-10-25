// src/components/GoalItem.jsx
import styles from './GoalItem.module.css';

// Destructure props, including the new 'goal' object and 'onEditClick' function
export default function GoalItem({ goal, onEditClick, name, type, description, targetDate, iscompleted }) {

  // Function to call when the edit button is clicked
  const handleEdit = () => {
    onEditClick(goal); // Pass the specific goal data up to the parent
  };

  return(
      <div className={styles.goalItem}>
          <div className={styles.info}>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.type}>Type: {type}</p>
              <p className={styles.description}>{description}</p>
              {/* Only show date if it exists */}
              {targetDate && <p className={styles.targetDate}>Target Date: {new Date(targetDate).toLocaleDateString()}</p>}
              <p className={styles.status}>Status: {iscompleted ? 'Completed' : 'In Progress'}</p>
              {/* Attach the handleEdit function to the button's onClick */}
              <button className={styles.editButton} onClick={handleEdit}>
                  {'Edit Goal'}
              </button>
          </div>
      </div>
  )
}