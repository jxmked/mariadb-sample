export default class ErrorDialog {
    private base:HTMLDivElement;
    private cover:HTMLDivElement;
    private isDestroyed:boolean;
    private static fadeOutInterval = 1000; // 3 seconds
    private no_close_btn:boolean;

    constructor() {
        this.base = document.createElement("div");
        this.cover = document.createElement("div");    
        this.isDestroyed = false;
        this.no_close_btn = false;

        /**
         * Having too much time to enjoy writing this.
         * Hahaha 
         * */
        this.base.style.position = "fixed";
        this.base.style.zIndex = "9999";
        this.base.style.padding = "20px 10px 50px 10px";
        this.base.style.margin = "0";
        this.base.style.backgroundColor = "#f0f0f0";
        this.base.style.left = "50%";
        this.base.style.top = "50%";
        this.base.style.transform = "translate(-50%, -50%)";
        this.base.style.border = "1px solid rgb(172, 172, 174)"
        this.base.style.textAlign = "center";
        this.base.style.borderRadius = "14px";
        this.base.style.boxShadow = "1px 4px 8px rgba(52, 52, 54, 0.2)"
        this.base.style.minHeight = "200px";
        this.base.style.minWidth = "200px";
        this.base.style.maxHeight = "90vh";
        this.base.style.maxWidth = "inherit";
        this.base.style.width = "85%"
        this.base.style.overflowY = "hidden"

        this.cover.style.backgroundColor = "#000";
        this.cover.style.position = "fixed";
        this.cover.style.zIndex = "9998"
        this.cover.style.width = "100vw";
        this.cover.style.height = "100vh";
        this.cover.style.opacity = "0.4";
    }

    private remove() {
        this.base.remove();
        this.cover.remove();
        this.isDestroyed = true;
    }

    /**
     * No Close Button
     */
    public no_rm() {
        this.no_close_btn = true;
    }
    private addCloseBtn():void {
        const btn:HTMLButtonElement = document.createElement("button");
        btn.style.position = "absolute";
        btn.style.bottom = "10px";
        btn.style.left = "50%";
        btn.style.transform = "translateX(-50%)"
        btn.innerText = "Close";
        btn.style.width = "90%";
        btn.style.padding = "5px";
        btn.style.borderRadius = "7px";
        btn.style.border = "none";
        btn.style.backgroundColor = "rgb(255, 105, 97)";
        btn.style.color = "rgb(242, 242, 247)";
        btn.style.maxWidth = "350px";
        btn.addEventListener("click", () => {
            this.remove();
        })

        this.base.appendChild(btn);
    }

    set msg(msg:string|number|boolean) {
        if(this.isDestroyed) 
            throw new TypeError("Cannot append new message. Please, reinitialize the object.");

        const p:HTMLParagraphElement = document.createElement("p");
       
        p.style.margin = "0";
        p.style.padding = "4px";
        p.style.boxSizing = "border-box";
        p.style.textAlign = "left"
        p.style.textIndent = "0";
        p.style.whiteSpace = "normal";
        p.style.overflowY = "scroll";
        p.style.color = "var(--text-color)";
        
        p.appendChild(document.createTextNode(String(msg)));

        this.base.append(p);
    }

    /**
     * Set interval to 0 to keep alive
     * 
     * 1000 = 1 second
     */
    show(interval:number = 0):void {
        if(! this.no_close_btn) {
            this.addCloseBtn();
        }        
        
        document.body.appendChild(this.cover);
        document.body.appendChild(this.base);
        
        if(interval == 0) {
            return;
        }

        let last:number, current_time:number;  
        last = new Date().getTime();
        
        let ival = window.setInterval(() => {
            current_time = new Date().getTime();
            
            
            if(this.isDestroyed) {
                /**
                 * Prevent Reaching the interval
                 * if the close button has been clicked.
                 * 
                 * */
                clearInterval(ival);
            }
            
            if(! this.isDestroyed && (current_time - last) >= interval) {
                // close dialog
                
                this.fadeOut(this.remove.bind(this));
                clearInterval(ival);
            }
        }, 10);
    }

    private fadeOut(callback?:Function) {
        /**
         * Fade out animation
         */
        let initial_time:number = new Date().getTime();
        let opa:number;

        let ival = window.setInterval(() => {
            opa = (1 - (((new Date().getTime() - initial_time) / ErrorDialog.fadeOutInterval)))
            if(opa >= 0) {
                this.base.style.opacity = String(opa.toFixed(4));
            } else {
                this.base.style.opacity = "0";
                (callback || function(){})();
                clearInterval(ival);    
            }            
        }, 1);

    }


}
