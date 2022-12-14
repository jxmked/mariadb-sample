<?php

define("SECURITY", 1);

$requests = require_once "./connection.php";

$conn = [
    "table" => "fav_cats"
];


if(! isset($_SESSION)) {
    session_save_path("./.session");

    session_status();

}

/**
 * Fetch data from database and create hashed string for each row
 * save the hashed string to session and send the fetched data to the client
 * 
 * If the client check for changes, the server will check the hashed string saved in 
 * session to compare with the database
 */

?>
