<?php


define("SECURITY", 1);


if(!isset($_SESSION)) {
    session_save_path("./.session");
    session_start();
}

// https://stackoverflow.com/a/1270960/11481602
if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > 1800) {
    // session started more than 30 minutes ago
    session_regenerate_id(true);    // change session ID for the current session and invalidate old session ID
    $_SESSION['CREATED'] = time();  // update creation time
}

/*
var_dump($_SERVER['REMOTE_ADDR']);
exit(); */
//header('Access-Control-Allow-Origin: ' . $_SERVER['REMOTE_ADDR'] . "");
//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Credentials: true');

require_once "./helpers.php";

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
    } else {
        /**
         * Instead of returning all data at once,
         * why not to check if their was a changes in database?
         * */
        $t_result = mysqli_query($requests, "SELECT time FROM `last-update` WHERE id=1");
        $t_data = mysqli_fetch_all($t_result, MYSQLI_ASSOC);
        
        if(isset($t_data[0]['time']) && !isset($_GET['notime'])) {
            $t_time = (int) $t_data[0]['time'];
            
            /**
             * Check if the user sync time is out of date
             * */
            if(isset($_SESSION['LAST-TIME-UPDATE'])) {
                if((int) $_SESSION['LAST-TIME-UPDATE'] >= $t_time) {
                    helpers\print_response(200, ["status" => "updated"]);
                }
            }
            
            /** Out of date.
             * Update user sync time from updated time in database
             * */
            $_SESSION['LAST-TIME-UPDATE'] = $t_time;
        }
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

    if($result) {
        // Success
        $data = [
            "status" => "success",
            "mode" => $mode,
            "code" => "200"
        ];
        
        /**
         * Update sync time in database in every changes we did 
         * in the database such as add, edit and delete
         * */
        
        if(in_array($mode, ["insert", "delete", "edit", "modify"])) {
            mysqli_query($requests, sprintf("UPDATE `last-update` SET `time`='%s' WHERE id=1", microtime(true)));
        }
        
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
