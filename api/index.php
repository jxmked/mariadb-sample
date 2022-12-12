<?php 

header('Access-Control-Allow-Origin: *');
header("Content-type: application/json; charset=utf-8");

$conn = [
    "host" => "localhost:3306",
    "user" => "root",
    "password" => "123456",
    "database" => "mariadb_sample",
    "table" => "fav_cats"
];

// Initialize connection
$requests = mysqli_connect($conn['host'], $conn['user'], $conn['password'], $conn['database']);


$data = [];
$query = "";


/**
 * Fetch Mode
 * */
/**
 * Validate our last-modified input using regex
 * format: Y-m-d H-M-S
 * */
 //                       Y    -      m          -         <d>     <space>       00-23       :  00-59  :  00-59       
$pattern_last_mod = "/^(\d{4})\-((0\d)|(1[0-2]))\-(([0-2]\d)|(3[0-2]))\s((([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))$/";

if(isset($_POST['last-modified']) && ! empty($_POST['last-modified'])) {
    /**
     * Its okay to not to sanitize this post data
     * We have expected value here and get validated by our RegEx
     * */
    $lastModified = $_POST['last-modified'];
    
    if(preg_match($pattern_last_mod, $lastModified) == 0) {
        // Bad Request
        http_response_code(400);
        header("X-DATA-STATUS: latest");
        echo "{\"status\":\"Bad Request\",\"body\":\"Invalid post data (last-modified)\"}";
        mysqli_close($requests);
        exit();
    }
    /**
     * Get data if the field last_modified from database is greater
     * than $lastModified variable
     * */
    $ret = "SELECT * from `%s` WHERE last_modified > '%s'";
    $query = sprintf($ret, $conn['table'], $lastModified);
    
}
/*
if(empty($query)) {
    http_response_code(428);
    
    echo "{\"status\":\"No Available Data\"}";
    
    exit();
}

$result = mysqli_query($requests, $query);

$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
mysqli_close($requests);
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