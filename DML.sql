-- Data Manipulation Queries for Library Management System
-- Using @ symbol to denote variables that will have data from the backend

-- BOOKS QUERIES

-- Get all books with author name
SELECT b.*, a.name as author_name 
FROM Books b
JOIN Authors a ON b.author_id = a.author_id;

-- Get a single book by ID with author name and genres
SELECT b.*, a.name as author_name 
FROM Books b
JOIN Authors a ON b.author_id = a.author_id
WHERE b.book_id = @bookId;

-- Get genres for a specific book
SELECT g.* 
FROM Genres g
JOIN Genres_Has_Books ghb ON g.genre_id = ghb.genre_id
WHERE ghb.book_id = @bookId;

-- Create a new book
INSERT INTO Books (title, author_id, publication_date, description, total_qty) 
VALUES (@title, @authorId, @publicationDate, @description, @totalQty);

-- Add genres to a book (many-to-many relationship)
INSERT INTO Genres_Has_Books (genre_id, book_id) 
VALUES (@genreId, @bookId);

-- Update a book
UPDATE Books 
SET title = @title, author_id = @authorId, publication_date = @publicationDate,
    description = @description, total_qty = @totalQty 
WHERE book_id = @bookId;

-- Delete book's genre relationships
DELETE FROM Genres_Has_Books 
WHERE book_id = @bookId;

-- Delete a book
DELETE FROM Books 
WHERE book_id = @bookId;

-- AUTHORS QUERIES

-- Get all authors
SELECT * FROM Authors;

-- Get a single author by ID
SELECT * FROM Authors 
WHERE author_id = @authorId;

-- Create a new author
INSERT INTO Authors (name, bio) 
VALUES (@name, @bio);

-- Update an author
UPDATE Authors 
SET name = @name, bio = @bio 
WHERE author_id = @authorId;

-- Delete an author
DELETE FROM Authors 
WHERE author_id = @authorId;

-- GENRES QUERIES

-- Get all genres
SELECT * FROM Genres;

-- Get books by genre
SELECT b.*, a.name as author_name 
FROM Books b
JOIN Authors a ON b.author_id = a.author_id
JOIN Genres_Has_Books ghb ON b.book_id = ghb.book_id
WHERE ghb.genre_id = @genreId;

-- Create a new genre
INSERT INTO Genres (title) 
VALUES (@title);

-- Update a genre
UPDATE Genres 
SET title = @title 
WHERE genre_id = @genreId;

-- Delete a genre
DELETE FROM Genres 
WHERE genre_id = @genreId;

-- USERS QUERIES

-- Get all users (excluding password for security)
SELECT user_id, username, email FROM Users;

-- Create a new user
INSERT INTO Users (username, password, email) 
VALUES (@username, @password, @email);

-- Update a user
UPDATE Users 
SET username = @username, email = @email 
WHERE user_id = @userId;

-- Update a user's password
UPDATE Users 
SET password = @password 
WHERE user_id = @userId;

-- Delete a user
DELETE FROM Users 
WHERE user_id = @userId;

-- RENTALS QUERIES

-- Get all rentals with user and book info
SELECT r.*, u.username, b.title as book_title
FROM Rentals r
JOIN Users u ON r.user_id = u.user_id
JOIN Books b ON r.book_id = b.book_id;

-- Get rentals for a specific user
SELECT r.*, b.title as book_title, a.name as author_name
FROM Rentals r
JOIN Books b ON r.book_id = b.book_id
JOIN Authors a ON b.author_id = a.author_id
WHERE r.user_id = @userId;

-- Check book availability (count current rentals vs total quantity)
SELECT 
    b.total_qty, 
    COUNT(r.rental_id) as current_rentals,
    b.total_qty - COUNT(r.rental_id) as available
FROM Books b
LEFT JOIN Rentals r ON b.book_id = r.book_id
WHERE b.book_id = @bookId
GROUP BY b.book_id, b.total_qty;

-- Create a new rental
INSERT INTO Rentals (user_id, book_id, date, expiration_date) 
VALUES (@userId, @bookId, @date, @expirationDate);

-- Delete a rental (return a book)
DELETE FROM Rentals 
WHERE rental_id = @rentalId;