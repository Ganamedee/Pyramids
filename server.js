// 1. First, update the server.js file to support ES modules in production
// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Add Cache-Control headers for better performance
app.use((req, res, next) => {
    if (req.url.match(/\.(js|css|jpg|png|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route to handle direct navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server if not on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser`);
    });
}

// Export the app for Vercel
module.exports = app;