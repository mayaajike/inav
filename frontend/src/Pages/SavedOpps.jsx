import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../Components/NavBar';
import AppCard from '../Components/AppCard';
import "../CSS/Opportunities.css"; 

export default function SavedOpps() {
    const hasRunRef = useRef(false);
    const [savedOpps, setSavedOpps] = useState([]);
    let user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    const fetchSavedOpportunities = async () => {
        try {
            const response = await fetch(`http://localhost:3000/saved-opportunities?username=${username}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSavedOpps(data);
            } else {
                console.error("Failed to fetch saved opportunities");
            }
        } catch (error) {
            console.error("Error fetching saved opportunities:", error);
        }
    };

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            fetchSavedOpportunities();
        }
    }, []);

    return (
        <div>
            <NavBar />
            <div className="cards-group">
                {savedOpps && savedOpps.length > 0 ? (
                    savedOpps.map((item, index) => (
                        <AppCard
                            key={index}
                            image={item.opportunity.companyLogo}
                            title={item.opportunity.title}
                            text={item.opportunity.companyName}
                            link={item.opportunity.jobPosting}
                            oppId={item.oppId} 
                        />
                    ))
                ) : (
                    <p>No saved opportunities found.</p>
                )}
            </div>
        </div>
    );
}
