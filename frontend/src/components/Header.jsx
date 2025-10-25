import React, {useEffect,useState} from "react"
export default function Header(){

    const[username, setUsername] = useState('Loading...');
    const[points, setPoints] = useState(0);

    useEffect (()=>{
        const fetchData = async ()=>{
        try{
            const response = await fetch('/api/profile');
            if(!response.ok){
                throw new error("Failed to fetch");
            }

            const data = response.json;

            setUsername(data.username);
            setPoints(data.points);
        }catch(err){
            console.log(err);
            setUsername('Error')
        }
    };
        fetchData();
    },[])
    return(
        <div style={{textAlign: "center",backgroundColor: 'purple'}}>
            <div>Welcome, {username}</div>
            <div>Points: {points}</div>
        </div>
    )
}