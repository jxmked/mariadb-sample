<?php
header('Access-Control-Allow-Origin: *');
header("Content-type: application/json; charset=utf-8");


/**
 * Source: https://stackoverflow.com/questions/4064444/returning-json-from-a-php-script
 * 
 * returnJsonHttpResponse
 * @param $success: Boolean
 * @param $data: Object or Array
 */
function returnJsonHttpResponse($success, $data) {
    // remove any string that could create an invalid JSON 
    // such as PHP Notice, Warning, logs...
    if (ob_get_contents()) ob_end_clean();

    // this will clean up any previously added headers, to start clean
   // header_remove(); 

    // Set the content type to JSON and charset 
    // (charset can be set to something else)
    //header('Access-Control-Allow-Origin', '*');
   // header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Set your HTTP response code, 2xx = SUCCESS, 
    // anything else will be error, refer to HTTP documentation
    if ($success) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
    
    // encode your PHP Object or Array into a JSON string.
    // stdClass or array
    echo json_encode($data);

    // making sure nothing is added
    exit();
}


require_once './db.php';
use DB\DB;;

$var = new DB("localhost:3306", "root", "123456");

$var->open_db("mariadb_sample");
$req = $var->get_request();


$query = "SELECT * FROM `fav_cats`";
$result = mysqli_query($req, $query);

$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);



returnJsonHttpResponse(true, $json);


?>