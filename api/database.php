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

    private static string $DNS;
    private static $credentials = [];

    public function __construct($config=[]) {
        if(count($config) > 0) {
            self::$credentials["user"] = $config["user"];
            self::$credentials["pwd"] = $config["pwd"];
            
            $host = $config["host"];
            $port = $config["port"];
            $dbname = $config["dbname"];
            self::$DNS = sprintf("mysql:host=%s:%s;dbname=%s", $host, $port, $dbname);
        }

    }

    public function open_connection() {
        try {
            // Is connected?
            if(self::$requests->getAttribute(PDO::ATTR_CONNECTION_STATUS) == "PDO::ATTR_CONNECTION_OK") {
                return;
            }
        } catch(Error $err) { }

        self::$requests = new PDO(
                self::$DNS,
                self::$credentials["user"],
                self::$credentials["pwd"]
        );
    }

    public static function prepare($query) {
        try {
            self::$stmt = self::$requests->prepare($query);
        } catch (Exception $err) {
            throw new Exception("Database does not initialize");
        }
    }

    public static function execute($args = []) {
        try {
            self::$stmt->execute($args);
            return self::$stmt->fetchAll();
        } catch(Exception $err) {
            throw $err;
        }
    }
    
    public static function stmt(){
        return self::$stmt;
    }

    public static function reset() {
        try {
            // May throw an error if the prepare has not been set
            self::$stmt->closeCursor();
        } catch (Exception $err) { }
    }

    public static function requests(){
        return self::$requests;
    }
}


?>
