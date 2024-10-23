import React from 'react'
import NavBar from '../Components/NavBar'
import AppCard from '../Components/AppCard'
import "../CSS/Opportunities.css"

export default function Opportunities() {
    return (
        <div>
            <NavBar />
            <h2 className='headers'>Internships</h2>
            <div className='cards-group'>
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
            </div>
            <h2 className='welcome'>Scholarships</h2>
            <div className='cards-group'>
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
            </div>
            <h2 className='welcome'>Fellowships</h2>
            <div className='cards-group'>
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/> 
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/>
                <AppCard image="placeholder.js" text="random text" title="random title"/> <AppCard image="placeholder.js" text="random text" title="random title"/>  
            </div>
        </div>
    )
}