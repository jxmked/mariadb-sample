<?php

namespace helpers;




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
            return Helpers::normalize_string($value);
        }
        
        return $fallback;
    }
    
}

?>