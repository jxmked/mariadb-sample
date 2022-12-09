<?php


namespace DB;

class DB {
    private $host;
    private $user;
    private $pwd;
    private $requests;
    
    public function __construct($host, $user, $pwd) {
        $this->host = $host;
        $this->user = $user;
        $this->pwd = $pwd;
    }
    
    public function open_db($dbName) {
        
        $this->requests = mysqli_connect($this->host, $this->user, $this->pwd, $dbName);
    }
    
    public function get_request() {
        return $this->requests;
    }
}


?>