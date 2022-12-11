<?php 

header('Access-Control-Allow-Origin: *');
header("Content-type: application/json; charset=utf-8");

$connection = [
    "host" => "localhost:3306",
    "user" => "root",
    "password" => "123456",
    "database" => "mariadb_sample",
    "table" => "fav_cats"
];

// Initialize connection
$requests = mysqli_connect($connection['host'], $connection['user'], $connection['password'], $connection['database']);


$data = [];
$query = "";

/**
 * Validate our last-modified input using regex
 * format: Y-M-D H-M-S
 * */
$pattern_last_mod = "/^(\d{4}\-\d{2}\-\d{2})\s(\d{2}:\d{2}:\d{2})$/";


if(isset($_POST['last-modified']) && ! empty($_POST['last-modified'])) {
    $lastModified = $_POST['last-modified'];
    
    if(preg_match($pattern_last_mod, $lastModified) == 0) {
        // Bad Request
        http_response_code(400);
        echo "{\"status\":\"Bad Request\",\"body\":\"Invalid post data (last-modified)\"}";
        exit();
    }
    /**
     * Get data if the field last_modified from database is greater
     * than $lastModified variable
     * */
    $ret = "SELECT * from `%s` WHERE last_modified > '%s'";
    $query = sprintf($ret, $connection['table'], $lastModified);
    
}
/*
if(empty($query)) {
    http_response_code(428);
    
    echo "{\"status\":\"No Available Data\"}";
    
    exit();
}

$result = mysqli_query($requests, $query);

$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
*/


/**
 * Response to all requests from different Origin
 * 
 * Application JSON Header
 * */
header("X-DATA-STATUS: all-latest");

// Clean Up - Flush
if (ob_get_contents()) ob_end_clean();


http_response_code(200);


echo preg_match($pattern_last_mod, $_POST["last-modified"]);
//echo json_encode($data);

exit();
?>