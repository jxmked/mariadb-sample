import {
    addCatDialog,
    addCatInputs,
    addCatMsgBox,
    btnAddCatConfirm,
    btnAddCatDeny
} from '../dom';

import Cover from './bg-cover';
import normalizeStr from '../helpers/string/normalize';


const EMPTY_FIELD = "Oppsss... Either field cannot be empty and must contain only letters and/or dash '-'";



export default class AddCat {
    private static hasBeenCalled:boolean = false; 
    private static isOpen:boolean = false;
    
    private btnCancel;
    private btnInsert;
    
    
    static hakdog = 0;
    
    
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
            console.log(AddCat.hakdog++)
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
        let name_value:string = normalizeStr(name.value);
        let color_value:string = normalizeStr(color.value);
        
        // Validated result
        let validated_name:boolean = this.__isValidInput(name_value);
        let validated_color:boolean = this.__isValidInput(color_value);
        
        //console.log(validated_name, validated_color)
        
        if(! (validated_name && validated_color)) {
            this.msgBox(true);
            this.msgBox(EMPTY_FIELD);
            
            /**
             * Add focus on either input with error
             * */
            if(! validated_name)
                name.focus();
            else if(! validated_color)
                color.focus();
            
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
