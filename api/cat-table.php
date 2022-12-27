<?php

namespace table;


require_once './database.php'; 
require_once './rating.php';

use db\Database;
use rate_limit\RateLimiting;
use PDOException;
use Error;

$__db__ = new Database();
$__db__->open_connection();
new RateLimiting();



abstract class CatTable {
    private static $table = "fav_cats";
    
    public function __construct() {
        
    }
    
    /**
     * Get cats from Database
     * 
     * Get cat info from given id or
     * get all cats if id is not set
     * */
    abstract protected function get($id=false) {
        Database::reset();
        
        $query = sprintf("SELECT * FROM `%s`", CatTable::$table);
        
        if(! $id === false) {
            $query = sprintf("%s WHERE `id` = :id", $query);
            Database::prepare($query);
            return Database::execute([
                'id' => $id
            ]);
        } else {
            Database::prepare($query);
            return Database::execute();
        }
    }
    
    /**
     * Insert new data and get the id of new inserted data.
     * 
     * 
     * */
    abstract protected function insert($attributes) {
        Database::reset();
        
        $query = sprintf("INSERT INTO `%s` (`name`, `color`) VALUES (:name, :color)", CatTable::$table);
        try {
            Database::prepare($query);
            
            Database::execute($attributes);
        } catch(PDOException $err) {
            throw new Error("Name already exist");
        }
        
        return Database::requests()->lastInsertId();
    }
    
    /**
     * Update values from database
     * Return true if success, otherwise false or an Exception
     * */
    abstract protected function update($attributes) {
        $query = sprintf("UPDATE `%s` SET `name`=:name, `color`=:color WHERE `id` = :id", CatTable::$table);
        
        try {
            Database::prepare($query);
            Database::execute($attributes);
            
            return Database::stmt()->rowCount() == 1;
        } catch(PDOException $err) {
            throw new Error("Name already exists");
        }
    }
    
    /**
     * Delete cat data from database
     * */
    abstract protected function delete($attributes) {
        $query = sprintf("DELETE FROM `%s` WHERE `id` = :id", CatTable::$table);
        
        try {
            Database::prepare($query);
            Database::execute($attributes);
            
            return Database::stmt()->rowCount() == 1;
        } catch(PDOException $err) {
            throw new Error("Error during delete query execution");
        }
    }
}

?>