<?php

/**
 * Limiting users from inserting, deleting and updating contents 
 * of database
 */

 /**
  * I use PHP built-in time function to reduce sql request and 
  * PHP built-in time function is and database (current_timestamp)
  * return different time. Maybe they return different timezone.
  */

namespace rate_limit;

require_once './database.php'; 

use PDOException;
use db\Database;

$__db__ = new Database();
$__db__->open_connection();

final class RateLimiting {

    /**
     * This should be unique since it will hold user accesability. 
     * Can be from IP address $_SERVER['REMOTE_ADDR']
     */
    private static string $USER_ADDR;

    /**
     * Each user will have <LIMIT> per given time
     * Will decrease every database modification such as
     * if user do insert, modify, or delete something from database
     * 
     * If Limit reach 0, user will not be able to modify the database,
     * Automatically reset after an interval
     * 
     * Will be fetch from env file
     */
    private static string $LIMIT;

    // Database table
    private static string $rate_limiting_table = "rate-limit";

    /**
     * User able to modify the database?
     * Insert, Modify, Delete
     */
    private static bool $has_access = false;

    /**
     * Automatically reset the rate-usage of the user in this interval
     */
    private static int $timeout = 1; // minutes

    public static string $USER_ID; // Will be fetch from database
    
    private static bool $is_validated = false;
    
    public function __construct() {
        self::$LIMIT = (string) getenv("rate_limit");

        // Once set, there is no turning back. =)
        if(empty(self::$USER_ADDR)) {
            // remote addr should be hash and not encoded 
            self::$USER_ADDR = $_SERVER['REMOTE_ADDR'];
        }

        $this->validate();
    }

    private function validate() : void {
        /**
         * Will check if user has record.
         * Then check if has accesability
         */
         
        if( self::$is_validated)
            return;
            
         self::$is_validated = true;

         // bindParam is for (values) only
        Database::prepare(sprintf("SELECT `current-usage`, `time-start`, `id` FROM `%s` WHERE `remote-addr` = :rem_addr",  self::$rate_limiting_table));
        
        $response = Database::execute([
            "rem_addr" => self::$USER_ADDR
        ]);
        
        if(count($response) > 0) { // Registered
            $stats = $response[0];

            self::$USER_ID = $stats['id'];

            if($stats["current-usage"] == 0 && ($stats['time-start'] + (self::$timeout * 60)) >= (int) time()) {
                // User is out of usage and time-start + interval is above current time
                self::$has_access = false;
                return;
            }

            if (($stats['time-start'] + (self::$timeout * 60)) <= (int) time()) {
                // Reset if time-start + interval is under current time
                if(! $this->reset()) die("ERROR-SYS-101");
            }
        } else { // Not register
            if(! $this->register()) die("ERROR-SYS-100");
        }

        self::$has_access = true;
    }

    
    private function register() : bool {
        Database::reset();
        /**
         * Database time is not match with PHP time
         * I don't know why. Maybe in database time is set to differ timezone?
         */
        Database::prepare(sprintf("INSERT INTO `%s` (`remote-addr`, `current-usage`, `time-start`) VALUES (:rem_addr, :rate, :new_time)",  self::$rate_limiting_table));
        
        try {
            Database::execute([
                "rem_addr" => self::$USER_ADDR,
                "rate" => (int) self::$LIMIT,
                "new_time" => time()
            ]);
            
            self::$USER_ID = Database::requests()->lastInsertId();
            
        } catch(PDOException $err) {
            return false;
        }

        return (Database::stmt()->rowCount() > 0);
    }
    
    private function reset() : bool {
        Database::reset();

        /**
         * Set current usage to max
         * Set time-start to current time
         */
        Database::prepare(sprintf("UPDATE `%s` SET `current-usage`=:rate, `time-start`=:new_time WHERE `id`=:id",  self::$rate_limiting_table));

        try {
            Database::execute([
                "id" => self::$USER_ID,
                "rate" => (int) self::$LIMIT,
                "new_time" => time()
            ]);

        } catch(PDOException $err) {
            return false;
        }

        return (Database::stmt()->rowCount() > 0);
    }

    public static function has_access() : bool {
        return self::$has_access;
    }

    public static function rated() : void {
        Database::reset();

        // Decrease current-usage by 1 if remote-addr is match and current-usage is
        // greater than 0
        Database::prepare(sprintf("UPDATE `%s` SET  `current-usage` = `current-usage` - 1 WHERE `id` = :id AND `current-usage` > 0", self::$rate_limiting_table));
        Database::execute([
            "id" => self::$USER_ID
        ]);

        // Check if some rows has been affected
        // If row has been affected, the user is 
        // still has access to modify the array

        self::$has_access = (Database::stmt()->rowCount() > 0) ? true : false;
    }
}
