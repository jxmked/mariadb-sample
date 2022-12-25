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
    private static $USER_ADDR;

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
    private static $LIMIT;

    // Database table
    private static $rate_limiting_table = "rate-limit";

    /**
     * User able to modify the database?
     * Insert, Modify, Delete
     */
    private static $has_access = false;

    /**
     * Automatically reset the rate-usage of the user in this interval
     */
    private static $timeout = 1; // minutes

    public static $USER_ID; // Will be fetch from database

    public function __construct() {
        RateLimiting::$LIMIT = getenv("rate_limit");

        // Once set, there is no turning back. =)
        if(empty(RateLimiting::$USER_ADDR)) {
            // remote addr should be hash and not encoded 
            RateLimiting::$USER_ADDR = base64_encode($_SERVER['REMOTE_ADDR']);
        }

        $this->validate();
    }

    private function validate() {
        /**
         * Will check if user has record.
         * Then check if has accesability
         */

         // bindParam is for (values) only
        Database::prepare(sprintf("SELECT `current-usage`, `time-start`, `id` FROM `%s` WHERE `remote-addr` = :rem_addr",  RateLimiting::$rate_limiting_table));
        
        $response = Database::execute([
            "rem_addr" => RateLimiting::$USER_ADDR
        ]);
        
        if(count($response) > 0) { // Registered
            $stats = $response[0];

            RateLimiting::$USER_ID = $stats['id'];

            if($stats["current-usage"] == 0 && ($stats['time-start'] + (RateLimiting::$timeout * 60)) >= (int) time()) {
                // User is out of usage and time-start + interval is above current time
                RateLimiting::$has_access = false;
                return;
            }

            if (($stats['time-start'] + (RateLimiting::$timeout * 60)) <= (int) time()) {
                // Reset if time-start + interval is under current time
                if(! $this->reset()) die("ERROR-SYS-101");
            }
        } else { // Not register
            if(! $this->register()) die("ERROR-SYS-100");
        }

        RateLimiting::$has_access = true;
    }

    
    private function register() {
        Database::reset();
        /**
         * Database time is not match with PHP time
         * I don't know why. Maybe in database time is set to differ timezone?
         */
        Database::prepare(sprintf("INSERT INTO `%s` (`remote-addr`, `current-usage`, `time-start`) VALUES (:rem_addr, :rate, :new_time)",  RateLimiting::$rate_limiting_table));
        
        try {
            Database::execute([
                "rem_addr" => RateLimiting::$USER_ADDR,
                "rate" => RateLimiting::$LIMIT,
                "new_time" => time()
            ]);
            
            RateLimiting::$USER_ID = Database::requests()->lastInsertId();
            
        } catch(PDOException $err) {
            return false;
        }

        return (Database::stmt()->rowCount() > 0);
    }
    
    private function reset() {
        Database::reset();

        /**
         * Set current usage to max
         * Set time-start to current time
         */
        Database::prepare(sprintf("UPDATE `%s` SET `current-usage`=:rate, `time-start`=:new_time WHERE `id`=:id",  RateLimiting::$rate_limiting_table));

        try {
            Database::execute([
                "id" => RateLimiting::$USER_ID,
                "rate" => RateLimiting::$LIMIT,
                "new_time" => time()
            ]);

        } catch(PDOException $err) {
            return false;
        }

        return (Database::stmt()->rowCount() > 0);
    }

    public static function has_access(){
        return RateLimiting::$has_access;
    }

    public static function rated() {
        Database::reset();

        // Decrease current-usage by 1 if remote-addr is match and current-usage is
        // greater than 0
        Database::prepare(sprintf("UPDATE `%s` SET  `current-usage` = `current-usage` - 1 WHERE `id` = :id AND `current-usage` > 0", RateLimiting::$rate_limiting_table));
        Database::execute([
            "id" => RateLimiting::$USER_ID
        ]);

        // Check if some rows has been affected
        // If row has been affected, the user is 
        // still has access to modify the array

        RateLimiting::$has_access = (Database::stmt()->rowCount() > 0) ? true : false;
    }
}
?>
