<?php

namespace rules;

final class Validator {
    
    // Validate names and color
    private static string $regex_name = "/^[a-zA-Z]+( [a-zA-Z]+)*$/";
    private static string $regex_id = "/^([\d]+)$/";

    public function __construct() {
        
    }

    public static function name(string $str) : bool {
        return preg_match(self::$regex_name, $str) == true;
    }
    
    public static function id(string $id) : bool {
        return preg_match(self::$regex_id, (string) $id) == true;
    }
}
