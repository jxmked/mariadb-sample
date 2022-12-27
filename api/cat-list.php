<?php

namespace table;


require_once './database.php'; 
require_once './rating.php';
require_once './validator.php';

use db\Database;
use rate_limit\RateLimiting;
use PDOException;
use Error;
use rules\Validator;

$__db__ = new Database();
$__db__->open_connection();
new RateLimiting();

final class CatList {
    private static $table = "fav_cats";
    
    public function __construct() {
        
    }
    
    /**
     * Get cats from Database
     * 
     * Get cat info from given id or
     * get all cats if id is not set
     * */
    public function get($id=false) {
        if($id !== false && ! Validator::id($id)) {
            throw new Error("CatList->get should be a valid integer");
        }
        
        Database::reset();
        
        $query = sprintf("
            SELECT * 
                FROM `%s`
        ", CatList::$table);
        
        if(! $id === false) {
            $query = sprintf("
            %s 
                WHERE 
                    `id` = :id
            ", $query);
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
    public function insert($attributes) {
        list(
            "color" => $color,
            "name" => $name
        ) = $attributes;
        
        if(!Validator::name($name))
            throw new Error("CatList->insert: Invalid name");
        
        if(! Validator::name($color))
            throw new Error("CatList->insert: Invalid color");
        
        Database::reset();
        
        $query = sprintf("
            INSERT 
                INTO `%s` 
                    (`name`, `color`) 
                VALUES 
                    (:name, :color)
        ", CatList::$table);
        
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
    public function update($attributes) {
        list(
            "color" => $color,
            "name" => $name,
            "id" => $id
        ) = $attributes;
        
        if(!Validator::name($name))
            throw new Error("CatList->update: Invalid name");
        
        if(! Validator::name($color))
            throw new Error("CatList->update: Invalid color");
        
        if(! Validator::id($id)) 
            throw new Error("CatList->update: Invalid id");
        
        Database::reset();
        
        $query = sprintf("
            UPDATE `%s` 
                SET 
                    `name` = :name, 
                    `color` = :color,
                    `last_modified` = current_timestamp
                WHERE 
                    `id` = :id
            ", CatList::$table);
        
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
    public function delete($id) {
        if(! Validator::id($id)) 
            throw new Error("CatList->delete: Invalid id");
        
        Database::reset();
        
        $query = sprintf("
            DELETE 
                FROM 
                    `%s` 
                WHERE 
                    `id` = :id
        ", CatList::$table);
        
        try {
            Database::prepare($query);
            Database::execute([
                'id'=> $id
            ]);
            
            return Database::stmt()->rowCount() == 1;
        } catch(PDOException $err) {
            throw new Error("Error during delete query execution");
        }
    }
    
    /**
     * Get by name
     * */
    
    public function get_by_name($name) {
        if(! Validator::name($name)) 
            throw new Error("CatList->get_by_name: Invalid name");
        
        Database::reset();
        
        $query = sprintf("
            SELECT id 
                FROM 
                    `%s` 
                WHERE 
                    `name` = :name
        ", CatList::$table);
        
        try {
            Database::prepare($query);
            return Database::execute([
                'name' => $name
            ]);
        } catch(PDOException $err) {
            throw new Error("Error during get_by_name query execution");
        }
    }
    
    /**
     * Validate name and id
     * 
     * Expecting id to be exists and name doesnt exists in database
     * */
    public function on_modify_validation($id, $name) {
        
        Database::reset();
        
        /**
         * Check ID and name
         * Expected:
         *     If ID does exists and name doesn't exists
         *     return true
         * 
         *     If ID does exists and name remain unchange
         *     return true
         * 
         *     otherwise false
         * */
        
        // The best thing i can do. =)
        $query = sprintf("
            SELECT IF (
                EXISTS (
                    SELECT 1 FROM `%1\$s` WHERE `id` = :id AND `name` = :name
                ) OR (
                    EXISTS (
                        SELECT 1 FROM `%1\$s` WHERE `id` = :id
                    ) AND 
                    NOT EXISTS (
                        SELECT 1 FROM `%1\$s` WHERE `name` = :name
                    )
                ),
                TRUE, FALSE
            ) AS result
        ", CatList::$table);
        
        try {
            Database::prepare($query);
            return Database::execute([
                "name" => $name,
                "id" => $id
            ])[0]['result'];
        } catch(PDOException $err) {
            throw new Error("Error during on_modify_validation wuery execution");
        }
    }
}

?>