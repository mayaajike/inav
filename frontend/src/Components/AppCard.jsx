import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import "../CSS/Card.css"

export default function AppCard({ image, title, text }) {
    return(
        <div>
            <Card className="card" style={{ width: '12rem' }}>
                <Card.Img variant="top" src={image} style={{ width: "188px", height: "120px" }}/>
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </div>
    )
}