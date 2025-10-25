import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import GoalItem from './GoalItem';
import styles from './GoalList.module.css';

export default function GoalList() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchGoals = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const {data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .order('target_date', { ascending: true });

            if (error) {
                console.error('Error fetching goals:', error);
            } else {
                setGoals(data);
            }
        }
        setLoading(false);
    };

    fetchGoals();
}, []);

if (loading) {
    return <p>Loading goals...</p>;
}

if (goals.length === 0) {
    return <p>No goals found. Start by adding a new goal!</p>;

}

return (
    <div className='styles.goalList'>
        {goals.map(goal => (
            <GoalItem
                key={goal.id}
                name={goal.name}
                type={goal.type}
                description={goal.description}
                targetDate={goal.target_date}
                iscompleted={goal.iscompleted}
            />
        ))}
    </div>
);
}
