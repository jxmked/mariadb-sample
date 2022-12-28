<?php
/**
 * Specialize for this application
 */

namespace db;

use Error;
use Exception;
use PDO;

final class Database {
    private static PDO $requests;
    private static $stmt;

    private string $DNS;
    private $credentials = [];

    public function __construct($config=[]) {
        $host = $port = $dbname = "";

        if(count($config) > 0) {
            $this->credentials["user"] = $config["user"];
            $this->credentials["pwd"] = $config["pwd"];
            
            $host = $config["host"];
            $port = $config["port"];
            $dbname = $config["dbname"];
        } else {
            $this->credentials["user"] = getenv("mariadb_user");
            $this->credentials["pwd"] = getenv("mariadb_pwd");
            
            $host = getenv("mariadb_host");
            $port = getenv("mariadb_port");
            $dbname = getenv("mariadb_db");
        }

        $this->DNS = sprintf("mysql:host=%s:%s;dbname=%s", $host, $port, $dbname);
    }

    public function open_connection() {
        try {
            // Is connected?
            if(Database::$requests->getAttribute(PDO::ATTR_CONNECTION_STATUS) == "PDO::ATTR_CONNECTION_OK") {
                return;
            }
        } catch(Error $err) { }

        Database::$requests = new PDO($this->DNS, $this->credentials["user"], $this->credentials["pwd"]);
    }

    public static function prepare($query) {
        try {
            Database::$stmt = Database::$requests->prepare($query);
        } catch (Exception $err) {
            throw new Exception("Database does not initialize");
        }
    }

    public static function execute($args = []) {
        try {
            Database::$stmt->execute($args);
            return Database::$stmt->fetchAll();
        } catch(Exception $err) {
            throw $err;
        }
    }
    
    public static function stmt(){
        return Database::$stmt;
    }

    public static function reset() {
        try {
            // May throw an error if the prepare has not been set
            Database::$stmt->closeCursor();
        } catch (Exception $err) { }
    }

    public static function requests(){
        return Database::$requests;
    }
}


?>
