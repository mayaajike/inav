import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar'
import "../CSS/Home.css"
import Card from '../Components/AppCard'

export default function Home() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        getUsername()
    }, [username])

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

    return (
        <div>
            <NavBar />
            <h2 className='welcome'>Hey {username}, Welcome Back!</h2>
            <h3 className='welcome'>Here's what you missed...</h3>
            <div className='cards'>
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
            </div>
            <h3 className='welcome'>Continue working on...</h3>
            <div className='cards'>
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
                <Card image="placeholder.js" text="random text" title="random title"/> <Card image="placeholder.js" text="random text" title="random title"/> 
            </div>
        </div>
    )
}