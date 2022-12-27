<?php

namespace rules;

final class Validator {
    
    // Validate names and color
    private static $regex_name = "/^[a-zA-Z]+( [a-zA-Z]+)*$/";
    private static $regex_id = "/^([\d]+)$/";

    public function __construct() {
        
    }

    public static function name($str) {
        return preg_match(Validator::$regex_name, $str);
    }
    
    public static function id($id) {
        return preg_match(Validator::$regex_id, (string) $id);
    }
}

?>
