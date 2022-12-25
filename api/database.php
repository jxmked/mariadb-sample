<?php
namespace db;

use Exception;

final class Database {
    private static $requests;
    private static $PRE_DNS = "mysql:host=localhost;dbname=";

    public function __construct() {
        
    }

    public function open_conn() {
        
    }

    public static function close() {
        try {
            /**
             * May throw an error
             * if the database does not initialize
             */
            mysqli_close(Database::$requests);
        } catch(Exception $err) { }
    }
}

register_shutdown_function(function(){ 
    Database::close();
});


/**
 * 
 * 
$dsn = 'mysql:host=localhost;dbname=mydatabase';
$username = 'user';
$password = 'password';
$pdo = new PDO($dsn, $username, $password);

// Prepare the SELECT statement
$stmt = $pdo->prepare('SELECT * FROM users WHERE active = :active');

// Bind the parameter
$stmt->bindParam(':active', $active);

// Execute the statement
$active = 1;
$stmt->execute();

// Fetch all rows as an array
$rows = $stmt->fetchAll();

// Iterate over the rows using a foreach loop
foreach ($rows as $row) {
  // Process the row
  echo $row['id'] . ': ' . $row['username'] . PHP_EOL;
}

 */
?>
