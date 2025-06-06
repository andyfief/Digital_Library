/*     SETUP */
// Express
const express = require('express');
const app = express();
const PORT = 45367;

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
        
        const base = "<h1>Rentals Data!</h1>";
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
        
        const base = "<h1>Genres Data</h1>";
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
        
        const base = "<h1>Users Data</h1>";
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
        
        const base = "<h1>Users Data</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(authors));
    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});


// GET all books for dropdown
app.get('/api/books', async (req, res) => {
    try {
        console.log('[API] GET /api/books called');
        const booksQuery = 'SELECT * FROM Books;';
        const [books] = await db.query(booksQuery);
        console.log('[API] Books query result:', books.length, 'books found');
        
        const base = "<h1>Books Data</h1>";
        res.send(base + "<p>Books data:</p>" + JSON.stringify(books)); // FIXED - now says "Books data"
    } catch (error) {
        console.error("[API] Error executing books query:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/api/relationships', async (req, res) => {
    try {
        const relationshipsQuery = 'SELECT * FROM Genres_Has_Books;';
        const [relationships] = await db.query(relationshipsQuery);
        
        const base = "<h1>Relationships Data</h1>";
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
        console.log('[API] POST /api/rentals called with data:', req.body);
        const { user_id, book_id, date, expiration_date } = req.body;
        
        console.log('[API] Calling add_rental stored procedure with:', [user_id, book_id, date, expiration_date]);
        // Call the add_rental stored procedure
        const [result] = await db.query('CALL add_rental(?, ?, ?, ?)', [user_id, book_id, date, expiration_date]);
        console.log('Stored procedure result:', result);

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

// Update rental using stored procedure
app.put('/api/rentals/:id', async (req, res) => {
    try {
        const rentalId = req.params.id;
        const { user_id, book_id, date, expiration_date, date_returned } = req.body;

        console.log('[API] PUT /api/rentals/' + rentalId + ' called with data:', req.body);
        console.log('[API] Calling update_rental stored procedure with:', [rentalId, user_id, book_id, date, expiration_date]);

        // Call the update_rental stored procedure
        const [result] = await db.query('CALL update_rental(?, ?, ?, ?, ?)', [rentalId, user_id, book_id, date, expiration_date]);
        
        console.log('Stored procedure result:', result);

        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Rental updated successfully' });
        }
    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).json({ error: 'Failed to update rental' });
    }
});

// POST new book using stored procedure
app.post('/api/books', async (req, res) => {
    try {
        console.log('[API] POST /api/books called with data:', req.body);
        const { title, author_id, publication_date, description, total_qty } = req.body;
        
        // Call the add_book stored procedure
        const [result] = await db.query('CALL add_book(?, ?, ?, ?, ?)', [title, author_id, publication_date, description, total_qty]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(400).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Book created successfully', book_id: result[0].book_id });
        }
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// Update book using stored procedure
app.put('/api/books/:id', async (req, res) => {

    try {
        const bookId = req.params.id;
        const { title, author_id, publication_date, description, total_qty } = req.body;

        console.log('[API] PUT /api/books/' + bookId + ' called with data:', req.body);
        console.log('[API] Calling update_book stored procedure with:', [bookId, title, author_id, publication_date, description, total_qty]);

        // Call the update_book stored procedure
        const [result] = await db.query('CALL update_book(?, ?, ?, ?, ?, ?)', [bookId, title, author_id, publication_date, description, total_qty]);
        
        console.log('Stored procedure result:', result);

        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Book updated successfully' });
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
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

// POST new author using stored procedure
app.post('/api/authors', async (req, res) => {
    try {
        console.log('[API] POST /api/authors called with data:', req.body);
        const { name, bio } = req.body;
        
        // Call the add_author stored procedure
        const [result] = await db.query('CALL add_author(?, ?)', [name, bio]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(400).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Author created successfully', author_id: result[0].author_id });
        }
    } catch (error) {
        console.error('Error creating author:', error);
        res.status(500).json({ error: 'Failed to create author' });
    }
});

// Update author using stored procedure
app.put('/api/authors/:id', async (req, res) => {
    try {
        const authorId = req.params.id;
        const { name, bio } = req.body;

        console.log('[API] PUT /api/authors/' + authorId + ' called with data:', req.body);
        console.log('[API] Calling update_author stored procedure with:', [authorId, name, bio]);

        // Call the update_author stored procedure
        const [result] = await db.query('CALL update_author(?, ?, ?)', [authorId, name, bio]);
        
        console.log('Stored procedure result:', result);

        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Author updated successfully' });
        }
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({ error: 'Failed to update author' });
    }
});

// DELETE author using stored procedure
app.delete('/api/authors/:id', async (req, res) => {
    try {
        const authorId = req.params.id;
        
        // Call the delete_author stored procedure
        const [result] = await db.query('CALL delete_author(?)', [authorId]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Author deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({ error: 'Failed to delete author' });
    }
});

// POST new relationship using stored procedure
app.post('/api/relationships', async (req, res) => {
    try {
        console.log('[API] POST /api/relationships called with data:', req.body);
        const { genre_id, book_id } = req.body;
        
        // Call the add_relationship stored procedure
        const [result] = await db.query('CALL add_relationship(?, ?)', [genre_id, book_id]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(400).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Relationship created successfully', relationship_id: result[0].relationship_id });
        }
    } catch (error) {
        console.error('Error creating relationship:', error);
        res.status(500).json({ error: 'Failed to create relationship' });
    }
});

// Update relationship using stored procedure
app.put('/api/relationships/:id', async (req, res) => {
    try {
        const relationshipId = req.params.id;
        const { genre_id, book_id } = req.body;

        console.log('[API] PUT /api/relationships/' + relationshipId + ' called with data:', req.body);
        console.log('[API] Calling update_relationship stored procedure with:', [relationshipId, genre_id, book_id]);

        // Call the update_relationship stored procedure
        const [result] = await db.query('CALL update_relationship(?, ?, ?)', [relationshipId, genre_id, book_id]);
        
        console.log('Stored procedure result:', result);

        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Relationship updated successfully' });
        }
    } catch (error) {
        console.error('Error updating relationship:', error);
        res.status(500).json({ error: 'Failed to update relationship' });
    }
});

// DELETE relationship using stored procedure
app.delete('/api/relationships/:id', async (req, res) => {
    try {
        const relationshipId = req.params.id;
        
        // Call the delete_relationship stored procedure
        const [result] = await db.query('CALL delete_relationship(?)', [relationshipId]);
        
        // Check if the procedure returned an error message
        if (result[0] && result[0].error_message) {
            res.status(404).json({ error: result[0].error_message });
        } else {
            res.json({ success: true, message: result[0].message || 'Relationship deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting relationship:', error);
        res.status(500).json({ error: 'Failed to delete relationship' });
    }
});

/*     LISTENER */
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});