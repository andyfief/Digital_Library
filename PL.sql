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

DELIMITER ;