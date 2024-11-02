import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import "../CSS/Card.css"

export default function AppCard({ image, title, text, link }) {
    return(
        <div>
            <Card className="card" style={{ width: '100%', marginBottom: '20px' }}>
                <Card.Img variant="top" src={image} style={{ width: "100%", height: "150px", objectFit: "cover" }}/>
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                    <Link to={link} target='_blank' rel='noopener noreferrer'>
                        <Button variant="primary">Apply!</Button>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    )
}