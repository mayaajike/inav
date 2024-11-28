import React, { useState, useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';
import PasswordChecklist from "react-password-checklist";
import '../CSS/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/inav logo.png';

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/signup`, {
                method: "POST",
                headers: {
                    "COntent-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, username, email, password, passwordAgain }),
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json();
                const loggedInUser = data.user;
                localStorage.setItem("accessToken", data.user.accessToken);
                localStorage.setItem("refreshToken", data.user.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));

                setFirstName("");
                setLastName("");
                setUsername("");
                setEmail("");
                setPassword("");
                setPasswordAgain("");

                updateUser(loggedInUser)
                navigate("/");
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    return(
        <div className="signup-page">
            <div className="signup-container">
                <h2 className="title">Join iNav!</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordAgain">Confirm Password:</label>
                        <input type="password" id="passwordAgain" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} required />
                    </div>
                    <div className="password-check">
                        <PasswordChecklist
                            rules={["minLength", "specialChar", "number", "capital", "match", "notEmpty"]}
                            minLength={8}
                            value={password}
                            valueAgain={passwordAgain}
                            onChange={(isValid) => { }}
                            messages={{
                                minLength: "Password should have 8 characters minimum",
                                specialChar: "Password must contain a special character",
                                number: "Password must contain a number",
                                capital: "Password must contain at least one capital letter",
                                match: "Passwords must match",
                                notEmpty: "Password cannot be empty",
                            }}
                        />
                    </div>
                    <button type="submit" style={{backgroundColor: 'purple'}}>Sign Up</button>
                    <p> Already have an account? <Link to="/login">Login</Link> </p>
                </form>
            </div>
            <div className="signup-text">
                <img className="logo" src={logo} style={{ width: "250px", height: "250px"}} />
                <p>Here at iNav, we connect international students to opportunities that cater to them! 
                    No more wasting time completing applications you're going to get rejected to because of your status. <br/><span className='join-text'>Join iNav Today!</span></p>
            </div>
        </div>
    )
}