import {
    addCatDialog,
    addCatInputs,
    addCatMsgBox,
    btnAddCatConfirm,
    btnAddCatDeny
} from '../dom';
import {
    cat_validator as validate
} from '../helpers';


export default class EditDialog {
    
    private static dialog:HTMLDivElement = <HTMLDivElement> addCatDialog;
    private static name_input:HTMLInputElement = <HTMLInputElement> addCatInputs['name'];
    private static color_input:HTMLInputElement = <HTMLInputElement> addCatInputs['color'];
    private static msg_dialog:HTMLDivElement = <HTMLDivElement> addCatMsgBox;
    private static confirm_btn:HTMLButtonElement = <HTMLButtonElement> btnAddCatConfirm;
    private static cancel_btn:HTMLButtonElement = <HTMLButtonElement> btnAddCatDeny;
    private static is_open:boolean = false;
    private static callbacks:{[key:string]:Function} = {
        "confirm": () => {},
        "cancel": () => {}
    }
    private static is_destroyed:boolean = true;
    
    constructor({name, id, color, lastModified}:CatInterface) {
        const self = EditDialog;
        if(self.is_open || ! self.is_destroyed) {
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
    
    /**
     * Events handler
     * */
    private static cc_cancel():void {
        EditDialog.callbacks['cancel']();
    }
    
    private static cc_confirm():void {
        const color = EditDialog.color_input.value;
        const name = EditDialog.name_input.value;
        
        EditDialog.callbacks['confirm']({color, name} as {[key:string]:string});
    }
    
    static msgBox(msg:string|boolean):void {
        if(typeof msg == 'boolean') {
            // true = show
            // false = hide
            EditDialog.msg_dialog.style.display = (msg) ? 'initial': "none";
            return;
        }
        
        EditDialog.msg_dialog.innerText = String(msg);
    }
    
    set_btn_names({confirm, cancel}:{[key:string]:string}):void {
        EditDialog.confirm_btn.innerText = confirm;
        EditDialog.cancel_btn.innerText = cancel;
    }
    
    show():void {
        const self = EditDialog;
        self.dialog.removeAttribute("hidden");
        self.is_open = true;
    }
    
    hide():void {
        const self = EditDialog;
        self.dialog.setAttribute("hidden", "hidden");
        self.is_open = false
    }
    
    set onconfirm(callback:Function) {
        EditDialog.callbacks['confirm'] = callback;
    }
    
    set oncancel(callback:Function) {
        EditDialog.callbacks['cancel'] = callback;
    }
    
    destroy():void {
        EditDialog.confirm_btn.innerText = "";
        EditDialog.cancel_btn.innerText = "";
        EditDialog.cancel_btn.removeEventListener("click", EditDialog.cc_cancel);
        EditDialog.confirm_btn.removeEventListener("click", EditDialog.cc_confirm);
        EditDialog.is_destroyed = true;
    }
}



