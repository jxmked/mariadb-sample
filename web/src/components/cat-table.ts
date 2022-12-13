import {
    catList,
    btnDeletetActions,
    btnEditActions
} from "../dom";

import CatItem from "./cat-item";
import getCatList from "../connect/get-cats";
import ErrorDialog from "./error-dialog";

export default class CatTable {
    fatal_stop = false;
    
    constructor() {
        this.reload();
        
        let time = new Date().getTime();
        let cur = 0;
        let interval = 1000;
        
        let ival = window.setInterval(() => {
            cur = new Date().getTime();
            
            if((cur - time) >= interval) {
                this.reload();
                time = cur;
            }
            
            if(this.fatal_stop) {
                clearInterval(ival);
            }
        }, 1);
    }
    
    clear() {
        catList.innerHTML = "";
    }
    
    reload() {
        const edag = new ErrorDialog();
        
        const loader = new getCatList();

        loader.onload = (req) => {
            this.clear();
            const frag = document.createDocumentFragment();
        
            Object.values(req).forEach((cat_data) => {
                const ct = new CatItem(cat_data);
                
                frag.appendChild(ct.html);
            });
            
            catList.appendChild(frag);
        }

        loader.onerror = (err) => {
            console.error(err);
            edag.msg = err.toString();
            edag.msg = "Please, check your API connection.";
            
            this.fatal_stop = true;
            edag.show(5000);
        }
    }
    
    
    
    
}


