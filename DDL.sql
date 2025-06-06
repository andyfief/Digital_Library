DROP PROCEDURE IF EXISTS reset_database;

DELIMITER $$

Create PROCEDURE reset_database()
BEGIN

    SET FOREIGN_KEY_CHECKS=0; -- disables foreign key checks to allow dropping tables in any order
    SET AUTOCOMMIT = 0; -- so that changes are only saved after an explicit COMMIT

    DROP TABLE IF EXISTS Genres_Has_Books;
    DROP TABLE IF EXISTS Rentals;
    DROP TABLE IF EXISTS Books;
    DROP TABLE IF EXISTS Genres;
    DROP TABLE IF EXISTS Users;
    DROP TABLE IF EXISTS Authors; -- drops tables if they exist so we can redefine them

    CREATE TABLE Authors (
        author_id INT AUTO_INCREMENT PRIMARY KEY, -- author id's increment as they are inserted
        name VARCHAR(100) NOT NULL, -- 100 character limit on name length
        bio TEXT -- large enough for a long bio.
    );

    CREATE TABLE Books (
        book_id INT AUTO_INCREMENT PRIMARY KEY, -- book id's increment as they are inserted
        title VARCHAR(255) NOT NULL, -- 255 char limit on title length
        author_id INT NOT NULL, -- a book is linked to an author
        publication_date DATE NOT NULL, -- note that date types follow YYYY-MM-DD
        description TEXT, -- large enough for a long description
        total_qty INT NOT NULL, -- quanitity of books on hand
        FOREIGN KEY (author_id) REFERENCES Authors(author_id) -- sets the author id as foreign key referencing the authors table
            ON UPDATE CASCADE 
            ON DELETE CASCADE -- ensures that if the author_id is updated or deleted, it is realized in this table, preventing orphaned book records
    );

    CREATE TABLE Genres (
        genre_id INT AUTO_INCREMENT PRIMARY KEY, -- genre id's increment as they are inserted
        title VARCHAR(100) NOT NULL UNIQUE -- 100 chars should be long enough for titles. UNIQUE so we don't have multiple records of same book
    );

    CREATE TABLE Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY, -- user id's increment as they are inserted
        username VARCHAR(50) NOT NULL UNIQUE, -- username to be displayed. Should be unique usernames only
        password VARCHAR(255) NOT NULL, -- a hashed password for logging in
        email VARCHAR(100) NOT NULL UNIQUE -- email linked to user for logging in. Only 1 account per email (UNIQUE)
    );

    CREATE TABLE Rentals (
        rental_id INT AUTO_INCREMENT PRIMARY KEY, -- rental id's increment as they are inserted
        user_id INT NOT NULL, -- the user making the rental
        book_id INT NOT NULL, -- the book being rented
        date DATE NOT NULL, -- the date its being rented on
        expiration_date DATE NOT NULL, -- the date it expires on
        FOREIGN KEY (user_id) REFERENCES Users(user_id) -- links the rental to the user id
            ON UPDATE CASCADE
            ON DELETE CASCADE, -- ensures that if the user_id is updated or deleted, it is realized in this table, preventing orphaned rental records
        FOREIGN KEY (book_id) REFERENCES Books(book_id) -- links the rental to the book id
            ON UPDATE CASCADE
            ON DELETE CASCADE -- ensures that if the book_id is updated or deleted, it is realized in this table, preventing orphaned rental records
    );

    CREATE TABLE Genres_Has_Books ( -- an intersection table between genres and books supporting M:M
        relationship_id INT AUTO_INCREMENT PRIMARY KEY,
        genre_id INT NOT NULL, -- genre id for the link
        book_id INT NOT NULL, -- book id for the link
        UNIQUE KEY unique_genre_book (genre_id, book_id),
        FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) -- gets genre_id from auto incremented attribute in Genres
            ON UPDATE CASCADE
            ON DELETE CASCADE, -- ensures that if the genre_id is updated or deleted, it is realized in this table, preventing orphaned genre/book relationships
        FOREIGN KEY (book_id) REFERENCES Books(book_id) -- gets book_id from auto incremented attribute in Books
            ON UPDATE CASCADE
            ON DELETE CASCADE -- ensures that if the book_id is updated or deleted, it is realized in this table, preventing orphaned genre/book relationships
    );

    INSERT INTO Authors (name, bio) VALUES 
    ('J.K. Rowling', 'Best known for the Harry Potter series.'),
    ('George Orwell', 'I wrote animal farm!'),
    ('Rick Riordan', 'New York Times bestselling author best known for the Percy Jackson & the Olympians series');

    INSERT INTO Books (title, author_id, publication_date, description, total_qty) VALUES
    ('Harry Potter and the Sorcerer''s Stone', 1, '1997-06-26', 'first harry potter book', 10),
    ('Animal Farm', 2, '1999-06-08', 'A book about pigs?', 8),
    ('The Lightning Thief', 3, '2005-02-01', 'A young demigod goes on an adventure', 3);

    INSERT INTO Genres (title) VALUES 
    ('Fantasy'), 
    ('Dystopian'), 
    ('Young Adult');

    INSERT INTO Users (username, password, email) VALUES 
    ('fiefa', 'hashedPassword1', 'fiefa@oregonstate.edu'),
    ('arorae', 'hashedPassword2', 'arorae@oregonstate.edu'),
    ('bookLuvr2004', '1234', 'BookLover1234@gmail.com');

    INSERT INTO Rentals (user_id, book_id, date, expiration_date) VALUES 
    (1, 1, '2025-04-01', '2025-04-15'), -- fiefa, Harry Potter and the Sorcerer's Stone, date, exp date
    (3, 1, '2024-02-01', '2024-02-15'),
    (3, 2, '2024-02-03', '2024-02-17'), -- User 3's rentals overlap because a user can have many rentals
    (3, 3, '2024-02-29', '2024-03-14'); -- bookLuvr2004 rents all 3 books

    INSERT INTO Genres_Has_Books (genre_id, book_id) VALUES 
    (1, 1),  -- Fantasy, Harry Potter
    (3, 1),  -- Young Adult, Harry Potter
    (2, 2),  -- Dystopian, Animal Farm
    (3, 3);  -- Young Adult, The Lightning Thief

    SET FOREIGN_KEY_CHECKS=1; -- Re-enables foreign key checks after all tables are dropped
    COMMIT; -- commits all the changes made since AUTOCOMMIT was disabled

END$$
DELIMITER ; 