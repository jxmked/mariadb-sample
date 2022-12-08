import {
    addCatDialog,
    addCatInputs,
    addCatMsgBox,
    btnAddCatConfirm,
    btnAddCatDeny
} from '../dom';

import Cover from './bg-cover';
import normalizeStr from '../helpers/string/normalize';

export default class AddCat {
    private static hasBeenCalled:boolean = false; 

    constructor() {
    }

    openEventListeners():void {
        btnAddCatConfirm.addEventListener("click", this.__verifyInputs.bind(this));
        btnAddCatDeny.addEventListener("click",this.__btnCatDeny.bind(this));
    }

    closeEventListeners():void {
        btnAddCatConfirm.removeEventListener("click", this.__verifyInputs.bind(this));
        btnAddCatDeny.removeEventListener("click", this.__btnCatDeny.bind(this));
    }

    activate() {
        // Highlight our form
        Cover.show();
        
        addCatDialog.removeAttribute("hidden");
        this.msgBox(false);
        this.openEventListeners();
    }

    deactivate():void {
        this.closeEventListeners();
        btnAddCatConfirm.classList.remove("on-progress");
        addCatDialog.setAttribute("hidden", "hidden");
        this.msgBox(false);
        Cover.hide();
    }

    private msgBox(msg:boolean|string):void {
        addCatMsgBox.innerHTML = "";

        if(msg === true || msg === false) {
            // true - show
            // false - hide
            console.log(msg)
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
         * Allow letters and a single dash in between of letters
         */
        const pattern = /^([a-zA-Z\s]+)(\-[a-zA-Z\s]+)?$/gi
        
        return pattern.test(str);
    }

    private __verifyInputs():void {
        btnAddCatConfirm.classList.add("on-progress");
        
        // Get all inputs
        const {name, color} = addCatInputs;

        // Normalize
        let name_value = normalizeStr(name.value);
        let color_value = normalizeStr(color.value);

        if(! (this.__isValidInput(name_value) && this.__isValidInput(color_value))) {
            this.msgBox(true);
            this.msgBox("Oppsss... Either field cannot be empty and must contain only letters and/or dash '-'.");
            btnAddCatConfirm.classList.remove("on-progress");
            return;
        }

        this.msgBox(false);

        // Inputs are validated
        /**
         * Ready to validate by our API and return the response.
         * 
         */
    }

    private __btnCatDeny():void {
        // Clear inputs
        const {name, color} = addCatInputs;
        name.value = "";
        color.value = "";

        this.deactivate();
    }
}
