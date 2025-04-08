const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// CORS 설정
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api', (req, res) => {
    res.send('📦 Hello from Backend!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});