import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";




import BaseBuilder from "../components/BaseBuilder"
import Header from "../components/Header"
import GoalList from "../components/GoalList";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {

  const navigate = useNavigate();
  const [ profile, setProfile ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const checkUserAndFetchProfile = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            navigate('/');
            return;
        }
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (profileError) {
            console.error('Error fetching profile:', profileError);
        } else {
            setProfile(profileData);
        }
        setLoading(false);
    };
    checkUserAndFetchProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }







  return (
    <div className={styles.container}>
      <div>
        <Header  
          profile={profile?.username} 
          onLogout={handleLogout} 
        />
      </div>
    

    <div>
      <BaseBuilder />
    </div>

    <div className={styles.goalListContainer}>
      <h2>Your Goals</h2>
      <GoalList />
    </div>
  </div>
  )
}