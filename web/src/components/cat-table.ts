import {
    catList,
    btnDeletetActions,
    btnEditActions
} from "../dom";

import CatItem from "./cat-item";
import getCatList from "../connect/get-cats";
import ErrorDialog from "./error-dialog";

export default class CatTable {
    constructor() {
        const edag = new ErrorDialog();
        
        const loader = new getCatList();
        
        loader.onload = (req) => {
            console.log(req)
        }

        loader.onerror = (err) => {
            edag.msg = err.toString();
            edag.msg = "Please, check your API connection.";
            
            edag.show(5000);
        }
    }
    
    
    
    
}


