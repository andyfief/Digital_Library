-- Andrew Fief
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

DELIMITER ;