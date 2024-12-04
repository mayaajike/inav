import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import AppCard from '../Components/AppCard';
import "../CSS/Completed.css";

export default function Completed() {
    const [completedApps, setCompletedApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    // Fetch completed applications from the server
    useEffect(() => {
        const fetchCompletedApplications = async () => {
            try {
                const response = await fetch(`http://localhost:3000/completed-applications?username=${username}`, {
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
                        setCompletedApps(data);
                    }
                } else {
                    setError("Failed to fetch completed applications.");
                }
            } catch (error) {
                setError("Something went wrong while fetching completed applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedApplications();
    }, [username]);

    return (
        <div>
            <NavBar />
            <div className="completed-container">
                <h2>Completed Applications</h2>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="cards-group">
                    {completedApps && completedApps.length > 0 ? (
                        completedApps.map((item, index) => (
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
                        <p>No completed applications found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
