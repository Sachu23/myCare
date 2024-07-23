const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Agent = require('../models/Agent')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Patient registration
//Patient Code - p101
router.post('/p101/register', async (req, res) => {
    try {
    const { email, password, name } = req.body;
    console.log("Recieved:", email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Patient({ email, password: hashedPassword, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
        console.log(error);
        if(error.errorResponse.code === 11000){
            res.status(500).json({ error: 'User already exists.' });
        }else{
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});

// Patient registration
// Agent Code - a101
router.post('/a101/register', async (req, res) => {
    try {
    const { email, password, name } = req.body;
    console.log("Recieved:", email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Agent({ email, password: hashedPassword, name });
    //const user = new User({ email, password: hashedPassword, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
        console.log(error);
        if(error.errorResponse.code === 11000){
            res.status(500).json({ error: 'User already exists.' });
        }else{
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});
   
// Patient login
router.post('/p101/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Recieved:", email, password);
        const user = await Patient.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'Sachu@007', {
        expiresIn: '10m',
        });
        const name = user.name;
        userResponse = {token, email, name};
        console.log(userResponse);
        console.log("Logged in User:"+ email);
        res.status(200).json(userResponse);
    } catch (err) {
        console.log(err)
    res.status(500).json({ error: 'Login failed' });
    }
});

// Agent login
router.post('/a101/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Recieved:", email, password);
        const user = await Agent.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'Sachu@007', {
        expiresIn: '10m',
        });
        const name = user.name;
        userResponse = {token, email, name};
        console.log(userResponse);
        console.log("Logged in User:"+ email);
        res.status(200).json(userResponse);
    } catch (err) {
        console.log(err)
    res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;