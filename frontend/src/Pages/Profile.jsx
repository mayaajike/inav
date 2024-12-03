import React, { useState, useEffect } from 'react'
import '../CSS/Profile.css'
import NavBar from '../Components/NavBar'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import * as yup from 'yup';

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userInfo, setUserInfo] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        profilePic: null,
        resume: null,
        gradDate: '',
        classification: '',
        major: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/user-info?username=${user.username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                    setFormData({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        email: data.email,
                        profilePic: data.profilePic || null,
                        resume: data.resume ? `http://localhost:3000${data.resume}` : null,
                        gradDate: data.gradDate ? new Date(data.gradDate).toISOString().slice(0, 10) : "",
                        classification: data.classification || "",
                        major: data.major || ""
                    });
                }
            } catch (error) {
                console.error("Unable to load user info", error);
            }
        };
        getUserInfo();
    }, [user.username]);

    const schema = yup.object().shape({
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        username: yup.string().required("Username is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        profilePic: yup.mixed().nullable().test("fileSize", "File is too large", (value) => {
            return !value || (value && value.size <= 5 * 1024 * 1024); //5MB max
        }).test('fileFormat', "Unsupported File Format", (value) => {
            return !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type));
        }),
        resume: yup.mixed().nullable().test("fileFormat", "Only PDF files are allowed", (value) => {
            if (!value) return true;
            return value.type === 'application/pdf';
        }).test("fileSize", "File is too large", (value) => {
            if (!value) return true;
            return value.size <= 100 * 1024 * 1024; //10MB max
        }),
        gradDate: yup.date().nullable().transform((value, originalValue) => {
            return originalValue === "" ? null : value;
        }),
        classification: yup.string(),
        major: yup.string()
    });

    const validateForm = (data) => {
        schema.validate(data, { abortEarly: false })
            .then(() => setErrors({})) 
            .catch((err) => {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
            });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        let newValue = value;
        if (name === "resume" && files.length === 0) {
            newValue = null;
        }
        if (name === "gradDate" && value === "") {
            newValue = null;
        }

        setFormData(prevData => ({
            ...prevData, [name]: type === 'file' ? (files[0] || null) : newValue
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        validateForm(formData);
        setLoading(true);
        if (formData.gradDate) {
            const date = new Date(formData.gradDate);
            formData.gradDate = date.toISOString();
        }
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        try {
            const response = await fetch('http://localhost:3000/user-info', {
                method: "PATCH",
                body: formDataToSend,
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            } else {
                throw new Error("Unable to update user information");
            }
        }catch (error) {
            console.error("Unable to update user information", error);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>
    }
    return (
        <>
            <NavBar />
             <div className='profile-form-container'>
                <Form noValidate onSubmit={submit}>
                    <div className='profile-pic-container'>
                        <img src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : '/profile_pic.jpg'} alt="Profile" />
                        <label htmlFor='profilePic'>Change Profile Picture</label>
                        <Form.Control type="file" name="profilePic" onChange={handleChange} />
                        {errors.profilePic && <Form.Text className="text-danger">{errors.profilePic}</Form.Text>}
                    </div>

                    <Row className='mb-3'>
                        <Form.Group as={Col} md="4">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <Form.Text className="text-danger">{errors.lastName}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text>@</InputGroup.Text>
                                <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
                            </InputGroup>
                            {errors.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Major</Form.Label>
                            <Form.Control type="text" name="major" value={formData.major} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Classification</Form.Label>
                            <Form.Control type="text" name="classification" value={formData.classification} onChange={handleChange} />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="4">
                            <Form.Label>Graduation Date</Form.Label>
                            <Form.Control type="date" name="gradDate" value={formData.gradDate} onChange={handleChange} />
                            {errors.gradDate && <Form.Text className="text-danger">{errors.gradDate}</Form.Text>}
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label>Resume</Form.Label>
                            <Form.Control type="file" name="resume" onChange={handleChange} />
                            {errors.resume && <Form.Text className="text-danger">{errors.resume}</Form.Text>}
                        </Form.Group>
                    </Row>

                    <Button type="submit">{loading ? 'Updating...' : 'Update Profile'}</Button>
                </Form>
             </div>
        </>
    )
}