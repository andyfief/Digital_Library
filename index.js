// Citation for Index.js:
// IndexJs is all my own work.

// Express library used to create a web server that will serve the HTML files
const express = require('express');
const path = require('path');

// Instantiate an express object to interact with the server
const app = express();

// Set a port in the range: 1024 < PORT < 65535
const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Tell express what port to listen on 
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});