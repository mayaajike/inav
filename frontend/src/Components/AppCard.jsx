import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import "../CSS/Card.css"

export default function AppCard({ image, title, text, link, oppId }) {
    const [saved, setSaved] = useState(false);
    const hasRunRef = useRef(false);
    let user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            checkSaved();
        }
    })

    const checkSaved = async () => {
        try {
            const response = await fetch(`http://localhost:3000/saved-opportunity?oppId=${oppId}&username=${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            if (response.ok) {
                const data = await response.json();
                setSaved(true)
            }
        } catch(error) {
            null
        }
    }
    const saveOpp = async () => {
        try {
            const response = await fetch('http://localhost:3000/save-opportunity', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({ oppId, username }),
            });
            if (response.ok) {
                setSaved(true);
            }
        } catch (error) {
            null
        }
    }

    const unsaveOpp = async () => {
        try {
            const response = await fetch('http://localhost:3000/unsave-opportunity', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oppId, username }),
            });
            if (response.ok) {
                setSaved(false);
            }
        } catch(error) {
            console.error(error);
        }
    }
    return(
        <div>
            <Card className="card" style={{ width: '100%', marginBottom: '20px' }}>
                <Card.Img variant="top" src={image} style={{ width: "100%", height: "150px", objectFit: "cover" }}/>
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                    <div className="actions">
                        <Link to={link} target='_blank' rel='noopener noreferrer'>
                            <Button style={{ backgroundColor: 'purple', color: 'white' }}>Apply</Button>
                        </Link>
                        <Button className="save-button" style={{backgroundColor: saved ? '#9B6BCC' : 'purple'}} onClick={saved ? unsaveOpp : saveOpp}>{saved ? 'Saved' : 'Save'}</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
