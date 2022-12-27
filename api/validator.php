<?php

namespace rules;

class Validator {
    
    // Validate names and color
    private static $regex_name = "^[a-zA-Z]+( [a-zA-Z]+)*$";
    private static $regex_id = "^[\d]+$";

    public function __construct() {
        
    }

    public static function name($str) {
        if(empty($str)) {
            throw new Error("Validator->name cannot be empty");
        }
        
        if(! is_string($str)) {
            throw new Error("Validator->name should be a string");
        }
        
        return preg_match(Validator::$regex_name, $str);
    }
    
    public static function id($id) {
        if(empty($id)) {
            throw new Error("Validator->id cannot be empty");
        }
        
        if(! is_int($id)) {
            throw new Error("Validator->id should be an integer");
        }
        
        return preg_match(Validator::$regex_id, $id);
    }
}

?>
