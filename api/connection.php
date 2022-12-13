<?php

require_once "./helpers.php";

$conn = [
    "host" => "localhost:3306",
    "user" => "root",
    "password" => "123456",
    "database" => "mariadb_sample",
    "table" => "fav_cats"
];

// Initialize connection
$requests = mysqli_connect($conn['host'], $conn['user'], $conn['password'], $conn['database']);

function atexit() {
    global $requests;

    // call before exit
    mysqli_close($requests);
}

register_shutdown_function('atexit');

return $requests;

?>
