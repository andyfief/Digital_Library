/*     SETUP */

// Citation for Setup Section:
// This setup section is based off of Activity 2 from CS340, which was provided course material.
// The Express server setup, database connection, and middleware configuration follow the patterns from that activity.
// Activity 2 provided the foundational structure for Express.js server setup and database integration.
// CS340 Course Materials - Activity 2
// Date: 05/2025

// Express framework setup for web server functionality
const express = require('express');
const app = express();
const PORT = 45389; // port number for the server to listen on

// Database connection module for MySQL database operations
const db = require('./db-connector');

// Middleware to parse JSON request bodies from client requests
app.use(express.json());

// Serve static files (HTML, CSS, JS files) from the 'public' folder
app.use(express.static('public')); // Put your HTML files in a 'public' folder

/*     ROUTES */

// Citation for Main Page Route:
// This route is based off of Activity 2 from CS340, which was provided course material.
// The basic route structure and database query pattern follow the activity template.
// However, AI debugging statements were added to help troubleshoot database connection issues.
// CS340 Course Materials - Activity 2
// Date: 05/2025
// Main page route - shows database reset confirmation with sample data
app.get('/', async function (req, res) {
    try {
        // execute query to get rentals data for confirmation display
        const rentalsQuery = 'SELECT * FROM Rentals;';
        const [rentals] = await db.query(rentalsQuery);
        
        // create basic HTML response with database confirmation
        const base = "<h1>Database Reset Complete!</h1>";
        res.send(base + "<p>Rentals data:</p>" + JSON.stringify(rentals));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// API Routes for Rentals

// Citation for GET Rentals Route:
// This route is all my own work.
// This route retrieves all rental records from the database and returns them in HTML format with embedded JSON.
// GET all rentals with user and book details
app.get('/api/rentals', async (req, res) => {
    try {
        // execute query to retrieve all rental records
        const rentalsQuery = 'SELECT * FROM Rentals;';
        const [rentals] = await db.query(rentalsQuery);
        
        // create HTML response with rentals data embedded as JSON
        const base = "<h1>Rentals Data!</h1>";
        res.send(base + "<p>Rentals data:</p>" + JSON.stringify(rentals));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for GET Genres Route:
// This route is directly based off of the GET rentals route, which is all my own work.
// AI was used to transform the rentals route into the genres route.
// Prompt: Take this GET rentals route and modify it to fit my genres API. [Paste in GET rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it retrieves genre data instead of rental data.
// GET all genres ordered by ID
app.get('/api/genres', async (req, res) => {
    try {
        // execute query to retrieve all genre records ordered by genre_id
        const genresQuery = 'SELECT * FROM Genres ORDER BY genre_id;';
        const [genres] = await db.query(genresQuery);
        
        // create HTML response with genres data embedded as JSON
        const base = "<h1>Genres Data</h1>";
        res.send(base + "<p>Genres data:</p>" + JSON.stringify(genres));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for GET Users Route:
// This route is directly based off of the GET rentals route, which is all my own work.
// AI was used to transform the rentals route into the users route.
// Prompt: Take this GET rentals route and modify it to fit my users API. [Paste in GET rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it retrieves user data instead of rental data.
// GET all users from the database
app.get('/api/users', async (req, res) => {
    try {
        // execute query to retrieve all user records
        const usersQuery = 'SELECT * FROM Users;';
        const [users] = await db.query(usersQuery);
        
        // create HTML response with users data embedded as JSON
        const base = "<h1>Users Data</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(users));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for GET Authors Route:
// This route is directly based off of the GET rentals route, which is all my own work.
// AI was used to transform the rentals route into the authors route.
// Prompt: Take this GET rentals route and modify it to fit my authors API. [Paste in GET rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it retrieves author data instead of rental data.
// GET all authors from the database
app.get('/api/authors', async (req, res) => {
    try {
        // execute query to retrieve all author records
        const authorsQuery = 'SELECT * FROM Authors;';
        const [authors] = await db.query(authorsQuery);
        
        // create HTML response with authors data embedded as JSON
        const base = "<h1>Users Data</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(authors));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for GET Books Route:
// This route is directly based off of the GET rentals route, which is all my own work.
// AI was used to transform the rentals route into the books route.
// Prompt: Take this GET rentals route and modify it to fit my books API. [Paste in GET rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// This route differs in the sense that it retrieves book data instead of rental data.
// GET all books for dropdown and table display
app.get('/api/books', async (req, res) => {
    try {
        // log the API call for debugging purposes
        console.log('[API] GET /api/books called');
        
        // execute query to retrieve all book records
        const booksQuery = 'SELECT * FROM Books;';
        const [books] = await db.query(booksQuery);
        
        // log the query results for debugging
        console.log('[API] Books query result:', books.length, 'books found');
        
        // create HTML response with books data embedded as JSON
        const base = "<h1>Books Data</h1>";
        res.send(base + "<p>Books data:</p>" + JSON.stringify(books)); // FIXED - now says "Books data"
    } catch (error) {
        // handle database connection or query errors with enhanced logging
        console.error("[API] Error executing books query:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for GET Relationships Route:
// This route is directly based off of the GET rentals route, which is all my own work.
// AI was used to transform the rentals route into the relationships route.
// Prompt: Take this GET rentals route and modify it to fit my book-genre relationships API. [Paste in GET rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it retrieves relationship data instead of rental data.
// GET all book-genre relationships from the junction table
app.get('/api/relationships', async (req, res) => {
    try {
        // execute query to retrieve all book-genre relationship records
        const relationshipsQuery = 'SELECT * FROM Genres_Has_Books;';
        const [relationships] = await db.query(relationshipsQuery);
        
        // create HTML response with relationships data embedded as JSON
        const base = "<h1>Relationships Data</h1>";
        res.send(base + "<p>Users data:</p>" + JSON.stringify(relationships));
    } catch (error) {
        // handle database connection or query errors
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// Citation for DELETE Rental Route:
// This route is all my own work.
// This route deletes a rental record using a stored procedure for proper data validation.
// DELETE rental using stored procedure
app.delete('/api/rentals/:id', async (req, res) => {
    try {
        // extract rental ID from URL parameters
        const rentalId = req.params.id;
        
        // call the delete_rental stored procedure with the rental ID
        const [result] = await db.query('CALL delete_rental(?)', [rentalId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if procedure indicates failure
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with message from procedure
            res.json({ success: true, message: result[0].message || 'Rental deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting rental:', error);
        res.status(500).json({ error: 'Failed to delete rental' });
    }
});

// Citation for POST Rental Route:
// This route is all my own work.
// AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route creates a new rental record using a stored procedure for data validation.
// POST new rental using stored procedure
app.post('/api/rentals', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/rentals called with data:', req.body);
        
        // extract rental data from request body
        const { user_id, book_id, date, expiration_date } = req.body;
        
        // log the stored procedure call parameters for debugging
        console.log('[API] Calling add_rental stored procedure with:', [user_id, book_id, date, expiration_date]);
        
        // call the add_rental stored procedure with the extracted parameters
        const [result] = await db.query('CALL add_rental(?, ?, ?, ?)', [user_id, book_id, date, expiration_date]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response with specific error from procedure
            res.status(400).json({ error: result[0].error_message });
        } else {
            // return success response with message and generated rental ID
            res.json({ success: true, message: result[0].message || 'Rental created successfully', rental_id: result[0].rental_id });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error creating rental:', error);
        res.status(500).json({ error: 'Failed to create rental' });
    }
});

// Citation for PUT Rental Route:
// This route is all my own work.
// AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route updates an existing rental record using a stored procedure.
// Update rental using stored procedure
app.put('/api/rentals/:id', async (req, res) => {
    try {
        // extract rental ID from URL parameters
        const rentalId = req.params.id;
        
        // extract updated rental data from request body
        const { user_id, book_id, date, expiration_date, date_returned } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/rentals/' + rentalId + ' called with data:', req.body);
        console.log('[API] Calling update_rental stored procedure with:', [rentalId, user_id, book_id, date, expiration_date]);

        // call the update_rental stored procedure with the parameters
        const [result] = await db.query('CALL update_rental(?, ?, ?, ?, ?)', [rentalId, user_id, book_id, date, expiration_date]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if rental not found or other issues
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Rental updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating rental:', error);
        res.status(500).json({ error: 'Failed to update rental' });
    }
});

// Citation for POST Books Route:
// This route is directly based off of the POST rentals route, which is all my own work.
// AI was used to transform the rentals route into the books route.
// Prompt: Take this POST rentals route and modify it to fit my books API. [Paste in POST rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot complex stored procedure results.
// Prompt: Add extensive debugging to help me understand the stored procedure result structure
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it creates a book instead of a rental, with more complex result handling.
// POST new book using stored procedure
app.post('/api/books', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/books called with data:', req.body);
        
        // extract book data from request body
        const { title, author_id, publication_date, description, total_qty } = req.body;
        
        // call the add_book stored procedure with book parameters
        const [result] = await db.query('CALL add_book(?, ?, ?, ?, ?)', 
            [title, author_id, publication_date, description, total_qty]);
        
        // extensive debugging to understand stored procedure result structure
        console.log('[API] Stored procedure result structure:');
        console.log('- result:', result);
        console.log('- result[0]:', result[0]);
        console.log('- result[0][0]:', result[0][0]); // This should show the actual object
        
        // extract the procedure result from the nested result structure
        const procedureResult = result[0][0];          
        console.log('[API] Procedure result data:', procedureResult);
        console.log('[API] Available keys:', Object.keys(procedureResult));
        
        // check if the stored procedure returned an error message
        if (procedureResult && procedureResult.error_message) {
            console.log('[API] Procedure returned error:', procedureResult.error_message);
            res.status(400).json({ error: procedureResult.error_message });
        } else {
            // extract the book_id and message from the procedure result
            const bookId = procedureResult.book_id;
            const message = procedureResult.message;
            
            // log the extracted values for debugging
            console.log('[API] Extracted book ID:', bookId);
            console.log('[API] Extracted message:', message);
            
            // return success response with book ID for relationship creation
            res.json({ 
                success: true, 
                message: message || 'Book created successfully', 
                book_id: bookId
            });
        }
    } catch (error) {
        // handle database connection or procedure execution errors with detailed logging
        console.error('[API] Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book', details: error.message });
    }
});

// Citation for PUT Books Route:
// This route is directly based off of the PUT rentals route, which is all my own work.
// AI was used to transform the rentals route into the books route.
// Prompt: Take this PUT rentals route and modify it to fit my books API. [Paste in PUT rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it updates a book instead of a rental.
// Update book using stored procedure
app.put('/api/books/:id', async (req, res) => {
    try {
        // extract book ID from URL parameters
        const bookId = req.params.id;
        
        // extract updated book data from request body
        const { title, author_id, publication_date, description, total_qty } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/books/' + bookId + ' called with data:', req.body);
        console.log('[API] Calling update_book stored procedure with:', [bookId, title, author_id, publication_date, description, total_qty]);

        // call the update_book stored procedure with all book parameters
        const [result] = await db.query('CALL update_book(?, ?, ?, ?, ?, ?)', [bookId, title, author_id, publication_date, description, total_qty]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if book not found or validation fails
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Book updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Citation for DELETE Books Route:
// This route is directly based off of the DELETE rentals route, which is all my own work.
// AI was used to transform the rentals route into the books route.
// Prompt: Take this DELETE rentals route and modify it to fit my books API. [Paste in DELETE rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it deletes a book instead of a rental.
// DELETE book using stored procedure
app.delete('/api/books/:id', async (req, res) => {
    try {
        // extract book ID from URL parameters
        const bookId = req.params.id;
        
        // call the delete_book stored procedure with the book ID
        const [result] = await db.query('CALL delete_book(?)', [bookId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if book not found or has dependencies
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Book deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Citation for POST Reset Route:
// This route is all my own work.
// This route calls the database reset stored procedure to restore sample data.
// Reset database endpoint
app.post('/api/reset', async (req, res) => {
    try {
        // call the reset_database stored procedure to restore sample data
        await db.query('CALL reset_database();');
        
        // return success response confirming database reset
        res.json({ success: true, message: 'Database reset successfully' });
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error resetting database:', error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

// Citation for POST Authors Route:
// This route is directly based off of the POST rentals route, which is all my own work.
// AI was used to transform the rentals route into the authors route.
// Prompt: Take this POST rentals route and modify it to fit my authors API. [Paste in POST rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it creates an author instead of a rental.
// POST new author using stored procedure
app.post('/api/authors', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/authors called with data:', req.body);
        
        // extract author data from request body
        const { name, bio } = req.body;
        
        // call the add_author stored procedure with author parameters
        const [result] = await db.query('CALL add_author(?, ?)', [name, bio]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if validation fails
            res.status(400).json({ error: result[0].error_message });
        } else {
            // return success response with author ID and confirmation message
            res.json({ success: true, message: result[0].message || 'Author created successfully', author_id: result[0].author_id });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error creating author:', error);
        res.status(500).json({ error: 'Failed to create author' });
    }
});

// Citation for PUT Authors Route:
// This route is directly based off of the PUT rentals route, which is all my own work.
// AI was used to transform the rentals route into the authors route.
// Prompt: Take this PUT rentals route and modify it to fit my authors API. [Paste in PUT rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it updates an author instead of a rental.
// Update author using stored procedure
app.put('/api/authors/:id', async (req, res) => {
    try {
        // extract author ID from URL parameters
        const authorId = req.params.id;
        
        // extract updated author data from request body
        const { name, bio } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/authors/' + authorId + ' called with data:', req.body);
        console.log('[API] Calling update_author stored procedure with:', [authorId, name, bio]);

        // call the update_author stored procedure with author parameters
        const [result] = await db.query('CALL update_author(?, ?, ?)', [authorId, name, bio]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if author not found or validation fails
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Author updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating author:', error);
        res.status(500).json({ error: 'Failed to update author' });
    }
});

// Citation for DELETE Authors Route:
// This route is directly based off of the DELETE rentals route, which is all my own work.
// AI was used to transform the rentals route into the authors route.
// Prompt: Take this DELETE rentals route and modify it to fit my authors API. [Paste in DELETE rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it deletes an author instead of a rental.
// DELETE author using stored procedure
app.delete('/api/authors/:id', async (req, res) => {
    try {
        // extract author ID from URL parameters
        const authorId = req.params.id;
        
        // call the delete_author stored procedure with the author ID
        const [result] = await db.query('CALL delete_author(?)', [authorId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if author not found or has dependencies
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Author deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting author:', error);
        res.status(500).json({ error: 'Failed to delete author' });
    }
});

// Citation for POST Relationships Route:
// This route is directly based off of the POST rentals route, which is all my own work.
// AI was used to transform the rentals route into the relationships route.
// Prompt: Take this POST rentals route and modify it to fit my book-genre relationships API. [Paste in POST rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it creates a book-genre relationship instead of a rental.
// POST new relationship using stored procedure
app.post('/api/relationships', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/relationships called with data:', req.body);
        
        // extract relationship data from request body
        const { genre_id, book_id } = req.body;
        
        // call the add_relationship stored procedure with relationship parameters
        const [result] = await db.query('CALL add_relationship(?, ?)', [genre_id, book_id]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if validation fails or relationship already exists
            res.status(400).json({ error: result[0].error_message });
        } else {
            // return success response with relationship ID and confirmation message
            res.json({ success: true, message: result[0].message || 'Relationship created successfully', relationship_id: result[0].relationship_id });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error creating relationship:', error);
        res.status(500).json({ error: 'Failed to create relationship' });
    }
});

// Citation for PUT Relationships Route:
// This route is directly based off of the PUT rentals route, which is all my own work.
// AI was used to transform the rentals route into the relationships route.
// Prompt: Take this PUT rentals route and modify it to fit my book-genre relationships API. [Paste in PUT rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it updates a book-genre relationship instead of a rental.
// Update relationship using stored procedure
app.put('/api/relationships/:id', async (req, res) => {
    try {
        // extract relationship ID from URL parameters
        const relationshipId = req.params.id;
        
        // extract updated relationship data from request body
        const { genre_id, book_id } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/relationships/' + relationshipId + ' called with data:', req.body);
        console.log('[API] Calling update_relationship stored procedure with:', [relationshipId, genre_id, book_id]);

        // call the update_relationship stored procedure with relationship parameters
        const [result] = await db.query('CALL update_relationship(?, ?, ?)', [relationshipId, genre_id, book_id]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if relationship not found or validation fails
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Relationship updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating relationship:', error);
        res.status(500).json({ error: 'Failed to update relationship' });
    }
});

// Citation for DELETE Relationships Route:
// This route is directly based off of the DELETE rentals route, which is all my own work.
// AI was used to transform the rentals route into the relationships route.
// Prompt: Take this DELETE rentals route and modify it to fit my book-genre relationships API. [Paste in DELETE rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it deletes a book-genre relationship instead of a rental.
// DELETE relationship using stored procedure
app.delete('/api/relationships/:id', async (req, res) => {
    try {
        // extract relationship ID from URL parameters
        const relationshipId = req.params.id;
        
        // call the delete_relationship stored procedure with the relationship ID
        const [result] = await db.query('CALL delete_relationship(?)', [relationshipId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if relationship not found
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Relationship deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting relationship:', error);
        res.status(500).json({ error: 'Failed to delete relationship' });
    }
});

// Citation for POST Users Route:
// This route is directly based off of the POST rentals route, which is all my own work.
// AI was used to transform the rentals route into the users route.
// Prompt: Take this POST rentals route and modify it to fit my users API. [Paste in POST rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it creates a user instead of a rental.
// POST new user using stored procedure
app.post('/api/users', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/users called with data:', req.body);
        
        // extract user data from request body
        const { username, password, email } = req.body;
        
        // call the add_user stored procedure with user parameters
        const [result] = await db.query('CALL add_user(?, ?, ?)', [username, password, email]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if validation fails or username already exists
            res.status(400).json({ error: result[0].error_message });
        } else {
            // return success response with user ID and confirmation message
            res.json({ 
                success: true, 
                message: result[0].message || 'User created successfully', 
                user_id: result[0].user_id 
            });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Citation for PUT Users Route:
// This route is directly based off of the PUT rentals route, which is all my own work.
// AI was used to transform the rentals route into the users route.
// Prompt: Take this PUT rentals route and modify it to fit my users API. [Paste in PUT rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it updates a user instead of a rental.
// Update user using stored procedure
app.put('/api/users/:id', async (req, res) => {
    try {
        // extract user ID from URL parameters
        const userId = req.params.id;
        
        // extract updated user data from request body
        const { username, password, email } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/users/' + userId + ' called with data:', req.body);
        console.log('[API] Calling update_user stored procedure with:', [userId, username, password, email]);

        // call the update_user stored procedure with user parameters
        const [result] = await db.query('CALL update_user(?, ?, ?, ?)', [userId, username, password, email]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if user not found or validation fails
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'User updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Citation for DELETE Users Route:
// This route is directly based off of the DELETE rentals route, which is all my own work.
// AI was used to transform the rentals route into the users route.
// Prompt: Take this DELETE rentals route and modify it to fit my users API. [Paste in DELETE rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it deletes a user instead of a rental.
// DELETE user using stored procedure
app.delete('/api/users/:id', async (req, res) => {
    try {
        // extract user ID from URL parameters
        const userId = req.params.id;
        
        // call the delete_user stored procedure with the user ID
        const [result] = await db.query('CALL delete_user(?)', [userId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if user not found or has dependencies
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'User deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Citation for Debug Connection Route:
// This route was entirely generated by Claude AI to help debug database connection issues.
// Prompt: Create a debug route to help me troubleshoot my database connection and see table record counts
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route provides detailed database connection and data information for debugging purposes.
// CLAUDE AI Added routes to debug database connection issues
app.get('/api/debug/connection', async (req, res) => {
    try {
        // log the debug request for tracking
        console.log('[DEBUG] Checking database connection...');
        
        // check current database and connection information
        const [dbInfo] = await db.query(`
            SELECT 
                DATABASE() as current_db,
                CONNECTION_ID() as connection_id,
                USER() as user_info,
                @@autocommit as autocommit_status,
                @@session.autocommit as session_autocommit
        `);
        
        // count records in each table to verify data integrity
        const [counts] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM Books) as books_count,
                (SELECT COUNT(*) FROM Genres_Has_Books) as relationships_count,
                (SELECT COUNT(*) FROM Authors) as authors_count,
                (SELECT COUNT(*) FROM Genres) as genres_count
        `);
        
        // get recent data samples to verify database functionality
        const [recentBooks] = await db.query('SELECT * FROM Books ORDER BY book_id DESC LIMIT 3');
        const [recentRelationships] = await db.query('SELECT * FROM Genres_Has_Books ORDER BY relationship_id DESC LIMIT 5');
        
        // return comprehensive debugging information as JSON
        res.json({
            database_info: dbInfo[0],
            record_counts: counts[0],
            recent_data: {
                books: recentBooks,
                relationships: recentRelationships
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // handle any errors in the debugging process
        console.error('[DEBUG] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Citation for POST Genres Route:
// This route is directly based off of the POST rentals route, which is all my own work.
// AI was used to transform the rentals route into the genres route.
// Prompt: Take this POST rentals route and modify it to fit my genres API. [Paste in POST rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it creates a genre instead of a rental.
// POST new genre using stored procedure
app.post('/api/genres', async (req, res) => {
    try {
        // log the API call and request data for debugging purposes
        console.log('[API] POST /api/genres called with data:', req.body);
        
        // extract genre data from request body
        const { title } = req.body;
        
        // call the add_genre stored procedure with genre parameters
        const [result] = await db.query('CALL add_genre(?)', [title]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if validation fails or genre already exists
            res.status(400).json({ error: result[0].error_message });
        } else {
            // return success response with genre ID and confirmation message
            res.json({ 
                success: true, 
                message: result[0].message || 'Genre created successfully', 
                genre_id: result[0].genre_id 
            });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error creating genre:', error);
        res.status(500).json({ error: 'Failed to create genre' });
    }
});

// Citation for PUT Genres Route:
// This route is directly based off of the PUT rentals route, which is all my own work.
// AI was used to transform the rentals route into the genres route.
// Prompt: Take this PUT rentals route and modify it to fit my genres API. [Paste in PUT rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// Additional AI debugging statements were added to help troubleshoot API issues.
// Prompt: Add debugging console.log statements to help me troubleshoot this API route
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it updates a genre instead of a rental.
// Update genre using stored procedure
app.put('/api/genres/:id', async (req, res) => {
    try {
        // extract genre ID from URL parameters
        const genreId = req.params.id;
        
        // extract updated genre data from request body
        const { title } = req.body;

        // log the API call and request data for debugging purposes
        console.log('[API] PUT /api/genres/' + genreId + ' called with data:', req.body);
        console.log('[API] Calling update_genre stored procedure with:', [genreId, title]);

        // call the update_genre stored procedure with genre parameters
        const [result] = await db.query('CALL update_genre(?, ?)', [genreId, title]);
        
        // log the stored procedure result for debugging
        console.log('Stored procedure result:', result);

        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if genre not found or validation fails
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Genre updated successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error updating genre:', error);
        res.status(500).json({ error: 'Failed to update genre' });
    }
});

// Citation for DELETE Genres Route:
// This route is directly based off of the DELETE rentals route, which is all my own work.
// AI was used to transform the rentals route into the genres route.
// Prompt: Take this DELETE rentals route and modify it to fit my genres API. [Paste in DELETE rentals route]
// Date: 05/2025
// AI Source URL: https://claude.ai
// This route differs in the sense that it deletes a genre instead of a rental.
// DELETE genre using stored procedure
app.delete('/api/genres/:id', async (req, res) => {
    try {
        // extract genre ID from URL parameters
        const genreId = req.params.id;
        
        // call the delete_genre stored procedure with the genre ID
        const [result] = await db.query('CALL delete_genre(?)', [genreId]);
        
        // check if the stored procedure returned an error message
        if (result[0] && result[0].error_message) {
            // return error response if genre not found or has dependencies
            res.status(404).json({ error: result[0].error_message });
        } else {
            // return success response with confirmation message
            res.json({ success: true, message: result[0].message || 'Genre deleted successfully' });
        }
    } catch (error) {
        // handle database connection or procedure execution errors
        console.error('Error deleting genre:', error);
        res.status(500).json({ error: 'Failed to delete genre' });
    }
});

/*     LISTENER */

// Citation for Server Listener:
// This server listener setup is based off of Activity 2 from CS340, which was provided course material.
// The basic Express server startup pattern follows the activity template.
// CS340 Course Materials - Activity 2
// Date: 05/2025
// Start the Express server and listen for incoming requests on the specified port
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});