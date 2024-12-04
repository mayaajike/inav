import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate  } from 'react-router-dom'
import "../CSS/Card.css"

export default function AppCard({ image, title, text, link, oppId }) {
    const [saved, setSaved] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const hasRunRef = useRef(false);
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;

    useEffect(() => {
        if (!hasRunRef.current) {
            hasRunRef.current = true;
            checkSaved();
        }

        // trigger pop up
        const returnFromApply = localStorage.getItem('returnFromApply');
        if (returnFromApply === 'true') {
            setShowPopup(true);
            localStorage.removeItem('returnFromApply');
        }
    }, [])

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
                body: JSON.stringify({ oppId: oppId, username: username }),
            });
            if (response.ok) {
                setSaved(true);
            } else {
                console.error("Error saving opportunity", response.statusText);
            }
        } catch (error) {
            console.error("Unable to save opp", error);
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
            console.error("Unable to unsave opp", error);
        }
    }

    const handleApplyClick = ()=> {
        localStorage.setItem('returnFromApply', 'true');
        window.open(link, '_blank');
    }

    const handlePopupSubmit = async (completed) => {
        console.log(username);
        setShowPopup(false);
        try {
            const response = await fetch('http://localhost:3000/application-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oppId: oppId,
                    username: username,
                    completed: completed,
                }),
            });
            console.log(response);
            if (response.ok) {
                
                alert('Your application status has been updated.');
            } else {
                console.error('Error updating application status');
            }
        } catch (error) {
            console.error('Error:', error);
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
                        {/* <Link to={link} target='_blank' rel='noopener noreferrer'> */}
                        <Button style={{ backgroundColor: 'purple', color: 'white' }} onClick={handleApplyClick}>Apply</Button>
                        {/* </Link> */}
                        <Button className="save-button" style={{backgroundColor: saved ? '#9B6BCC' : 'purple'}} onClick={saved ? unsaveOpp : saveOpp }>{saved ? 'Saved' : 'Save'}</Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Popup for confirming application completion */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Did you complete the application?</h3>
                        <Button variant="success" onClick={() => handlePopupSubmit(true)}>Yes</Button>
                        <Button variant="danger" onClick={() => handlePopupSubmit(false)}>No</Button>
                    </div>
                </div>
            )}
        </div>
    )}

