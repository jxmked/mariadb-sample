<?php

namespace cats;

require_once "./cat-table.php";
require_once "./validator.php";

use table\CatTable;
use rules\Validator;

final class GetCats extends CatTable {
    
    
    public function __construct() {
        
    }
    
    public function get_id($id) {
        return $this->get();
    }
}

?>