import styles from './GoalItem.module.css';

export default function GoalItem({ name, type, description, targetDate, iscompleted }) {
    return(
        <div className={styles.goalItem}>
            <div className={styles.info}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.type}>Type: {type}</p>
                <p className={styles.description}>{description}</p>
                <p className={styles.targetDate}>Target Date: {new Date(targetDate).toLocaleDateString()}</p>
                <p className={styles.status}>Status: {iscompleted ? 'Completed' : 'In Progress'}</p>
            </div>
        </div>
    )
}