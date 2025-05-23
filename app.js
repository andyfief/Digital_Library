/*     SETUP */
// Express
const express = require('express');
const app = express();
const PORT = 45393;

// Database 
const db = require('./db-connector');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (your HTML, CSS, JS files)
app.use(express.static('public')); // Put your HTML files in a 'public' folder

/*     ROUTES */

// Main page route - shows database reset confirmation
app.get('/', async function (req, res) {
    try {
        await db.query('CALL reset_database();');
        const rentalsQuery = 'SELECT * FROM Rentals;';
        const [rentals] = await db.query(rentalsQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Rentals data:</p>" + JSON.stringify(rentals));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// API Routes for Rentals

// GET all rentals with user and book details
app.get('/api/rentals', async (req, res) => {
    try {

        const rentalsQuery = 'SELECT * FROM Rentals;';
        const [rentals] = await db.query(rentalsQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Rentals data:</p>" + JSON.stringify(rentals));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

async function resetDatabase() {
    try {
        await db.query('CALL reset_database();');
        console.log('Database reset successfully');
        return { success: true, message: 'Database reset successfully' };
    } catch (error) {
        console.error('Error resetting database:', error);
        throw error;
    }
}

// GET all users for dropdown
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT user_id, username FROM Users ORDER BY username');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET all books for dropdown
app.get('/api/books', async (req, res) => {
    try {
        const [books] = await db.query('SELECT book_id, title FROM Books ORDER BY title');
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});


// DELETE rental using your stored procedure
app.delete('/api/rentals/:id', async (req, res) => {
    try {
        const rentalId = req.params.id;
        
        // Call your delete_rental stored procedure
        const [result] = await db.query('CALL delete_rental(?)', [rentalId]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Rental deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting rental:', error);
        res.status(500).json({ error: 'Failed to delete rental' });
    }
});


// Reset database endpoint
app.post('/api/reset-database', async (req, res) => {
    try {
        await db.query('CALL reset_database();');
        res.json({ success: true, message: 'Database reset successfully' });
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

/*     LISTENER */
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});