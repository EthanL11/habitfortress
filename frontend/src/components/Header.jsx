import React, { useEffect, useState } from "react";
// Make sure this path points to your client-side supabase client
import { supabase } from '../supabaseClient'; 

export default function Header() {
    const [username, setUsername] = useState('Loading...');
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get the current user from Supabase's built-in session
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError) throw new Error("Auth error: " + authError.message);
                
                if (user) {
                    // 2. If user is found, fetch their row from the 'profiles' table
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('username, points')
                        .eq('id', user.id) // Match the 'id' in profiles to the user.id
                        .single(); // Get just one row

                    if (error) {
                        // This error often means RLS (Row Level Security) is blocking the query
                        throw new Error("Profile error: " + error.message);
                    }

                    if (data) {
                        setUsername(data.username);
                        setPoints(data.points);
                    } else {
                        setUsername('No Profile'); // User exists, but no matching profile row
                    }
                } else {
                    setUsername('Guest'); // No user session found
                }
            } catch (err) {
                console.error(err);
                setUsername('Error'); // Set username to 'Error' if anything fails
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ textAlign: "center", backgroundColor: 'purple' }}>
            <div>Welcome, {username}</div>
            <div>Points: {points}</div>
        </div>
    );
}