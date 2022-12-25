<?php
define("SECURITY", 1);

/**
 * Load and parse dotenv file.
 * 
 * Use getenv() to get value from dotenv file
 *  */
$env_file = './.env';

if (file_exists($env_file) || is_readable($env_file)) {
    $__env__ = parse_ini_file($env_file);

    if(count($__env__) < 1) {
        die("Failed to load env file");
    }

    /**
     * Using extract, it will create a local variables with 
     * <name from env file> as variable name containing its values
     */
    array_walk($__env__, function($v, $k){
        //$_ENV[$k] = $v;
        // I hate you PHP
        putenv(sprintf("%s=%s", $k, $v));
    });
} else {
    die("Failed to load env file");
}

/**
 * Sooner, I'll try to implement web registration user interface that
 * will gave user a token to use to have more rates.
 * Atleast, I'll try. I'm not sure
 * */

header('Access-Control-Allow-Origin: *');

require_once "./database.php";
require_once "./helpers.php";
require_once "./rating.php";

// Open connection
use db\Database;
use rate_limit\RateLimiting;

$__db__ = new Database();
$__db__->open_connection();

new RateLimiting();


echo RateLimiting::$USER_ID;
echo PHP_EOL;

echo RateLimiting::has_access() ? 'Has access' : 'No access';
echo PHP_EOL;
echo RateLimiting::$USER_ID;

RateLimiting::rated();

exit();

$requests = require_once "./connection.php";

$conn = [
    "table" => "fav_cats"
];

// Allow numbers only from 0-999
$pattern_id = "/^([0-9]{1,3})$/i";

// Allow a-z case insensitive and a space only like " ". Hahaha
// Does not allow string leading by spaces
$pattern_regular_string = "/^[^\s]([a-zA-Z ]{1,64})$/i";

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Return all data from database
    // Return data by id
    /**
     * We can use different technique to sync User interface and database
     * 1 - We can create temporary table into database server for this application only
     *   and run a query to fetch the difference between the original table and the temporary table.
     *   ; downsides...
     *       We have higher probability that the database size from the server can increase since
     *       a single table gets replicated multiple times depending how many application use and sync with it
     *       and the data it has. 
     *       
     *       It may slow the database server since it is the only one who compare those difference between tables.1 
     *      
     *       
     * 2 -  Get all available data from database and create a code block to compare the difference 
     *      between fetched data and current data. (selected)
     *   ; downsides...
     *       May consume a lot of internet usage
     *       May slow the performance of the application
     */

    $query = sprintf("SELECT * FROM `%s`", $conn["table"]); 

    // Get single row by id
    if(isset($_GET["id"]) && ! empty($_GET["id"])) {
        $unsafe_id = $_GET["id"];
        $unsafe_id =  trim($unsafe_id);

        // Since we expected the input (id) to be numbers only
        // and exit if input (id) does not meet the expectation,
        // We are able to not to sanitize it to prevent SQL Injection
        if(preg_match($pattern_id, $unsafe_id) === 0) {

            // NaN found

            $data = [
                "status" => "Bad Request",
                "body" => "Parameter (id) must be a numbers (0-9) only."
            ];

            // Status Bad request
            helpers\print_response(400, $data);
        }

        $query = sprintf("%s WHERE id=%s", $query, $unsafe_id);
    }

    $result = mysqli_query($requests, $query);
    $data = mysqli_fetch_all($result, MYSQLI_ASSOC);

    helpers\print_response(200, $data);
} elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
    // POST DATA
    /**
     * Add data
     *  name
     *  color
     * 
     * Modify/Edit Data
     *  name
     *  color
     *  id
     * 
     * Delete
     *  id
     */

    $name = helpers\post_data("name");
    $color = helpers\post_data("color");
    $id = helpers\post_data("id");
    $mode = strtolower(helpers\post_data("mode"));
    
    if($mode != "delete" && (preg_match($pattern_regular_string, $name) === 0 || preg_match($pattern_regular_string, $color) === 0)) {
        // Invalid requests
        
        $data = [
            "status" => "Bad Request",
            "body" => "POST data must contain `name` and `color` keys and only accepts a-z and space characters up to 64 characters are allowed."
        ];

        // Status Bad request
        helpers\print_response(400, $data);
        exit();
    }

    
    switch ($mode) {
        case 'insert':
            // requires name, color

            // Check if name already exists
            $result = mysqli_query($requests, sprintf("SELECT * FROM `%s` WHERE `name`='%s'", $conn['table'], $name));
            $data = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if(count($data) > 0) {
                // Already exists
                $data = [
                    "status" => "Conflicts",
                    "body" => "POST data key (name) already exists on database."
                ];

                // Status Conflicts
                helpers\print_response(409 , $data);
            }

            $query = sprintf("INSERT INTO `%s` (`name`, `color`) VALUES ('%s', '%s')", $conn['table'] ,$name, $color);

            break;
        case 'edit':
        case 'modify':
            // Edit / Modify

            // Validate ID
            if(preg_match($pattern_id, $id) === 0) {
                // Bad requests
                $data = [
                    "status" => "Bad Request",
                    "body" => "POST data key (id) should contains numbers 0-999 only."
                ];

                // Status Bad request
                helpers\print_response(400, $data);
            }

            // Check if id does not exists in database then error
            $result = mysqli_query($requests, sprintf("SELECT * FROM `%s` WHERE id='%s'", $conn['table'], $id));
            $data = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if(count($data) <= 0) {
                $data = [
                    "status" => "Not Found",
                    "body" => "POST data key (id) does not exists on database."
                ];

                // Status Not Found
                helpers\print_response(404, $data);
            }

            // Check if name already exists in database
            $result = mysqli_query($requests, sprintf("SELECT * FROM `%s` WHERE `name`='%s' AND `id`!='%s'", $conn['table'], $name, $id));
            $data = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if(count($data) > 0) {
                // Already exists
                $data = [
                    "status" => "Conflicts",
                    "body" => "POST data key (name) already exists on database."
                ];

                // Status Conflicts
                helpers\print_response(409 , $data);
            }

            $query = sprintf("UPDATE `%s` SET `name`='%s', `color`='%s', `last_modified`=current_timestamp WHERE id='%s'", $conn['table'] ,$name, $color, $id);

            break;

        case 'delete':

            // Check if id does not exists in database then error
            $result = mysqli_query($requests, sprintf("SELECT * FROM `%s` WHERE id='%s'", $conn['table'], $id));
            $data = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if(count($data) <= 0) {
                $data = [
                    "status" => "Not Found",
                    "body" => "POST data key (id) does not exists on database."
                ];

                // Status Not Found
                helpers\print_response(404, $data);
            }

            $query = sprintf("DELETE FROM `%s` WHERE `id`='%s'", $conn['table'], $id);

            break;

        default:
            $data = [
                "status" => "Bad Request",
                "body" => "No available method to perform for mode " . $mode
            ];

            // Status Bad Request
            helpers\print_response(400, $data);
            break;
    }

    $result = mysqli_query($requests, $query);

    if($result == true) {
        // Success
        $data = [
            "status" => "success",
            "mode" => $mode,
            "code" => "200"
        ];
    } else {
        $data = [
            "status" => "failed",
            "mode" => $mode,
            "code" => "409" // I don't know what to put here... Conflicts
        ];
    }

    $code = $data["code"];
    unset($data["code"]);

    helpers\print_response($code, $data);
}

// Unauthorize
http_response_code(401);

echo "FAILED TO RESPONSE";

exit();

?>
