<?php

namespace helpers;

defined("SECURITY") or die("No direct access allowed");


use Exception;

/**
 * Print JSON data and exit
 */
function print_response($status, $data) {
    header("Content-type: application/json; charset=utf-8");
    
    if (ob_get_contents()) ob_end_clean();

    http_response_code($status);
    
    echo json_encode($data);
    
    exit();
}


/**
 * Get raw data from POST method array
 */
function post_data($index) {
    try {
        if(isset($_POST[$index]) && ! empty($_POST[$index])) {
            $unsafe_str = trim($_POST[$index]);
            
            return preg_replace("/\s+/", " ", $unsafe_str);
        }
    } catch(Exception $err) {}
    return "";
}
?>

