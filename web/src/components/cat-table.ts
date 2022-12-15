import CatItem from "./cat-item";
import conn from "../connect/config";
import { ucfirst } from "../helpers";
import { catList } from "../dom";

export default class CatTable {
    private static worker:Worker = new Worker("./worker.js");
    private static worker_config:object = {
        interval: 1000, // 1 second / ping
        pulse: 10, // pulse
        host: conn.host, // Set interval pulse
        stop_on_error:true
    };
    
    private fatal_stop = false;
    private static items:{[key:number]:CatItem} = {};
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
        CatTable.items[data["id"]] = new CatItem(data);
        CatTable.items[data["id"]].onedit = (id:number) => {
            console.log("Edit " + id);
            
        }
        
        CatTable.items[data["id"]].onremove = (id:number) => {
            console.log("Remove " + id);
            
        }
        catList.appendChild(CatTable.items[data["id"]].html);
    }
    
    private event_delete(id:number):void {
        CatTable.items[id].html.remove();
        delete CatTable.items[id];
    }

    private event_modify(data:CatInterface):void {
        CatTable.items[data["id"]].name = ucfirst(data["name"]);
        CatTable.items[data["id"]].color = ucfirst(data["color"]);
    }

    /**
     * Listen to workers changes 
     * */
    listen(): void {
        CatTable.worker.addEventListener("message", (evt) => {
            switch(evt.data['type']) {
                case 'added':
                    this.event_add(evt.data["body"]["content"] as CatInterface);
                    this.callbacks["update"](evt.data["body"]["content"] as CatInterface);
                    this.update_num_list();
                    break;
                
                case 'modified':  
                    this.event_modify(evt.data["body"]["content"] as CatInterface);
                    this.callbacks["update"](evt.data["body"]["content"] as CatInterface);
                    break;
                
                case 'deleted':
                    this.event_delete(evt.data["body"]["id"] as CatInterface['id']);    
                    this.callbacks["update"](evt.data["body"]["id"] as CatInterface['id']);
                    this.update_num_list();
                    break;
                
                case 'error':
                    this.callbacks["error"](evt.data);
                    break;
                    
                default:
                    CatTable.worker.postMessage({
                        "type":"command",
                        "body": "stop"
                    });
                    this.callbacks["error"]("Force Stop! Unexpected things happened");
                    console.error(evt.data);
            }
        })
    }

    send_command(msg:string):void {
        CatTable.worker.postMessage({
            "type":"command",
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
    
    /**
     * Update counting number everytime we
     * add or remove values from cat-table list
     * */
    update_num_list() {
        Object.values(CatTable.items).forEach((item, index) => item.numCount = index + 1);
    }
    
    /**
     * Callback Handler - Set method
     * */
    set onupdate(callback:Function) {
        this.callbacks["update"] = callback;
    }

    set onerror(callback:Function) {
        this.callbacks["error"] = callback;
    }
    
}
