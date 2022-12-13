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

    constructor() {
        CatTable.worker.addEventListener("message", (evt) => {
            console.log(evt.data);
        })
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

}
