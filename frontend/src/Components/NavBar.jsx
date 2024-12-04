import React, { useState } from 'react'
import '../CSS/NavBar.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '../assets/inav logo.png'
import { FaRegUser } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

export default function NavBar({ onSearch }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  }
  
  const handleLogout = () => {
    localStorage.clear();
  }

  const isActive = (path) => location.pathname === path;

  return (
      <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/">
        <img src={logo} alt="iNav Logo" style={{ width: '50px', height: '50px' }} />
          iNav</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/opportunities" className={isActive("/opportunities") ? 'active' : ''}>Opportunities</Nav.Link>
            <NavDropdown title="Application Hub" id="basic-nav-dropdown">
            <NavDropdown.Item href="/saved" className={isActive("/saved") ? 'active' : ''}>Saved</NavDropdown.Item>
              <NavDropdown.Item href="/completed" className={isActive("#action/3.2") ? 'active' : ''}>Completed</NavDropdown.Item>
              <NavDropdown.Item href="/in-progress" className={isActive("#action/3.3") ? 'active' : ''}>In Progress</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/applications" className={isActive("/applications") ? 'active' : ''}>All Applications</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {location.pathname=== '/opportunities' && (
            <Nav className='ms-auto'>
              <input type="text" placeholder='Search Opportunities' value={searchQuery} onChange={handleSearchChange} className='search-bar'/>
            </Nav>
          )}
          <Nav className="ms-auto">
              <NavDropdown title={<FaRegUser style={{ width: '25px', height: '25px '}} />} id="user-nav-dropdown">
                  <NavDropdown.Item href="/profile" className={isActive("/profile") ? 'active' : ''}>Profile</NavDropdown.Item>
                  <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='/login' onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
