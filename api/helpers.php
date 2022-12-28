<?php

namespace helpers;

defined("SECURITY") or die("No direct access allowed");


use Exception;

/**
 * Print JSON data and exit
 */
 
/**
 * @param array<string,string|int> $data
 */
function print_response(int $status, $data) : void {
    header("Content-type: application/json; charset=utf-8");
    
    if (ob_get_contents()) ob_end_clean();

    http_response_code($status);
    
    echo json_encode($data);
    
    exit();
}


/**
 * Get raw data from POST method array
 */
function post_data(string $index) : string  {
    try {
        if(isset($_POST[$index]) && ! empty($_POST[$index])) {
            $unsafe_str = trim($_POST[$index]);
            
            $res = preg_replace("/\s+/", " ", (string) $unsafe_str);
            
            return $res ? $res : "";
        }
    } catch(Exception $err) {}
    return "";
}
?>
