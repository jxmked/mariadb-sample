import EditDialog from './edit-dialog';
import Cover from './bg-cover';
import { normalizeString, cat_validator as validate } from '../helpers';
import sendData from '../connect/send';

const EMPTY_FIELD = "Oppsss... Either field cannot be empty and must contain only letters and/or dash '-'";

export default class AddCat {
    private static hasBeenCalled:boolean = false; 
    private static isOpen:boolean = false;
    
    constructor() {
        if(AddCat.hasBeenCalled)
            throw new Error("AddCat cannot be reinitiate");
        
        AddCat.hasBeenCalled = true;
    }

    activate():void {
        const ed = new EditDialog({name:"", color:"", id:0, lastModified:""});
        let is_on_transac = false;
        
        const oncomplete = () => {
            is_on_transac = false;
        };
        
        ed.set_btn_names({confirm:"Insert", cancel:"Cancel"});
        
        // Highlight our form
        Cover.show();
        ed.show();
        
        ed.oncancel = () => {
            if(is_on_transac) return;

            ed.hide();
            ed.destroy();
            Cover.hide();

        };

        ed.onconfirm = ({name, color}) => {
            is_on_transac = true;
            this.__verifyInputs({name, color, ed, oncomplete});
        }


    }

    private __verifyInputs(inputs:{name:string, color:string, ed:EditDialog, oncomplete:Function}):void {
        EditDialog.confirm_btn.innerText = "";
        EditDialog.confirm_btn.classList.add("on-progress");

        // Hold Our inputs 
        EditDialog.name_input.setAttribute("disabled", "disable");
        EditDialog.color_input.setAttribute("disabled", "disable");
        
        // Normalize
        let name_value:string = normalizeString(inputs['name']);
        let color_value:string = normalizeString(inputs['color']);
        
        // Validated result
        let validated_name:boolean = validate.name(name_value);
        let validated_color:boolean = validate.color(color_value);
        
        if(! (validated_name && validated_color)) {
            EditDialog.msgBox(true);
            EditDialog.msgBox(EMPTY_FIELD);
            
            /**
             * Add focus on either inputs with error
             * */
            if(! validated_name)
                EditDialog.name_input.focus();
            else if(! validated_color)
                EditDialog.color_input.focus();
                
            EditDialog.confirm_btn.classList.remove("on-progress");
            EditDialog.confirm_btn.innerText = "Insert";
            EditDialog.name_input.removeAttribute("disabled");
            EditDialog.color_input.removeAttribute("disabled");
            (inputs['oncomplete']||function(){})();
            return;
        }

        EditDialog.msgBox(false);
        
        /**
         * Send New Data
         * 
         * */
        sendData({
            name:name_value,
            color:color_value
        }).then((res) => {
            (inputs['oncomplete']||function(){})();
            EditDialog.confirm_btn.classList.remove("on-progress");
            
            if(res.hasOwnProperty("mode") && res["mode"] == "insert" && res["status"] == "success") {
                inputs["ed"].cancel();
            } else {
                EditDialog.msgBox("Please, fill up the form accordingly");
            }
        }).catch((err) => {
            EditDialog.confirm_btn.classList.remove("on-progress");
            EditDialog.msgBox(err.toString());
            (inputs['oncomplete']||function(){})();
        });
    }
}
