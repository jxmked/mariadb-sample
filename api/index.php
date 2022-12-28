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

    if($__env__ === false)
        $__env__ = [];

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
 * I will also try to learn and use Hack for better typings but for now....
 * 
 * Atleast, I'll try. I'm not sure
 * */

header('Access-Control-Allow-Origin: *');

require_once "./database.php";
require_once "./helpers.php";
require_once "./rating.php";
require_once "./cat-list.php";
require_once "./validator.php";

// Open connection
use db\Database;
use rate_limit\RateLimiting;
use table\CatList;
use rules\Validator;

$__db__ = new Database();
$__db__->open_connection();

$cats = new CatList();

$requests = "";
$query = "";

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
     *       Every requests requires to access database
     */

    // Get single row by id
    if(isset($_GET["id"]) && ! empty($_GET["id"])) {
        $unsafe_id = $_GET["id"];
        $unsafe_id =  trim($unsafe_id);

        if(! Validator::id($unsafe_id)) {
            // Status Bad request
            helpers\print_response(400, [
                "status" => "Bad Request",
                "body" => "Parameter (id) must be a numbers (0-9) only."
            ]);
        }
        
        $response = $cats->get($unsafe_id);
    } else {
        $response = $cats->get();
    }
    
    // Remove pair if key is a numbers
    
    $response = array_map(function($tobetrim){
        return array_filter($tobetrim, function($key){
            return ! is_numeric($key);
        }, ARRAY_FILTER_USE_KEY);
    }, $response);
    
    if(count($response) > 0)
        helpers\print_response(200, $response);
    
    helpers\print_response(200, []);
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
     
    new RateLimiting();

    $name = helpers\post_data("name");
    $color = helpers\post_data("color");
    $id = helpers\post_data("id");
    $mode = strtolower(helpers\post_data("mode"));
    $result = [];
    
    if($mode != "delete" && (! Validator::name($name) || ! Validator::name($color))) {
        // Status Bad request
        helpers\print_response(400, [
            "status" => "Bad Request",
            "body" => "POST data must contain `name` and `color` keys and only accepts a-z and space characters up to 64 characters are allowed."
        ]);
    }

    /**
     * Check if we have access to modify the array
     * */
    
    if(! RateLimiting::has_access()) {
        helpers\print_response(429, [
            "status" => "Too many requests",
            "body" => "You have exceeded your rate limit. Try again later."
        ]);
    }
    
    switch ($mode) {
        case 'insert':
            // requires name, color

            if(count($cats->get_by_name($name)) > 0) {
                // Already exists
                $data = [
                    "status" => "Conflict",
                    "body" => "POST data key (name) already exists on database."
                ];

                // Status Conflict
                helpers\print_response(409 , $data);
            }
            
            $result = $cats->insert([
                "name" => $name,
                "color" => $color
            ]);
            break;

        case 'edit':
        case 'modify':
            // Edit / Modify

            // Validate ID
            if(! Validator::id($id)) {
                // Status Bad request
                helpers\print_response(400, [
                    "status" => "Bad Request",
                    "body" => "POST data key (id) should contains numbers 0-999 only."
                ]);
            }
            
            if(! $cats->on_modify_validation($id, $name)){
                // Status Not Found or duplicated name
                helpers\print_response(404, [
                    "status" => "Bad Request",
                    "body" => "POST data key (id) does not exists or key (name) already registered on database."
                ]); 
            }

            $result = $cats->update([
                "name" => $name,
                "color" => $color,
                "id" => $id
            ]);
            break;

        case 'delete':

            if(count($cats->get($id)) <= 0) {
                // Status Not Found
                helpers\print_response(404, [
                    "status" => "Not Found",
                    "body" => "POST data key (id) does not exists on database."
                ]);
            }
            
            $result = $cats->delete($id);
            
            break;

        default:
            // Status Bad Request
            helpers\print_response(400, [
                "status" => "Bad Request",
                "body" => "No available method to perform for mode " . $mode
            ]);
            break;
    }

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

    $code = (int) $data["code"];
    unset($data["code"]);
    
    // Success or fail
    RateLimiting::rated();
    
    helpers\print_response($code, $data);
}

// Unauthorize
http_response_code(401);

echo "FAILED TO RESPONSE";

exit();

?>
