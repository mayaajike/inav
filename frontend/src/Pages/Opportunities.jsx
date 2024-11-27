import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../Components/NavBar'
import AppCard from '../Components/AppCard'
import "../CSS/Opportunities.css"
import Pagination from '../Components/Pagination'

export default function Opportunities() {
    const hasRunRef = useRef(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [oppsPerPage, setOppsPerPage] = useState(20);

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            fetchData();
        }
    }, [])

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

    const indexOfLastPost = currentPage * oppsPerPage;
    const indexOfFirstPost = indexOfLastPost - oppsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div>
            <NavBar />
            <div className='cards-group'>
                {/* map through the internship data and render AppCard components */}
                {currentPosts && currentPosts.map((item, index) => (
                    <AppCard key={index} image={item.companyLogo} text={item.companyName} title={item.title} link={item.jobPosting} oppId={item.id}/>
                ))} 
            </div>

            {data && (
                <Pagination oppsPerPage={oppsPerPage} totalOpps={data.length} paginate={paginate} currentPage = {currentPage} setCurrentPage={setCurrentPage} />
            )}
        </div>
    )
}