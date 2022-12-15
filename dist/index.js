"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("dom", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.btnDeleteDeny = exports.btnDeleteConfirm = exports.deleteCatName = exports.deleteCatDialog = exports.btnAddCatDeny = exports.btnAddCatConfirm = exports.addCatMsgBox = exports.addCatInputs = exports.addCatDialog = exports.noEntriesDialog = exports.btnAddAction = exports.btnEditActions = exports.btnDeletetActions = exports.catList = exports.bgCover = void 0;
    exports.bgCover = document.getElementById("bg-cover");
    exports.catList = document.getElementById("cat-list");
    exports.btnDeletetActions = document.getElementsByClassName("delete-action");
    exports.btnEditActions = document.getElementsByClassName("edit-action");
    exports.btnAddAction = document.getElementById("add-cat");
    exports.noEntriesDialog = document.getElementById("no-entries-dialog");
    exports.addCatDialog = document.getElementById("add-cat-interface-dialog");
    exports.addCatInputs = {
        name: document.getElementById("add-new-cat-name-input"),
        color: document.getElementById("add-new-cat-color-input")
    };
    exports.addCatMsgBox = document.getElementById("add-cat-msg-box");
    exports.btnAddCatConfirm = document.getElementById("add-cat-confirmed");
    exports.btnAddCatDeny = document.getElementById("add-cat-denied");
    exports.deleteCatDialog = document.getElementById("confirm-delete-dialog");
    exports.deleteCatName = document.getElementById("delete-cat-name");
    exports.btnDeleteConfirm = document.getElementById("delete-confirmed");
    exports.btnDeleteDeny = document.getElementById("delete-denied");
    exports.default = {};
});
define("helpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cat_validator = exports.ucfirst = exports.normalizeString = exports.fallback_empty = exports.fallbackEmpty = exports.isEmpty = void 0;
    const isEmpty = (param) => {
        if (param instanceof Object) {
            for (const prop in param) {
                if (Object.prototype.hasOwnProperty.call(param, prop))
                    return false;
            }
            return JSON.stringify(param) === JSON.stringify({});
        }
        if (param instanceof Array) {
            return param.length == 0;
        }
        if (param instanceof String || typeof param === "string") {
            return (param === "" || param === void 0 || param === null);
        }
        if (param === void 0 || param === null) {
            return true;
        }
        throw new TypeError("Undefined Object");
    };
    exports.isEmpty = isEmpty;
    function fallbackEmpty(str, fallback) {
        return ((0, exports.isEmpty)(str)) ? fallback : str;
    }
    exports.fallbackEmpty = fallbackEmpty;
    exports.fallback_empty = fallbackEmpty;
    function normalizeString(param, method = "NFD") {
        if ((!param instanceof Number) && (0, exports.isEmpty)(param)) {
            return "";
        }
        return String(param).normalize(method).trim();
    }
    exports.normalizeString = normalizeString;
    function ucfirst(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    exports.ucfirst = ucfirst;
    exports.cat_validator = {
        name: (str) => {
            return /^([a-zA-Z ]{1,64})$/gi.test(str);
        },
        color: (str) => {
            return /^([a-zA-Z ]{1,64})$/gi.test(str);
        }
    };
});
define("components/cat-item", ["require", "exports", "helpers"], function (require, exports, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CatItem {
        constructor({ name, color, id, lastModified }) {
            this._data = { name, color, id, lastModified };
            this._name = name;
            this._color = color;
            this._id = id;
            this.callbacks = {
                edit: (id) => { },
                remove: (id) => { }
            };
            this.elements = {
                "name": document.createElement("td"),
                "color": document.createElement("td"),
                "count": document.createElement("td")
            };
            this.BASE = document.createElement("tr");
            this.BASE.setAttribute("data-item-id", String(this._id));
        }
        get data() {
            return this._data;
        }
        set_name() {
            this.elements["name"].appendChild(document.createTextNode((0, helpers_1.ucfirst)(this._name)));
            this.BASE.appendChild(this.elements["name"]);
        }
        set_color() {
            this.elements["color"].appendChild(document.createTextNode((0, helpers_1.ucfirst)(this._color)));
            this.BASE.appendChild(this.elements["color"]);
        }
        set_count() {
            this.BASE.appendChild(this.elements["count"]);
        }
        set numCount(num) {
            this.elements["count"].innerText = String(num);
        }
        set name(str) {
            this.elements["name"].innerText = (0, helpers_1.ucfirst)(str);
        }
        set color(str) {
            this.elements["color"].innerText = (0, helpers_1.ucfirst)(str);
        }
        set_action() {
            const base = document.createElement("td");
            const div = document.createElement("div");
            const editbtn = document.createElement("button");
            const removebtn = document.createElement("button");
            editbtn.classList.add("action");
            editbtn.classList.add("edit-action");
            editbtn.classList.add("icon-pen");
            editbtn.setAttribute("data-item-id", String(this._id));
            removebtn.classList.add("action");
            removebtn.classList.add("delete-action");
            removebtn.classList.add("icon-trash");
            removebtn.setAttribute("data-item-id", String(this._id));
            div.appendChild(editbtn);
            div.appendChild(removebtn);
            editbtn.addEventListener("click", () => this.callbacks.edit(this._id));
            removebtn.addEventListener("click", () => this.callbacks.remove(this._id));
            base.appendChild(div);
            this.BASE.appendChild(base);
        }
        set onedit(func) {
            this.callbacks.edit = func;
        }
        set onremove(func) {
            this.callbacks.remove = func;
        }
        get html() {
            this.set_count();
            this.set_name();
            this.set_color();
            this.set_action();
            return this.BASE;
        }
    }
    exports.default = CatItem;
});
define("connect/config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const conn = {
        "host": "http://localhost:8000/index.php"
    };
    exports.default = conn;
});
define("components/bg-cover", ["require", "exports", "dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Cover {
        constructor() {
        }
        zIndex(depth) {
            if (depth < 0) {
                throw new TypeError("zIndex cannot be lessthan 0");
            }
            dom_1.bgCover.style.zIndex = String(depth);
        }
        static hide() {
            if (Cover.depth <= 0) {
                return;
            }
            Cover.depth = Cover.depth - 1;
            Cover.__update();
        }
        static show() {
            Cover.depth = Cover.depth + 1;
            Cover.__update();
        }
        static forceShow() {
            Cover.depth = 1;
            Cover.__update();
        }
        static forceHide() {
            Cover.depth = 0;
            Cover.__update();
        }
        static __update() {
            dom_1.bgCover.setAttribute('data-status', (Cover.depth == 0) ? "hide" : "show");
        }
    }
    exports.default = Cover;
    Cover.depth = 0;
});
define("components/confirm-delete-dialog", ["require", "exports", "dom", "helpers"], function (require, exports, dom_2, helpers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ConfirmDeleteDialog {
        constructor({ name, color, id, lastModified }) {
            const self = ConfirmDeleteDialog;
            if (self.is_visible) {
                throw new Error("Close the dialog before reusing it");
            }
            self.name_label.innerText = (0, helpers_2.ucfirst)(name);
            self.dialog.setAttribute("data-id", String(id));
            self.dialog.setAttribute("data-status", "hidden");
            self.dialog.setAttribute("hidden", "hidden");
            self.btn_delete.addEventListener("click", () => self.callbacks['confirm']());
            self.btn_deny.addEventListener("click", () => self.callbacks['cancel']());
        }
        show() {
            const self = ConfirmDeleteDialog;
            self.is_visible = true;
            self.dialog.removeAttribute("hidden");
            self.dialog.setAttribute("data-status", "visible");
        }
        hide() {
            const self = ConfirmDeleteDialog;
            self.is_visible = false;
            self.dialog.setAttribute("hidden", "hidden");
            self.dialog.setAttribute("data-status", "hidden");
        }
        set onconfirm(callback) {
            ConfirmDeleteDialog.callbacks['confirm'] = callback;
        }
        set ondeny(callback) {
            ConfirmDeleteDialog.callbacks['cancel'] = callback;
        }
    }
    exports.default = ConfirmDeleteDialog;
    ConfirmDeleteDialog.is_visible = false;
    ConfirmDeleteDialog.dialog = dom_2.deleteCatDialog;
    ConfirmDeleteDialog.name_label = dom_2.deleteCatName;
    ConfirmDeleteDialog.btn_delete = dom_2.btnDeleteConfirm;
    ConfirmDeleteDialog.btn_deny = dom_2.btnDeleteDeny;
    ConfirmDeleteDialog.callbacks = {
        "confirm": () => { },
        "cancel": () => { }
    };
});
define("connect/delete", ["require", "exports", "connect/config"], function (require, exports, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_1 = __importDefault(config_1);
    exports.default = ({ name, color, id }) => {
        return new Promise((res, rej) => {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("color", color);
            formData.append("mode", "delete");
            formData.append("id", String(id));
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState != 4)
                    return;
                if (xhr.status == 200) {
                    res(JSON.parse(xhr.responseText));
                    return;
                }
                rej(xhr.status);
            });
            xhr.addEventListener("error", (err) => rej(err));
            xhr.open('POST', config_1.default['host'], true);
            xhr.send(formData);
        });
    };
});
define("components/error-dialog", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ErrorDialog {
        constructor() {
            this.base = document.createElement("div");
            this.cover = document.createElement("div");
            this.isDestroyed = false;
            this.no_close_btn = false;
            this.base.style.position = "fixed";
            this.base.style.zIndex = "9999";
            this.base.style.padding = "20px 10px 50px 10px";
            this.base.style.margin = "0";
            this.base.style.backgroundColor = "#f0f0f0";
            this.base.style.left = "50%";
            this.base.style.top = "50%";
            this.base.style.transform = "translate(-50%, -50%)";
            this.base.style.border = "1px solid rgb(172, 172, 174)";
            this.base.style.textAlign = "center";
            this.base.style.borderRadius = "14px";
            this.base.style.boxShadow = "1px 4px 8px rgba(52, 52, 54, 0.2)";
            this.base.style.minHeight = "200px";
            this.base.style.minWidth = "200px";
            this.base.style.maxHeight = "90vh";
            this.base.style.maxWidth = "inherit";
            this.base.style.width = "85%";
            this.base.style.overflowY = "hidden";
            this.cover.style.backgroundColor = "#000";
            this.cover.style.position = "fixed";
            this.cover.style.zIndex = "9998";
            this.cover.style.width = "100vw";
            this.cover.style.height = "100vh";
            this.cover.style.opacity = "0.4";
        }
        remove() {
            this.base.remove();
            this.cover.remove();
            this.isDestroyed = true;
        }
        no_rm() {
            this.no_close_btn = true;
        }
        addCloseBtn() {
            const btn = document.createElement("button");
            btn.style.position = "absolute";
            btn.style.bottom = "10px";
            btn.style.left = "50%";
            btn.style.transform = "translateX(-50%)";
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
            });
            this.base.appendChild(btn);
        }
        set msg(msg) {
            if (this.isDestroyed)
                throw new TypeError("Cannot append new message. Please, reinitialize the object.");
            const p = document.createElement("p");
            p.style.margin = "0";
            p.style.padding = "4px";
            p.style.boxSizing = "border-box";
            p.style.textAlign = "left";
            p.style.textIndent = "0";
            p.style.whiteSpace = "normal";
            p.style.overflowY = "scroll";
            p.style.color = "var(--text-color)";
            p.appendChild(document.createTextNode(String(msg)));
            this.base.append(p);
        }
        show(interval = 0) {
            if (!this.no_close_btn) {
                this.addCloseBtn();
            }
            document.body.appendChild(this.cover);
            document.body.appendChild(this.base);
            if (interval == 0) {
                return;
            }
            let last, current_time;
            last = new Date().getTime();
            let ival = window.setInterval(() => {
                current_time = new Date().getTime();
                if (this.isDestroyed) {
                    clearInterval(ival);
                }
                if (!this.isDestroyed && (current_time - last) >= interval) {
                    this.fadeOut(this.remove.bind(this));
                    clearInterval(ival);
                }
            }, 10);
        }
        fadeOut(callback) {
            let initial_time = new Date().getTime();
            let opa;
            let ival = window.setInterval(() => {
                opa = (1 - (((new Date().getTime() - initial_time) / ErrorDialog.fadeOutInterval)));
                if (opa >= 0) {
                    this.base.style.opacity = String(opa.toFixed(4));
                }
                else {
                    this.base.style.opacity = "0";
                    (callback || function () { })();
                    clearInterval(ival);
                }
            }, 1);
        }
    }
    exports.default = ErrorDialog;
    ErrorDialog.fadeOutInterval = 1000;
});
define("components/edit-dialog", ["require", "exports", "dom"], function (require, exports, dom_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EditDialog {
        constructor({ name, id, color, lastModified }) {
            const self = EditDialog;
            if (self.is_open || !self.is_destroyed) {
                throw new Error("Unable to reinitialize if there was an open dialog");
            }
            self.is_destroyed = false;
            self.dialog.setAttribute("hidden", "hidden");
            self.msgBox(false);
            self.name_input.value = name;
            self.color_input.value = color;
            self.cancel_btn.addEventListener("click", self.cc_cancel);
            self.confirm_btn.addEventListener("click", self.cc_confirm);
        }
        static cc_cancel() {
            EditDialog.callbacks['cancel']();
        }
        static cc_confirm() {
            const color = EditDialog.color_input.value;
            const name = EditDialog.name_input.value;
            EditDialog.callbacks['confirm']({ color, name });
        }
        static msgBox(msg) {
            if (typeof msg == 'boolean') {
                EditDialog.msg_dialog.style.display = (msg) ? 'initial' : "none";
                return;
            }
            EditDialog.msg_dialog.innerText = String(msg);
        }
        set_btn_names({ confirm, cancel }) {
            EditDialog.confirm_btn.innerText = confirm;
            EditDialog.cancel_btn.innerText = cancel;
        }
        show() {
            const self = EditDialog;
            self.dialog.removeAttribute("hidden");
            self.is_open = true;
        }
        hide() {
            const self = EditDialog;
            self.dialog.setAttribute("hidden", "hidden");
            self.is_open = false;
        }
        set onconfirm(callback) {
            EditDialog.callbacks['confirm'] = callback;
        }
        set oncancel(callback) {
            EditDialog.callbacks['cancel'] = callback;
        }
        cancel() {
            EditDialog.cc_cancel();
        }
        confirm() {
            EditDialog.cc_confirm();
        }
        destroy() {
            EditDialog.confirm_btn.innerText = "";
            EditDialog.cancel_btn.innerText = "";
            EditDialog.cancel_btn.removeEventListener("click", EditDialog.cc_cancel);
            EditDialog.confirm_btn.removeEventListener("click", EditDialog.cc_confirm);
            EditDialog.is_destroyed = true;
        }
    }
    exports.default = EditDialog;
    EditDialog.dialog = dom_3.addCatDialog;
    EditDialog.name_input = dom_3.addCatInputs['name'];
    EditDialog.color_input = dom_3.addCatInputs['color'];
    EditDialog.msg_dialog = dom_3.addCatMsgBox;
    EditDialog.confirm_btn = dom_3.btnAddCatConfirm;
    EditDialog.cancel_btn = dom_3.btnAddCatDeny;
    EditDialog.is_open = false;
    EditDialog.callbacks = { confirm() { }, cancel() { } };
    EditDialog.is_destroyed = true;
});
define("connect/update", ["require", "exports", "connect/config"], function (require, exports, config_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_2 = __importDefault(config_2);
    exports.default = ({ name, color, id }) => {
        return new Promise((res, rej) => {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("color", color);
            formData.append("mode", "modify");
            formData.append("id", String(id));
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState != 4)
                    return;
                if (xhr.status == 200) {
                    res(JSON.parse(xhr.responseText));
                    return;
                }
                rej(xhr.status);
            });
            xhr.addEventListener("error", (err) => rej(err));
            xhr.open('POST', config_2.default['host'], true);
            xhr.send(formData);
        });
    };
});
define("components/cat-table", ["require", "exports", "components/cat-item", "connect/config", "helpers", "dom", "components/bg-cover", "components/confirm-delete-dialog", "connect/delete", "components/error-dialog", "components/edit-dialog", "connect/update"], function (require, exports, cat_item_1, config_3, helpers_3, dom_4, bg_cover_1, confirm_delete_dialog_1, delete_1, error_dialog_1, edit_dialog_1, update_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cat_item_1 = __importDefault(cat_item_1);
    config_3 = __importDefault(config_3);
    bg_cover_1 = __importDefault(bg_cover_1);
    confirm_delete_dialog_1 = __importDefault(confirm_delete_dialog_1);
    delete_1 = __importDefault(delete_1);
    error_dialog_1 = __importDefault(error_dialog_1);
    edit_dialog_1 = __importDefault(edit_dialog_1);
    update_1 = __importDefault(update_1);
    class CatTable {
        constructor() {
            this.fatal_stop = false;
            this.callbacks = {
                "error": () => { },
                "update": () => { }
            };
            if (CatTable.hasInit) {
                throw new Error("Unable to reinitialize CatTable");
            }
        }
        event_add(data) {
            CatTable.items[data["id"]] = new cat_item_1.default(data);
            CatTable.items[data["id"]].onedit = this.event_edit_item.bind(this);
            CatTable.items[data["id"]].onremove = this.event_delete_item.bind(this);
            dom_4.catList.appendChild(CatTable.items[data["id"]].html);
        }
        event_delete_item(id) {
            const dd = new confirm_delete_dialog_1.default(CatTable.items[id].data);
            bg_cover_1.default.show();
            dd.show();
            let is_on_transac = false;
            dd.ondeny = () => {
                if (is_on_transac)
                    return;
                dd.hide();
                bg_cover_1.default.hide();
            };
            dd.onconfirm = () => {
                is_on_transac = true;
                (0, delete_1.default)(CatTable.items[id].data)
                    .then((res) => {
                    is_on_transac = false;
                    if (res.hasOwnProperty("mode") && res["mode"] == "delete" && res["status"] == "success") {
                        dd.hide();
                        bg_cover_1.default.hide();
                        return;
                    }
                    throw new Error("Unexpected things happened");
                }).catch((err) => {
                    is_on_transac = false;
                    if (err.toString() == 404) {
                        return;
                    }
                    const erd = new error_dialog_1.default();
                    erd.msg = err.toString();
                    erd.show(3000);
                });
            };
        }
        event_edit_item(id) {
            const ed = new edit_dialog_1.default(CatTable.items[id].data);
            const data = Object.assign({}, CatTable.items[id].data);
            let is_on_transac = false;
            ed.set_btn_names({
                confirm: "Update",
                cancel: "Cancel"
            });
            bg_cover_1.default.show();
            ed.show();
            ed.oncancel = () => {
                if (is_on_transac)
                    return;
                ed.hide();
                bg_cover_1.default.hide();
                ed.destroy();
            };
            ed.onconfirm = ({ name, color }) => {
                edit_dialog_1.default.msgBox(false);
                if (!(helpers_3.cat_validator.name(name) && helpers_3.cat_validator.color(color))) {
                    edit_dialog_1.default.msgBox("Fill up the form accordingly");
                    edit_dialog_1.default.msgBox(true);
                    return;
                }
                data.name = name;
                data.color = color;
                (0, update_1.default)(data)
                    .then((res) => {
                    is_on_transac = false;
                    if (res.hasOwnProperty("mode") && res["mode"] == "modify" && res["status"] == "success") {
                        ed.hide();
                        bg_cover_1.default.hide();
                        ed.destroy();
                        return;
                    }
                    throw new Error("Unexpected things happened");
                }).catch((err) => {
                    is_on_transac = false;
                    const erd = new error_dialog_1.default();
                    if (err.toString() == '404') {
                        erd.msg = "Opsss... That item doesn't exists anymore";
                    }
                    else {
                        erd.msg = err.toString();
                    }
                    erd.show(3000);
                });
            };
        }
        event_delete(id) {
            CatTable.items[id].html.remove();
            delete CatTable.items[id];
        }
        event_modify(data) {
            CatTable.items[data["id"]].name = (0, helpers_3.ucfirst)(data["name"]);
            CatTable.items[data["id"]].color = (0, helpers_3.ucfirst)(data["color"]);
        }
        listen() {
            CatTable.worker.addEventListener("message", (evt) => {
                switch (evt.data['type']) {
                    case 'added':
                        this.event_add(evt.data["body"]["content"]);
                        this.callbacks["update"](evt.data["body"]["content"]);
                        this.update_num_list();
                        break;
                    case 'modified':
                        this.event_modify(evt.data["body"]["content"]);
                        this.callbacks["update"](evt.data["body"]["content"]);
                        break;
                    case 'deleted':
                        this.event_delete(evt.data["body"]["id"]);
                        this.callbacks["update"](evt.data["body"]["id"]);
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
            });
        }
        send_command(msg) {
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
        update_num_list() {
            Object.values(CatTable.items).forEach((item, index) => item.numCount = index + 1);
        }
        set onupdate(callback) {
            this.callbacks["update"] = callback;
        }
        set onerror(callback) {
            this.callbacks["error"] = callback;
        }
    }
    exports.default = CatTable;
    CatTable.worker = new Worker("./worker.js");
    CatTable.worker_config = {
        interval: 1000,
        pulse: 10,
        host: config_3.default.host,
        stop_on_error: true
    };
    CatTable.items = {};
    CatTable.hasInit = false;
});
define("connect/send", ["require", "exports", "connect/config"], function (require, exports, config_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_4 = __importDefault(config_4);
    exports.default = ({ name, color }) => {
        return new Promise((res, rej) => {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("color", color);
            formData.append("mode", "insert");
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState != 4)
                    return;
                if (xhr.status == 200) {
                    res(JSON.parse(xhr.responseText));
                    return;
                }
                rej(xhr.status);
            });
            xhr.addEventListener("error", (err) => rej(err));
            xhr.open('POST', config_4.default['host'], true);
            xhr.send(formData);
        });
    };
});
define("components/add-cat-dialog", ["require", "exports", "components/edit-dialog", "components/bg-cover", "helpers", "connect/send"], function (require, exports, edit_dialog_2, bg_cover_2, helpers_4, send_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    edit_dialog_2 = __importDefault(edit_dialog_2);
    bg_cover_2 = __importDefault(bg_cover_2);
    send_1 = __importDefault(send_1);
    const EMPTY_FIELD = "Oppsss... Either field cannot be empty and must contain only letters and/or dash '-'";
    class AddCat {
        constructor() {
            if (AddCat.hasBeenCalled)
                throw new Error("AddCat cannot be reinitiate");
            AddCat.hasBeenCalled = true;
        }
        activate() {
            const ed = new edit_dialog_2.default({ name: "", color: "", id: 0, lastModified: "" });
            let is_on_transac = false;
            const oncomplete = () => {
                is_on_transac = false;
            };
            ed.set_btn_names({ confirm: "Insert", cancel: "Cancel" });
            bg_cover_2.default.show();
            ed.show();
            ed.oncancel = () => {
                if (is_on_transac)
                    return;
                ed.hide();
                ed.destroy();
                bg_cover_2.default.hide();
            };
            ed.onconfirm = ({ name, color }) => {
                is_on_transac = true;
                this.__verifyInputs({ name, color, ed, oncomplete });
            };
        }
        __verifyInputs(inputs) {
            edit_dialog_2.default.confirm_btn.innerText = "";
            edit_dialog_2.default.confirm_btn.classList.add("on-progress");
            edit_dialog_2.default.name_input.setAttribute("disabled", "disable");
            edit_dialog_2.default.color_input.setAttribute("disabled", "disable");
            let name_value = (0, helpers_4.normalizeString)(inputs['name']);
            let color_value = (0, helpers_4.normalizeString)(inputs['color']);
            let validated_name = helpers_4.cat_validator.name(name_value);
            let validated_color = helpers_4.cat_validator.color(color_value);
            if (!(validated_name && validated_color)) {
                edit_dialog_2.default.msgBox(true);
                edit_dialog_2.default.msgBox(EMPTY_FIELD);
                if (!validated_name)
                    edit_dialog_2.default.name_input.focus();
                else if (!validated_color)
                    edit_dialog_2.default.color_input.focus();
                edit_dialog_2.default.confirm_btn.classList.remove("on-progress");
                edit_dialog_2.default.confirm_btn.innerText = "Insert";
                edit_dialog_2.default.name_input.removeAttribute("disabled");
                edit_dialog_2.default.color_input.removeAttribute("disabled");
                (inputs['oncomplete'] || function () { })();
                return;
            }
            edit_dialog_2.default.msgBox(false);
            (0, send_1.default)({
                name: name_value,
                color: color_value
            }).then((res) => {
                (inputs['oncomplete'] || function () { })();
                edit_dialog_2.default.confirm_btn.classList.remove("on-progress");
                if (res.hasOwnProperty("mode") && res["mode"] == "insert" && res["status"] == "success") {
                    inputs["ed"].cancel();
                }
                else {
                    edit_dialog_2.default.msgBox("Please, fill up the form accordingly");
                }
            }).catch((err) => {
                edit_dialog_2.default.confirm_btn.classList.remove("on-progress");
                edit_dialog_2.default.msgBox(err.toString());
                (inputs['oncomplete'] || function () { })();
            });
        }
    }
    exports.default = AddCat;
    AddCat.hasBeenCalled = false;
    AddCat.isOpen = false;
});
define("index", ["require", "exports", "dom", "components/cat-table", "components/error-dialog", "components/add-cat-dialog"], function (require, exports, dom_5, cat_table_1, error_dialog_2, add_cat_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cat_table_1 = __importDefault(cat_table_1);
    error_dialog_2 = __importDefault(error_dialog_2);
    add_cat_dialog_1 = __importDefault(add_cat_dialog_1);
    if (window.Worker) {
        const ct = new cat_table_1.default();
        ct.start();
        ct.listen();
        ct.onerror = (err) => {
            const ed = new error_dialog_2.default();
            ed.no_rm();
            ed.msg = err["type"] + ": Does stop during runtime";
            ed.msg = err["body"];
            ed.show(0);
        };
        document.addEventListener("visibilitychange", () => {
            ct.send_command((document.hidden ? "pause" : "resume"));
        });
    }
    else {
        const ed = new error_dialog_2.default();
        ed.no_rm();
        ed.msg = "Unable to run";
        ed.msg = "Web worker is not available";
        ed.show(0);
        throw new Error("Unable to start. Web worker is not available");
    }
    const acd = new add_cat_dialog_1.default();
    dom_5.btnAddAction.addEventListener("click", () => {
        acd.activate();
    });
});
define("connect/get-item", ["require", "exports", "connect/config"], function (require, exports, config_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_5 = __importDefault(config_5);
    exports.default = (id) => {
        return new Promise((resolve, reject) => {
            let base_url = config_5.default['host'];
            fetch(`${base_url}?id=${id}`, {
                "method": "GET",
                "cache": "no-cache"
            }).then((res) => res.json())
                .then(resolve)
                .catch(reject);
        });
    };
});
//# sourceMappingURL=index.js.map