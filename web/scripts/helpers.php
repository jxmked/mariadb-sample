<?php

namespace helpers;

defined("SECURITY") or die("Direct access is not allowed!");

class Helpers {
    
    public static function normalize_string(string $str) {
        return trim($str);
    }
    
    public static function url_param(string $index, string $fallback = "") {
        /**
         * Parameter value from GET method
         * */
        $value = (isset($_GET[$index])) ? $_GET[$index] : false;
        
        if(strlen(Helpers::normalize_string($value)) > 0) {
            return strtolower(Helpers::normalize_string($value));
        }
        
        return $fallback;
    }
    
    public static function safe_print(string $str, string $fallback = "") {
        $str = Helpers::normalize_string($str);
        
        if(strlen($str) > 0) {
            echo $str;
        } else {
            echo $fallback;
        }
    }
}

?>