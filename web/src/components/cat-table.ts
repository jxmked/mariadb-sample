import {
    catList,
    btnDeletetActions,
    btnEditActions
} from "../dom";

import CatItem from "./cat-item";
import ErrorDialog from "./error-dialog";
import conn from "../connect/config";

export default class CatTable {
    fatal_stop = false;
    
    private static worker:Worker = new Worker("./worker.js");
    private static worker_config:object = {
        interval: 1000, // 1 second / ping
        pulse: 10, // pulse
        host: conn.host, // Set interval pulse
        stop_on_error:true
    };
    
    private static items:{[key:number]:CatItem};
    
    private callbacks:{[key:string]:Function};

    private static hasInit = false;
    constructor() {
        this.callbacks = {
            "error": () => {},
            "update": () => {}
        };

        if(CatTable.hasInit) {
            throw new Error("Unable to reinitialize CatTable");
        }

    }

    private event_add(data:CatInterface):void {
        const catItem = new CatItem(data);

        catList.appendChild(catItem.html);

        CatTable.items[data["id"]] = catItem;

    }
    
    listen(): void {
        CatTable.worker.addEventListener("message", (evt) => {
            switch(evt.data['type']) {
                case 'added':
                    this.event_add(evt.data["body"]["content"] as CatInterface);
                    this.update_num_list();
                    break;
                
                case 'modified':   
                    break;
                
                case 'deleted':
                    this.update_num_list();
                    break;
                
                case 'error':
                    break;
                    
                default:
                    console.error("Force stop! Unexpected things happpened");
            }
        })
    }
    
    set onupdate(callback:Function) {
        this.callbacks["update"] = callback;
    }

    set onerror(callback:Function) {
        this.callbacks["error"] = callback;
    }

    send_command(msg:string):void {
        CatTable.worker.postMessage({
            "type":"message",
            "body": msg
        });
    }

    start() {
        CatTable.worker.postMessage({
            "type": "config",
            "body": CatTable.worker_config
        });

        CatTable.worker.postMessage({
            "type":"command",
            "body": "start"
        });
    }

    update_num_list() {
        Object.values(CatTable.items).forEach((item, index) => {
            console.log(index)
        })
    }
}
