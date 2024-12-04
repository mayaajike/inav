import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import AppCard from '../Components/AppCard';
import "../CSS/InProgress.css"; // Optional: for styling the page

export default function InProgress() {
    const [inProgressApps, setInProgressApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    // Fetch in-progress applications from the server
    useEffect(() => {
        const fetchInProgressApplications = async () => {
            try {
                const response = await fetch(`http://localhost:3000/inprogress-applications?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message) {
                        setError(data.message);
                    } else {
                        setInProgressApps(data);
                    }
                } else {
                    setError("Failed to fetch in-progress applications.");
                }
            } catch (error) {
                setError("Something went wrong while fetching in-progress applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchInProgressApplications();
    }, [username]);

    return (
        <div>
            <NavBar />
            <div className="in-progress-container">
                <h2>In-Progress Applications</h2>  
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="cards-group">
                    {inProgressApps && inProgressApps.length > 0 ? (
                        inProgressApps.map((item, index) => (
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
                        <p>No in-progress applications found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
