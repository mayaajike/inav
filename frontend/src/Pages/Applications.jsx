import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import AppCard from '../Components/AppCard';
import "../CSS/Opportunities.css"; // Optional: if you want to use similar styles

export default function Applications() {
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);

    useEffect(() => {
        fetchAppliedOpportunities();
    }, []);

    const fetchAppliedOpportunities = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        const username = user.username;

        try {
            const response = await fetch(`http://localhost:3000/applied-opportunities?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAppliedOpportunities(data); // Store the applied opportunities in state
            } else {
                console.error('Error fetching applied opportunities', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className='cards-group'>
                {appliedOpportunities.length > 0 ? (
                    appliedOpportunities.map((item, index) => (
                        <AppCard
                            key={index}
                            image={item.companyLogo}
                            title={item.title}
                            text={item.companyName}
                            link={item.jobPosting}
                            oppId={item.id}
                        />
                    ))
                ) : (
                    <p>No applied opportunities found.</p>
                )}
            </div>
        </div>
    );
}
