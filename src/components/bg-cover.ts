import {
    bgCover
} from "../dom";

export default class Cover {
    /**
     * 0 - hidden
     * 
     * 0 < - visible
     */
    private static depth:number = 0;
    
    constructor() {
        
    }

    zIndex(depth:number):void {
        if(depth < 0) {
            throw new TypeError("zIndex cannot be lessthan 0");
        }

        bgCover.style.zIndex = String(depth);
    }

    static hide():void {
        if(Cover.depth <= 0) {
            return;
        }
        
        Cover.depth = Cover.depth - 1;
        Cover.__update();
    }

    static show():void {
        Cover.depth = Cover.depth + 1;
        Cover.__update();
    }
    
    static forceShow():void {
        Cover.depth = 1;
        Cover.__update();
    }

    static forceHide():void {
        Cover.depth = 0;
        Cover.__update();
    }

    private static __update():void {
        bgCover.setAttribute('data-status', (Cover.depth == 0) ? "hide" : "show");
    }
}
