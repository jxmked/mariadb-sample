<?php

/**
 * Limiting users from inserting, deleting and updating contents 
 * of database
 */

namespace rate_limit;

final class RateLimiting {
    private static $USER_ADDR;
    private static $LIMIT = 5;

    public function __construct() {
        // Once set, there is no turning back. =)
        if(empty(RateLimiting::$USER_ADDR)) {
            RateLimiting::$USER_ADDR = $_SERVER['REMOTE_ADDR'];
        }
    }


}

?>
