import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../Components/NavBar'
import "../CSS/Home.css"
import Card from '../Components/AppCard'

export default function Home() {
    const [username, setUsername] = useState("");
    const [data, setData] = useState([]);
    const hasRunRef = useRef(false);
    const [opps, setOpps] = useState([]);

    useEffect(() => {
        getUsername()
    }, [username])

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            fetchData();
        }
    }, [])

    const getUsername = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:3000/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            credentials: "include",
        });

        if (response.ok){
            const data = await response.json();
            setUsername(data.username)
            localStorage.setItem("tokenExp", data.exp)
        }
    }

    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        try {
            const response = await fetch(`http://localhost:3000/opportunities`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
            });
            if (response.ok) {
                const opportunities = await response.json();
                //fetch saved opportunities for the user
                const savedOpps = await fetch(`http://localhost:3000/saved-opportunities?username=${user.username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (savedOpps.ok) {
                    const savedData = await savedOpps.json();
                    const savedOppIds = savedData.map(opportunity => opportunity.oppId);
                    const data = opportunities.filter(opportunity => 
                        savedOppIds.includes(opportunity.id)
                    );
                    setData(data);
                    
                    const unsavedOpps = opportunities.filter(opportunity =>
                        !savedOppIds.includes(opportunity.id)
                    );
                    setOpps(unsavedOpps);
                }
            }
        } catch (error) {
            throw new Error("Unable to fetch Opportunities", error);
        }
    }
    return (
        <div>
            <NavBar />
            <h2 className='welcome'>Hey {username}, Welcome Back!</h2>
            <h3 className='welcome'>Here's what you missed...</h3>
            <div className='cards' style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', justifyContent: 'flex-start', width: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {opps.slice(0, 6) && opps.slice(0, 6).map((item, index) => (
                    <Card key={index} image={item.companyLogo} text={item.companyName} title={item.title} link={item.jobPosting} oppId={item.id} 
                    style={{ width: '100px', height: '150px', border: '2px solid #ddd', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1', backgroundColor: '#fff', transition: 'transform 0.3s ease' }} />
                ))}
            </div>
            <h3 className='welcome'>Continue working on...</h3>
            <div className='cards' style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', justifyContent: 'flex-start', width: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {data.slice(0, 5) && data.slice(0, 5).map((item, index) => (
                    <Card key={index} image={item.companyLogo} text={item.companyName} title={item.title} link={item.jobPosting} oppId={item.id}
                    style={{ width: '100px', height: '150px', border: '2px solid #ddd', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1', backgroundColor: '#fff', transition: 'transform 0.3s ease' }} />
                ))} 
            </div>
        </div>
    )
}