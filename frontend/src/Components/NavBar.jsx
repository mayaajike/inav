import React from 'react'
import '../CSS/NavBar.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '../assets/inav logo.png'
import { FaRegUser } from "react-icons/fa";

export default function NavBar() {
  const handleLogout = () => {
    localStorage.clear();
  }

  return (
      <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/">
        <img src={logo} alt="iNav Logo" style={{ width: '50px', height: '50px' }} />
          iNav</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/opportunities">Opportunities</Nav.Link>
            <NavDropdown title="Application Hub" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Pending</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Completed</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">In Progress</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/applications">All Applications</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#link">Mentorship Hub</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
              <NavDropdown title={<FaRegUser style={{ width: '25px', height: '25px '}} />} id="user-nav-dropdown">
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
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
