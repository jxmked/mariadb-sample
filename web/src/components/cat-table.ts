import {
    catList,
    btnDeletetActions,
    btnEditActions
} from "../dom";

import CatItem from "./cat-item";
import getCatList from "../connect/get-cats";


export default class CatTable {
    constructor() {
        const loader = new getCatList();
        
        loader.onload = (req) => {
            console.log(req)
        }

        loader.onerror = (err) => {
            console.log(err)
        }
    }
    
    
    
    
}


