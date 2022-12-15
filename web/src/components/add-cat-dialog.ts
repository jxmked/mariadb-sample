import {
    addCatDialog,
    addCatInputs,
    addCatMsgBox,
    btnAddCatConfirm,
    btnAddCatDeny,
    catList
} from '../dom';

import CatItem from 'cat-item';
import Cover from './bg-cover';
import { normalizeString } from '../helpers';
import sendData from '../connect/send';
const EMPTY_FIELD = "Oppsss... Either field cannot be empty and must contain only letters and/or dash '-'";

export default class AddCat {
    private static hasBeenCalled:boolean = false; 
    private static isOpen:boolean = false;
    
    private btnCancel;
    private btnInsert;
    
    constructor() {
        if(AddCat.hasBeenCalled)
            throw new Error("AddCat cannot be reinitiate");
        
        AddCat.hasBeenCalled = true;
        
        /**
         * We are not able to actually remove the event listener
         * if we redefine the function that we used to.
         * */
        this.btnCancel = this.__btnCatDeny.bind(this);
        this.btnInsert = this.__verifyInputs.bind(this);
    }

    openEventListeners():void {
        /**
         * Only add event listener if the AddCat form is active.
         * */
        btnAddCatConfirm.addEventListener("click", this.btnInsert);
        btnAddCatDeny.addEventListener("click",this.btnCancel);
    }

    closeEventListeners():void {
        /**
         * Remove event listener if we're done with AddCat form.
         * We also use this form for another transaction.
         * */
        btnAddCatConfirm.removeEventListener("click", this.btnInsert);
        btnAddCatDeny.removeEventListener("click", this.btnCancel);
    }

    activate() {
        // Highlight our form
        Cover.show();
        
        addCatDialog.removeAttribute("hidden");
        btnAddCatConfirm.innerText = "Insert";
        btnAddCatDeny.innerText = "Cancel";
        
        this.msgBox(false);
        this.openEventListeners();
    }

    deactivate():void {
        this.closeEventListeners();
        btnAddCatConfirm.classList.remove("on-progress");
        addCatDialog.setAttribute("hidden", "hidden");
        
        // Reset
        btnAddCatConfirm.innerText = "";
        btnAddCatDeny.innerText = "";
        
        this.msgBox(false);
        Cover.hide();
    }

    private msgBox(msg:boolean|string):void {
        addCatMsgBox.innerHTML = "";

        if(msg === true || msg === false) {
            // true - show
            // false - hide
            addCatMsgBox.style.display = (msg === true) ? "initial" : "none";
            
            return;
        }

        addCatMsgBox.appendChild(document.createTextNode(msg));
    }

    /**
     * Wait for buttons to be clicked before to verify the inputs
     */

    private __isValidInput(str:string):boolean {
        /**
         * 
         * Allow letters and space character
         */
        const pattern = /^([a-zA-Z ]{1,64})$/gi
        
        return pattern.test(str);
    }

    private async __verifyInputs():Promise<void> {
        btnAddCatConfirm.innerText = "";
        btnAddCatConfirm.classList.add("on-progress");
        
        // Get all inputs
        const {name, color} = addCatInputs;
        
        // Hold Our inputs 
        name.setAttribute("disabled", "disable");
        color.setAttribute("disabled", "disable");
        
        // Normalize
        let name_value:string = normalizeString(name.value);
        let color_value:string = normalizeString(color.value);
        
        // Validated result
        let validated_name:boolean = this.__isValidInput(name_value);
        let validated_color:boolean = this.__isValidInput(color_value);
        
        if(! (validated_name && validated_color)) {
            this.msgBox(true);
            this.msgBox(EMPTY_FIELD);
            
            /**
             * Add focus on either inputs with error
             * */
            if(! validated_name)
                name.focus();
            else if(! validated_color)
                color.focus();
                
            btnAddCatConfirm.classList.remove("on-progress");
            btnAddCatConfirm.innerText = "Insert";
            name.removeAttribute("disabled");
            color.removeAttribute("disabled");
            
            return;
        }

        this.msgBox(false);
        
        /**
         * Send New Data
         * 
         * */
        sendData({
            name:name_value,
            color:color_value
        }).then((res) => {
            if(res.hasOwnProperty("mode") && res["mode"] == "insert" && res["status"] == "success") {
                this.__btnCatDeny();
                this.btnCancel();
            } else {
                this.msgBox("Please, fill up the form accordingly");
                /**
                 * Remove animating 'insert' text 
                 * */
                btnAddCatConfirm.classList.remove("on-progress");
            }
        }).catch((err) => {
            this.msgBox(err.toString());
        });
    }

    private __btnCatDeny():void {
        // Clear inputs
        const {name, color} = addCatInputs;
        name.value = "";
        color.value = "";
        name.removeAttribute("disabled");
        color.removeAttribute("disabled");
        
        this.deactivate();
    }
}
