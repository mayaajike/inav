import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../Components/NavBar'
import AppCard from '../Components/AppCard'
import "../CSS/Opportunities.css"

export default function Opportunities() {
    const [intData, setIntData] = useState(null);
    const [scholData, setScholData] = useState(null);
    const [fellData, setFellData] = useState(null);
    const [error, setError] = useState(null);
    const hasRunRef = useRef(false)
    const [data, setData] = useState(null);
    
    const intUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
    const scholUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&start=30&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
    const fellUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&start=60&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '21ed57571fmshfdb96a8f0e8abccp1a9dabjsnd57057928769',
		    'x-rapidapi-host': 'rapid-linkedin-jobs-api.p.rapidapi.com'
        }
    };

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            fetchData();
            // fetchIntData();
            // fetchScholData();
            // fetchFellData();
            
        }
    })

    const fetchIntData = async () => {
        try{
            const response = await fetch(intUrl, options);
            const result = await response.json();
            setIntData(result.data);
        }catch (error) {
            console.error(error);
        }
    }

    const fetchScholData = async () => {
        try {
            const response = await fetch(scholUrl, options);
            const result = await response.json();
            setScholData(result.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchFellData = async () => {
        try {
            const response = await fetch(fellUrl, options);
            const result = await response.json();
            setFellData(result.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/opportunities', 
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
    
                });
            if (response.ok) {
                const data = await response.json()
                setData(data);
            }
            
        } catch (error) {
            throw new Error("Unable to fetch Opportunities", error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className='cards-group'>
                {/* map through the internship data and render AppCard components */}
                {data && data.map((item, index) => (
                    <AppCard 
                        key={index}
                        image={item.companyLogo}
                        text={item.companyName}
                        title={item.title} 
                        link={item.jobPosting}/>
                ))} 
            </div>
        </div>
    )
}