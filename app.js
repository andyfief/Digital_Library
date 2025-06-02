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

app.get('/api/genres', async (req, res) => {
    try {
        const genresQuery = 'SELECT * FROM Genres ORDER BY genre_id;';
        const [genres] = await db.query(genresQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Genres data:</p>" + JSON.stringify(genres));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const usersQuery = 'SELECT * FROM Users;';
        const [users] = await db.query(usersQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(users));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/api/authors', async (req, res) => {
    try {
        const authorsQuery = 'SELECT * FROM Authors;';
        const [authors] = await db.query(authorsQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(authors));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});


// GET all books for dropdown
app.get('/api/books', async (req, res) => {
    try {
        const booksQuery = 'SELECT * FROM Books;';
        const [books] = await db.query(booksQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(books));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/api/relationships', async (req, res) => {
    try {
        const relationshipsQuery = 'SELECT * FROM Genres_Has_Books;';
        const [relationships] = await db.query(relationshipsQuery);
        
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(relationships));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// DELETE rental using stored procedure
app.delete('/api/rentals/:id', async (req, res) => {
    try {
        const rentalId = req.params.id;
        
        // Call the delete_rental stored procedure
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

// POST new rental using stored procedure
app.post('/api/rentals', async (req, res) => {
    try {
        const { user_id, book_id, date, expiration_date } = req.body;
        
        // Call the add_rental stored procedure
        const [result] = await db.query('CALL add_rental(?, ?, ?, ?)', [user_id, book_id, date, expiration_date]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(400).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Rental created successfully', rental_id: result[0].rental_id });
        }
    } catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({ error: 'Failed to create rental' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Call the delete_rental stored procedure
        const [result] = await db.query('CALL delete_book(?)', [bookId]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Book deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Reset database endpoint
app.post('/api/reset', async (req, res) => {
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