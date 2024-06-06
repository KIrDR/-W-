const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3000;

const users = JSON.parse(fs.readFileSync('users.json'));


const secretKey = 'secret';

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    console.log(username, password)
    if (user) {
        const accessToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '10m' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json(err.message);
        }
        req.user = user;
        next();
    });
}
