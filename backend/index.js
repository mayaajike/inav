require('dotenv').config();
const cors = require('cors');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const rapidapiSdk = require('rapidapi-sdk')
app.use(express.json())
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))

async function findUser(username) {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    return user;
}

async function updateUser(username, accessToken, refreshToken) {
    await prisma.user.update({
        where: {
            username: username,
        },
        data: {
            accessToken,
            refreshToken,
        }
    })
}

async function verifyUser(username) {
    await prisma.user.update({
        where: {
            username: username, 
        },
        data: {
            isVerified: true,
            emailToken: null
        }
    })
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const verifyPassword = async (submittedPass, storedHash) => {
    return bcrypt.compare(submittedPass, storedHash);
}

const validatePassword = (password, confirmedPass) => {
    errors = [];
    if (!password) errors.push("Password cannot be empty");
    if (password.length < 8) errors.push("Password must have at least 8 characters");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Password must contain a special character");
    if (!/\d/.test(password)) errors.push("Password must contain a number");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain a capital letter");
    if (password !== confirmedPass) errors.push('Passwords do not match');

    if (errors.length > 0) {
        return { errorCode: 401, errorMessage: "Invalid Password, Try Again"};
    }
    return { errorCode: 200, errorMessage: "Password is Valid"};
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
}

async function generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function authenticateToken (req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) return res.status(401).json({ error: "Invalid User" });
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid token" });
            const existingUser = findUser(JSON.stringify(user));
            if (existingUser) {
                req.user = user;
                next();
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

async function verifyEmail(req, res) {
    const { emailToken } = req.body;
    if (!emailToken) return res.status(400).json({ mesaage: "Email token not found!" });

    try {
        jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid email token" });
            const existingUser = await findUser(JSON.stringify(user));
            if (existingUser) {
                await verifyUser(existingUser)
                return res.status(200).json({ message: "Email verified successfully!" });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server error" });
    }
}


async function findOpportunity(oppId) {
    const opportunity = await prisma.opportunity.findFirst({
        where: {
            id: oppId,
        },
    });
    return opportunity;
}

app.get('/', authenticateToken, async (req, res) => {
    res.json(req.user);
})

app.post('/signup', async (req, res) => {
    const { firstName, lastName, username, email, password, passwordAgain } = req.body
    try {
        const existingUser = await findUser(username)
        if (existingUser){
            return res.status(200).json({ error: "User already exists!" })
        } else {
            const isValid = validatePassword(password, passwordAgain);
            if (isValid.errorCode === 401) {
                return res.status(401).json({ error: isValid.errorMessage });
            }
        }
        const hashedPassword = await hashPassword(password);
        const user = { username: username };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        const emailToken = jwt.sign(user, process.env.EMAIL_TOKEN_SECRET, { expiresIn: "1d"} );
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                accessToken,
                refreshToken,
                emailToken,
            },
        })

        const transporter = nodemailer.createTransport({
            host: "smtp.etheral.email",
            port: 587,
            secure: false,
            auth: {
                user: "janet.kautzer@ethereal.email",
                pass: "8VXrZj egXBdGRubbbK",
            }
        });

        let message = {
            from: '"iNav Student Services" <janet.kautzer@ethereal.email>',
            to: email,
            subject: "Welcome to iNav!",
            text: "We're happy you've joined! Please click this link to verify your email.",
            html: "<b>We're happy you've joined! Please click this link to verify your email.</b>",
        }

        transporter.sendMail(message).then(() => {
            return res.status(201).json({ message: "You should receive an email" })
        }).catch(error => {
            return res.status(500).json({ error: "Invalid email" })
        })
        return res.status(200).json({ user: newUser })        
    } catch {
        return res.status(500).json({ error: "Server error" })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await findUser(username);
        if (!existingUser) {
            return res.status(401).json({ error: 'Invalid username or password' });
        } else {
            const isValidPassword = await verifyPassword(password, existingUser.password);
            if (!isValidPassword) return res.status(401).json({ error: "Invalid Password" });
            
            const user = { username: username };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            await updateUser(username, accessToken, refreshToken)
            existingUser.accessToken = accessToken
            existingUser.refreshToken = refreshToken
            return res.status(200).json({
                message: "Login Successful!",
                user: existingUser
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})

const intUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
const scholUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&start=30&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
const fellUrl = 'https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs?keywords=intern&locationId=103644278&datePosted=anyTime&jobType=internship%2C%20partTime&experienceLevel=internship%2C%20entryLevel&start=60&onsiteRemote=onSite%2C%20remote%2C%20hybrid&sort=mostRelevant';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '21ed57571fmshfdb96a8f0e8abccp1a9dabjsnd57057928769',
        'x-rapidapi-host': 'rapid-linkedin-jobs-api.p.rapidapi.com'
    }
};

async function fetchData(url) {
    try {
        const response = await fetch(url, options);
        const result = await response.json();

        result.data.forEach(async (item) => {
            const opportunity = {
                id: item.id,
                title: item.title,
                companyName: item.company.name,
                companyLogo: item.company.logo,
                jobPosting: item.url,
                jobType: item.type,
                location: item.location,
            }

            await prisma.opportunity.create({
                data: opportunity,
            });
        });
        
    } catch (error) {
        console.error(error);
    }
}

app.get('/save-data', async (req, res) => {
    try {
        await fetchData(intUrl);
        await fetchData(scholUrl);
        await fetchData(fellUrl);
        const allOpportunities = await prisma.opportunity.findMany();
        res.status(200).json(allOpportunities);
    } catch (error) {
        res.status(500).json({ error: "API error." });
    }
    
})

app.get('/opportunities', async (req, res) => {
    try{
        const opportunities = await prisma.opportunity.findMany();
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all opportunities." });
    }
})

// get all saved opportunities
app.get('/saved-opportunities', async (req, res) => {
    const { username } = req.query;
    try {
        const existingUser = await findUser(username);
        if (!existingUser) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const savedOpps = await prisma.savedOpportunity.findMany({
            where: {
                userId: existingUser.id,
            }
        });

        res.status(200).json(savedOpps);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user's saved opportunities." });
    }
})

//check if an opportunity is saved 
app.get('/saved-opportunity', async (req, res) => {
    const { oppId, username } = req.query;
    try {
        const existingUser = await findUser(username);
        if (!existingUser) {
            return res.status(404).json({error: "User does not exist"});
        }
        const opportunity = await findOpportunity(oppId);
        if (!opportunity) {
            return res.status(404).json({error: "Opportunity does not exist"});
        }
        const saved = await prisma.savedOpportunity.findFirst({
            where: {
                oppId: opportunity.id
            }
        });
        if (!saved) {
            return res.status(404).json({ error: "Opportunity has not been saved." });
        }

        return res.status(200).json({
            message: "Opportunity has been saved.",
            saved: saved,
        })
    } catch(error) {
        return
    }
})

// save an opportunity
app.post('/save-opportunity', async (req, res) => {
    const { oppId, username } = req.body;
    try {
        const existingUser = await findUser(username);
        if (!existingUser) {
            return res.status(404).json({error: "User does not exist"});
        }
        const opportunity = await findOpportunity(oppId);
        if (!opportunity) {
            return res.status(404).json({error: "Opportunity does not exist"});
        }

        const saved = await prisma.savedOpportunity.create({
            data: {
                userId: existingUser.id,
                oppId: opportunity.id,
            },
        });

        return res.status(200).json({
            message: "Opportunity saved successfully",
            saved: saved,
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})

// unsave an opportunity
app.post('/unsave-opportunity', async (req, res) => {
    const { oppId, username } = req.body;
    try {
        const existingUser = await findUser(username);
        if (!existingUser) {
            return res.status(404).json({ error: "User does not exist." });
        }
        const opportunity = await findOpportunity(oppId);
        if (!opportunity) {
            return res.status(404).json({ error: "Opportunity does not exist." });
        }
        const savedOpportunity = await prisma.savedOpportunity.findFirst({
            where: {
                userId: existingUser.id,
                oppId: opportunity.id
            }
        });
        if (!savedOpportunity) {
            return res.status(404).json({ error: "Opportunity has not been saved." });
        }
        const unsaved = await prisma.savedOpportunity.delete({
            where: {
                id: savedOpportunity.id
            }
        });

        return res.status(200).json({
            message: "Opportunity unsaved successfully",
            unsaved: unsaved,
        })
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})