import CatItem from "./cat-item";
import conn from "../connect/config";
import { ucfirst, cat_validator as validate } from "../helpers";
import { catList } from "../dom";
import Cover from './bg-cover';
import deleteDialog from './confirm-delete-dialog';
import requestDelete from '../connect/delete';
import ErrorDialog from './error-dialog';
import EditDialog from './edit-dialog';
import Update from '../connect/update';

const INVALID_FIELD_DATA: string = "Fill up the form accordingly";

export default class CatTable {
    private static worker: Worker = new Worker("./worker.js");
    private static worker_config: object = {
        interval: 1000, // 1 second / ping
        pulse: 10, // pulse
        host: conn.host, // Set interval pulse
        stop_on_error: true
    };

    private static items: { [key: CatInterface['id']]: CatItem } = {};
    private callbacks: { error: Function; update: Function };
    private static hasInit = false;

    constructor() {
        this.callbacks = {
            "error": () => { },
            "update": () => { }
        };

        if (CatTable.hasInit) {
            throw new Error("Unable to reinitialize CatTable");
        }
    }

    private event_add(data: CatInterface): void {
        CatTable.items[data["id"]] = new CatItem(data);

        CatTable.items[data["id"]]!.onedit = this.event_edit_item.bind(this);
        CatTable.items[data["id"]]!.onremove = this.event_delete_item.bind(this);

        catList.appendChild(CatTable.items[data["id"]]!.html);
    }

    /**
     * Event - Delete confirm
     * Confirmation for deletion
     * */

    private event_delete_item(id: CatInterface['id']): void {
        const dd = new deleteDialog(CatTable.items[id]!.data);
        Cover.show();
        dd.show();
        let is_on_transac = false;

        dd.ondeny = () => {
            if (is_on_transac) return;

            dd.hide();
            Cover.hide();
        };

        dd.onconfirm = () => {
            is_on_transac = true;

            requestDelete(CatTable.items[id]!.data)
                .then((res) => {
                    is_on_transac = false;
                    if (res.hasOwnProperty("mode") && res["mode"] == "delete" && res["status"] == "success") {
                        dd.hide();
                        Cover.hide();

                        return;
                    }

                    throw new Error("Unexpected things happened");

                }).catch((err) => {
                    is_on_transac = false;

                    if (err.toString() == 404) {
                        return;
                    }

                    const erd = new ErrorDialog();

                    erd.msg = err.toString();
                    erd.show(3000);
                });
        }
    }

    private event_edit_item(id: CatInterface['id']): void {
        const ed = new EditDialog(CatTable.items[id]!.data);
        const data = Object.assign({}, CatTable.items[id]!.data);
        let is_on_transac = false;

        ed.set_btn_names({
            confirm: "Update",
            cancel: "Cancel"
        });

        Cover.show();
        ed.show();

        ed.oncancel = () => {
            if (is_on_transac) return;

            ed.hide();
            Cover.hide();
            ed.destroy();
        }

        ed.onconfirm = ({ name, color }: { name: string, color: string }) => {
            EditDialog.msgBox(false);

            if (!(validate.name(name) && validate.color(color))) {
                EditDialog.msgBox(INVALID_FIELD_DATA);
                EditDialog.msgBox(true);
                return;
            }

            data.name = name;
            data.color = color;

            Update(data)
                .then((res) => {
                    is_on_transac = false;
                    if (res.hasOwnProperty("mode") && res["mode"] == "modify" && res["status"] == "success") {
                        ed.hide();
                        Cover.hide();
                        ed.destroy();
                        return;
                    }

                    throw new Error("Unexpected things happened");

                }).catch((err) => {
                    is_on_transac = false;

                    const erd = new ErrorDialog();

                    if (err.toString() == '404') {
                        erd.msg = "Opsss... That item doesn't exists anymore";
                    } else {
                        erd.msg = err.toString();
                    }
                    erd.show(3000);
                });
        }
    }

    private event_delete(id: CatInterface['id']): void {
        CatTable.items[id]!.html.remove();
        delete CatTable.items[id];
    }

    private event_modify(data: CatInterface): void {
        CatTable.items[data["id"]]!.name = ucfirst(data["name"]);
        CatTable.items[data["id"]]!.color = ucfirst(data["color"]);
    }

    /**
     * Listen to workers changes 
     * */
    listen(): void {
        CatTable.worker.addEventListener("message", (evt) => {
            switch (evt.data['type']) {
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
                        "type": "command",
                        "body": "stop"
                    });
                    this.callbacks["error"]("Force Stop! Unexpected things happened");
                    console.error(evt.data);
            }
        })
    }

    send_command(msg: string): void {
        CatTable.worker.postMessage({
            "type": "command",
            "body": msg
        });
    }

    start() {
        CatTable.worker.postMessage({
            "type": "config",
            "body": CatTable.worker_config
        });

        CatTable.worker.postMessage({
            "type": "command",
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
    set onupdate(callback: Function) {
        this.callbacks["update"] = callback;
    }

    set onerror(callback: Function) {
        this.callbacks["error"] = callback;
    }

}
