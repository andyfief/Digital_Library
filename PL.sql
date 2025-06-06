-- Andrew Fief
-------------CITATIONS---------------------------
-- I used Claude AI to assist in writing the error handling at the beginning of the procedure. 

DELIMITER //

DROP PROCEDURE IF EXISTS delete_rental//

CREATE PROCEDURE delete_rental(IN p_rental_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE rental_exists INT DEFAULT 0;
    
    -- Check if the rental exists before attempting to delete
    SELECT COUNT(*) INTO rental_exists 
    FROM Rentals 
    WHERE rental_id = p_rental_id;
    
    -- Only delete if the rental exists
    IF rental_exists > 0 THEN
        DELETE FROM Rentals 
        WHERE rental_id = p_rental_id;
        
        SELECT CONCAT('Rental ID ', p_rental_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: Rental ID ', p_rental_id, ' not found.') AS error_message;
    END IF;
    
END//


DROP PROCEDURE IF EXISTS add_rental//

CREATE PROCEDURE add_rental(
    IN p_user_id INT,
    IN p_book_id INT,
    IN p_date DATE,
    IN p_expiration_date DATE
)
BEGIN
    -- Declare variables for error handling
    DECLARE user_exists INT DEFAULT 0;
    DECLARE book_exists INT DEFAULT 0;
    DECLARE new_rental_id INT DEFAULT 0;
    
    -- Check if the user exists
    SELECT COUNT(*) INTO user_exists 
    FROM Users 
    WHERE user_id = p_user_id;
    
    -- Check if the book exists
    SELECT COUNT(*) INTO book_exists 
    FROM Books 
    WHERE book_id = p_book_id;
    
    -- Only add rental if both user and book exist
    IF user_exists = 0 THEN
        SELECT CONCAT('Error: User ID ', p_user_id, ' not found.') AS error_message;
    ELSEIF book_exists = 0 THEN
        SELECT CONCAT('Error: Book ID ', p_book_id, ' not found.') AS error_message;
    ELSE
        INSERT INTO Rentals (user_id, book_id, date, expiration_date)
        VALUES (p_user_id, p_book_id, p_date, p_expiration_date);
        
        SET new_rental_id = LAST_INSERT_ID();
        
        SELECT CONCAT('Rental ID ', new_rental_id, ' has been created successfully.') AS message,
               new_rental_id AS rental_id;
    END IF;
    
END//


DROP PROCEDURE IF EXISTS update_rental//

CREATE PROCEDURE update_rental(
    IN p_rental_id INT,
    IN p_new_user_id INT,
    IN p_new_book_id INT,
    IN p_new_date DATE,
    IN p_new_exp_date DATE
)
BEGIN
    -- Declare variables for error handling
    DECLARE rental_exists INT DEFAULT 0;
    DECLARE book_exists INT DEFAULT 0;
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if the rental exists
    SELECT COUNT(*) INTO rental_exists 
    FROM Rentals 
    WHERE rental_id = p_rental_id;
    
    -- Check if the new book exists
    SELECT COUNT(*) INTO book_exists 
    FROM Books 
    WHERE book_id = p_new_book_id;

    -- Check if the new user exists
    SELECT COUNT(*) INTO user_exists 
    FROM Users 
    WHERE user_id = p_new_user_id;
    
    -- Only edit rental if rental, user and book exist
    IF rental_exists = 0 THEN
        SELECT CONCAT('Error: Rental ID ', p_rental_id, ' not found.') AS error_message;
    ELSEIF user_exists = 0 THEN
        SELECT CONCAT('Error: User ID ', p_new_user_id, ' not found.') AS error_message;
    ELSEIF book_exists = 0 THEN
        SELECT CONCAT('Error: Book ID ', p_new_book_id, ' not found.') AS error_message;
    ELSE
        UPDATE Rentals
        SET user_id = p_new_user_id,
            book_id = p_new_book_id,
            date = p_new_date,
            expiration_date = p_new_exp_date
        WHERE rental_id = p_rental_id;
        
        SELECT CONCAT('Rental ID ', p_rental_id, ' has been updated successfully.') AS message;
    END IF;
    
END//


DROP PROCEDURE IF EXISTS delete_book//

CREATE PROCEDURE delete_book(IN p_book_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE book_exists INT DEFAULT 0;
    
    -- Check if the rental exists before attempting to delete
    SELECT COUNT(*) INTO book_exists 
    FROM Books
    WHERE book_id = p_book_id;
    
    -- Only delete if the rental exists
    IF book_exists > 0 THEN
        DELETE FROM Books
        WHERE book_id = p_book_id;
        
        SELECT CONCAT('Book ID ', p_book_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: Book ID ', p_book_id, ' not found.') AS error_message;
    END IF;
    
END//


DROP PROCEDURE IF EXISTS add_book//

CREATE PROCEDURE add_book(
    IN p_title VARCHAR(255),
    IN p_author_id INT,
    IN p_publication_date DATE,
    IN p_description TEXT,
    IN p_total_qty INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE author_exists INT DEFAULT 0;
    DECLARE new_book_id INT DEFAULT 0;
    
 -- Declare exit handler for SQL exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Transaction failed during book creation' AS error_message;
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Check if the author exists
    SELECT COUNT(*) INTO author_exists 
    FROM Authors 
    WHERE author_id = p_author_id;
    
    -- Only add book if author exists
    IF author_exists = 0 THEN
        ROLLBACK;
        SELECT CONCAT('Error: Author ID ', p_author_id, ' not found.') AS error_message;
    ELSE
        INSERT INTO Books (title, author_id, publication_date, description, total_qty)
        VALUES (p_title, p_author_id, p_publication_date, p_description, p_total_qty);
        
        SET new_book_id = LAST_INSERT_ID();
        
        -- Commit the transaction
        COMMIT;
        
        SELECT CONCAT('Book ID ', new_book_id, ' has been created successfully.') AS message,
               new_book_id AS book_id;
    END IF;
    
END//


DROP PROCEDURE IF EXISTS update_book//

CREATE PROCEDURE update_book(
    IN p_book_id INT,
    IN p_new_title VARCHAR(255),
    IN p_new_author_id INT,
    IN p_new_publication_date DATE,
    IN p_new_description TEXT,
    IN p_new_total_qty INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE book_exists INT DEFAULT 0;
    DECLARE author_exists INT DEFAULT 0;
    
    -- Check if the book exists
    SELECT COUNT(*) INTO book_exists 
    FROM Books 
    WHERE book_id = p_book_id;
    
    -- Check if the new author exists
    SELECT COUNT(*) INTO author_exists 
    FROM Authors 
    WHERE author_id = p_new_author_id;
    
    -- Only edit book if book and author exist
    IF book_exists = 0 THEN
        SELECT CONCAT('Error: Book ID ', p_book_id, ' not found.') AS error_message;
    ELSEIF author_exists = 0 THEN
        SELECT CONCAT('Error: Author ID ', p_new_author_id, ' not found.') AS error_message;
    ELSE
        UPDATE Books
        SET title = p_new_title,
            author_id = p_new_author_id,
            publication_date = p_new_publication_date,
            description = p_new_description,
            total_qty = p_new_total_qty
        WHERE book_id = p_book_id;
        
        SELECT CONCAT('Book ID ', p_book_id, ' has been updated successfully.') AS message;
    END IF;
    
END//



DROP PROCEDURE IF EXISTS delete_author//

CREATE PROCEDURE delete_author(IN p_author_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE author_exists INT DEFAULT 0;
    
    -- Check if the author exists before attempting to delete
    SELECT COUNT(*) INTO author_exists 
    FROM Authors 
    WHERE author_id = p_author_id;
    
    -- Only delete if the author exists
    IF author_exists > 0 THEN
        DELETE FROM Authors 
        WHERE author_id = p_author_id;
        
        SELECT CONCAT('Author ID ', p_author_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: Author ID ', p_author_id, ' not found.') AS error_message;
    END IF;
    
END//

DROP PROCEDURE IF EXISTS add_author//

CREATE PROCEDURE add_author(
    IN p_name VARCHAR(255),
    IN p_bio TEXT
)
BEGIN
    -- Declare variable for new author ID
    DECLARE new_author_id INT DEFAULT 0;
    
    -- Insert the new author
    INSERT INTO Authors (name, bio)
    VALUES (p_name, p_bio);
    
    SET new_author_id = LAST_INSERT_ID();
    
    SELECT CONCAT('Author ID ', new_author_id, ' has been created successfully.') AS message,
           new_author_id AS author_id;
    
END//

DROP PROCEDURE IF EXISTS update_author//

CREATE PROCEDURE update_author(
    IN p_author_id INT,
    IN p_new_name VARCHAR(255),
    IN p_new_bio TEXT
)
BEGIN
    -- Declare variable for error handling
    DECLARE author_exists INT DEFAULT 0;
    
    -- Check if the author exists
    SELECT COUNT(*) INTO author_exists 
    FROM Authors 
    WHERE author_id = p_author_id;
    
    -- Only edit author if it exists
    IF author_exists = 0 THEN
        SELECT CONCAT('Error: Author ID ', p_author_id, ' not found.') AS error_message;
    ELSE
        UPDATE Authors
        SET name = p_new_name,
            bio = p_new_bio
        WHERE author_id = p_author_id;
        
        SELECT CONCAT('Author ID ', p_author_id, ' has been updated successfully.') AS message;
    END IF;
    
END//

DROP PROCEDURE IF EXISTS delete_relationship//

CREATE PROCEDURE delete_relationship(IN p_relationship_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE relationship_exists INT DEFAULT 0;
    
    -- Check if the relationship exists before attempting to delete
    SELECT COUNT(*) INTO relationship_exists 
    FROM Genres_Has_Books 
    WHERE relationship_id = p_relationship_id;
    
    -- Only delete if the relationship exists
    IF relationship_exists > 0 THEN
        DELETE FROM Genres_Has_Books 
        WHERE relationship_id = p_relationship_id;
        
        SELECT CONCAT('Relationship ID ', p_relationship_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: Relationship ID ', p_relationship_id, ' not found.') AS error_message;
    END IF;
    
END//

DROP PROCEDURE IF EXISTS add_relationship//

CREATE PROCEDURE add_relationship(
    IN p_genre_id INT,
    IN p_book_id INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE genre_exists INT DEFAULT 0;
    DECLARE book_exists INT DEFAULT 0;
    DECLARE relationship_exists INT DEFAULT 0;
    DECLARE new_relationship_id INT DEFAULT 0;
    
    -- Declare exit handler for SQL exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Transaction failed during relationship creation' AS error_message;
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Check if the genre exists
    SELECT COUNT(*) INTO genre_exists 
    FROM Genres 
    WHERE genre_id = p_genre_id;
    
    -- Check if the book exists
    SELECT COUNT(*) INTO book_exists 
    FROM Books 
    WHERE book_id = p_book_id;
    
    -- Check if the relationship already exists
    SELECT COUNT(*) INTO relationship_exists 
    FROM Genres_Has_Books 
    WHERE genre_id = p_genre_id AND book_id = p_book_id;
    
    -- Only add relationship if both genre and book exist and relationship doesn't already exist
    IF genre_exists = 0 THEN
        ROLLBACK;
        SELECT CONCAT('Error: Genre ID ', p_genre_id, ' not found.') AS error_message;
    ELSEIF book_exists = 0 THEN
        ROLLBACK;
        SELECT CONCAT('Error: Book ID ', p_book_id, ' not found.') AS error_message;
    ELSEIF relationship_exists > 0 THEN
        ROLLBACK;
        SELECT CONCAT('Error: Relationship between Genre ID ', p_genre_id, ' and Book ID ', p_book_id, ' already exists.') AS error_message;
    ELSE
        INSERT INTO Genres_Has_Books (genre_id, book_id)
        VALUES (p_genre_id, p_book_id);
        
        SET new_relationship_id = LAST_INSERT_ID();
        
        -- Commit the transaction
        COMMIT;
        
        SELECT CONCAT('Relationship ID ', new_relationship_id, ' has been created successfully.') AS message,
               new_relationship_id AS relationship_id;
    END IF;
    
END//

DROP PROCEDURE IF EXISTS update_relationship//

CREATE PROCEDURE update_relationship(
    IN p_relationship_id INT,
    IN p_new_genre_id INT,
    IN p_new_book_id INT
)
BEGIN
    -- Declare variables for error handling
    DECLARE relationship_exists INT DEFAULT 0;
    DECLARE genre_exists INT DEFAULT 0;
    DECLARE book_exists INT DEFAULT 0;
    DECLARE duplicate_exists INT DEFAULT 0;
    
    -- Check if the relationship exists
    SELECT COUNT(*) INTO relationship_exists 
    FROM Genres_Has_Books 
    WHERE relationship_id = p_relationship_id;
    
    -- Check if the new genre exists
    SELECT COUNT(*) INTO genre_exists 
    FROM Genres 
    WHERE genre_id = p_new_genre_id;
    
    -- Check if the new book exists
    SELECT COUNT(*) INTO book_exists 
    FROM Books 
    WHERE book_id = p_new_book_id;
    
    -- Check if the new combination would create a duplicate (excluding current relationship)
    SELECT COUNT(*) INTO duplicate_exists 
    FROM Genres_Has_Books 
    WHERE genre_id = p_new_genre_id AND book_id = p_new_book_id AND relationship_id != p_relationship_id;
    
    -- Only update relationship if everything is valid
    IF relationship_exists = 0 THEN
        SELECT CONCAT('Error: Relationship ID ', p_relationship_id, ' not found.') AS error_message;
    ELSEIF genre_exists = 0 THEN
        SELECT CONCAT('Error: Genre ID ', p_new_genre_id, ' not found.') AS error_message;
    ELSEIF book_exists = 0 THEN
        SELECT CONCAT('Error: Book ID ', p_new_book_id, ' not found.') AS error_message;
    ELSEIF duplicate_exists > 0 THEN
        SELECT CONCAT('Error: Relationship between Genre ID ', p_new_genre_id, ' and Book ID ', p_new_book_id, ' already exists.') AS error_message;
    ELSE
        UPDATE Genres_Has_Books
        SET genre_id = p_new_genre_id,
            book_id = p_new_book_id
        WHERE relationship_id = p_relationship_id;
        
        SELECT CONCAT('Relationship ID ', p_relationship_id, ' has been updated successfully.') AS message;
    END IF;
    
END//

-- DELETE user using stored procedure
DROP PROCEDURE IF EXISTS delete_user//

CREATE PROCEDURE delete_user(IN p_user_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if the user exists before attempting to delete
    SELECT COUNT(*) INTO user_exists 
    FROM Users 
    WHERE user_id = p_user_id;
    
    -- Only delete if the user exists
    IF user_exists > 0 THEN
        DELETE FROM Users 
        WHERE user_id = p_user_id;
        
        SELECT CONCAT('User ID ', p_user_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: User ID ', p_user_id, ' not found.') AS error_message;
    END IF;
    
END//

-- ADD user using stored procedure
DROP PROCEDURE IF EXISTS add_user//

CREATE PROCEDURE add_user(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_email VARCHAR(100)
)
BEGIN
    -- Declare variables for error handling
    DECLARE username_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    DECLARE new_user_id INT DEFAULT 0;
    
    -- Check if the username already exists
    SELECT COUNT(*) INTO username_exists 
    FROM Users 
    WHERE username = p_username;
    
    -- Check if the email already exists
    SELECT COUNT(*) INTO email_exists 
    FROM Users 
    WHERE email = p_email;
    
    -- Only add user if username and email are unique
    IF username_exists > 0 THEN
        SELECT CONCAT('Error: Username "', p_username, '" already exists.') AS error_message;
    ELSEIF email_exists > 0 THEN
        SELECT CONCAT('Error: Email "', p_email, '" already exists.') AS error_message;
    ELSE
        INSERT INTO Users (username, password, email)
        VALUES (p_username, p_password, p_email);
        
        SET new_user_id = LAST_INSERT_ID();
        
        SELECT CONCAT('User ID ', new_user_id, ' has been created successfully.') AS message,
               new_user_id AS user_id;
    END IF;
    
END//

-- UPDATE user using stored procedure
DROP PROCEDURE IF EXISTS update_user//

CREATE PROCEDURE update_user(
    IN p_user_id INT,
    IN p_new_username VARCHAR(50),
    IN p_new_password VARCHAR(255),
    IN p_new_email VARCHAR(100)
)
BEGIN
    -- Declare variables for error handling
    DECLARE user_exists INT DEFAULT 0;
    DECLARE username_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    -- Check if the user exists
    SELECT COUNT(*) INTO user_exists 
    FROM Users 
    WHERE user_id = p_user_id;
    
    -- Check if the new username already exists (excluding current user)
    SELECT COUNT(*) INTO username_exists 
    FROM Users 
    WHERE username = p_new_username AND user_id != p_user_id;
    
    -- Check if the new email already exists (excluding current user)
    SELECT COUNT(*) INTO email_exists 
    FROM Users 
    WHERE email = p_new_email AND user_id != p_user_id;
    
    -- Only update user if user exists and new values are unique
    IF user_exists = 0 THEN
        SELECT CONCAT('Error: User ID ', p_user_id, ' not found.') AS error_message;
    ELSEIF username_exists > 0 THEN
        SELECT CONCAT('Error: Username "', p_new_username, '" already exists.') AS error_message;
    ELSEIF email_exists > 0 THEN
        SELECT CONCAT('Error: Email "', p_new_email, '" already exists.') AS error_message;
    ELSE
        -- Update user, only update password if it's provided (not empty)
        IF p_new_password IS NOT NULL AND p_new_password != '' THEN
            UPDATE Users
            SET username = p_new_username,
                password = p_new_password,
                email = p_new_email
            WHERE user_id = p_user_id;
        ELSE
            UPDATE Users
            SET username = p_new_username,
                email = p_new_email
            WHERE user_id = p_user_id;
        END IF;
        
        SELECT CONCAT('User ID ', p_user_id, ' has been updated successfully.') AS message;
    END IF;
    
END//

-- DELETE genre using stored procedure
DROP PROCEDURE IF EXISTS delete_genre//

CREATE PROCEDURE delete_genre(IN p_genre_id INT)
BEGIN
    -- Declare variable for error handling
    DECLARE genre_exists INT DEFAULT 0;
    
    -- Check if the genre exists before attempting to delete
    SELECT COUNT(*) INTO genre_exists 
    FROM Genres 
    WHERE genre_id = p_genre_id;
    
    -- Only delete if the genre exists
    IF genre_exists > 0 THEN
        DELETE FROM Genres 
        WHERE genre_id = p_genre_id;
        
        SELECT CONCAT('Genre ID ', p_genre_id, ' has been deleted.') AS message;
    ELSE
        SELECT CONCAT('Error: Genre ID ', p_genre_id, ' not found.') AS error_message;
    END IF;
    
END//

-- ADD genre using stored procedure
DROP PROCEDURE IF EXISTS add_genre//

CREATE PROCEDURE add_genre(
    IN p_title VARCHAR(100)
)
BEGIN
    -- Declare variables for error handling
    DECLARE title_exists INT DEFAULT 0;
    DECLARE new_genre_id INT DEFAULT 0;
    
    -- Check if the title already exists (genres have UNIQUE constraint on title)
    SELECT COUNT(*) INTO title_exists 
    FROM Genres 
    WHERE title = p_title;
    
    -- Only add genre if title is unique
    IF title_exists > 0 THEN
        SELECT CONCAT('Error: Genre title "', p_title, '" already exists.') AS error_message;
    ELSE
        INSERT INTO Genres (title)
        VALUES (p_title);
        
        SET new_genre_id = LAST_INSERT_ID();
        
        SELECT CONCAT('Genre ID ', new_genre_id, ' has been created successfully.') AS message,
               new_genre_id AS genre_id;
    END IF;
    
END//

-- UPDATE genre using stored procedure
DROP PROCEDURE IF EXISTS update_genre//

CREATE PROCEDURE update_genre(
    IN p_genre_id INT,
    IN p_new_title VARCHAR(100)
)
BEGIN
    -- Declare variables for error handling
    DECLARE genre_exists INT DEFAULT 0;
    DECLARE title_exists INT DEFAULT 0;
    
    -- Check if the genre exists
    SELECT COUNT(*) INTO genre_exists 
    FROM Genres 
    WHERE genre_id = p_genre_id;
    
    -- Check if the new title already exists (excluding current genre)
    SELECT COUNT(*) INTO title_exists 
    FROM Genres 
    WHERE title = p_new_title AND genre_id != p_genre_id;
    
    -- Only update genre if genre exists and new title is unique
    IF genre_exists = 0 THEN
        SELECT CONCAT('Error: Genre ID ', p_genre_id, ' not found.') AS error_message;
    ELSEIF title_exists > 0 THEN
        SELECT CONCAT('Error: Genre title "', p_new_title, '" already exists.') AS error_message;
    ELSE
        UPDATE Genres
        SET title = p_new_title
        WHERE genre_id = p_genre_id;
        
        SELECT CONCAT('Genre ID ', p_genre_id, ' has been updated successfully.') AS message;
    END IF;
    
END//

DELIMITER ;