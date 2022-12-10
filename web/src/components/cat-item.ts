
/**

<tr data-item-id="{id}">
    <td>{count}</td>
    <td>{name}</td>
    <td>{color}</td>
    <td>
        <div>
            <button class="action edit-action icon-pen" data-item-id="{id}"></button>
            <button class="action delete-action icon-trash" data-item-id="{id}"></button>
        </div>
    </td>
</tr>
**/



import { ucfirst } from '../helpers';


export default class CatItem {
    
    private name:string;
    private color:string;
    private id:number;
    private last_modified_date:string;
    private BASE:HTMLTableRowElement;
    
    public static count:number = 0;
    private myCount:HTMLTableCellElement;

    private callbacks:{
        edit:(id:number) => void;
        remove:(id:number) => void;
    }
    
    constructor({name, color, id, lastModified}:CatInterface) {
        this.name = name;
        this.color = color;
        this.id = id;
        this.last_modified_date = lastModified;
        this.callbacks = {
            edit:(id:number) => {},
            remove:(id:number) => {}
        };

        this.myCount = document.createElement("td");
        // Our counting system
        CatItem.count++;
        
        // Initial Number
        // Will be overwrite after dom manipulation
        this.myCount.innerText = String(CatItem.count);
        
        this.BASE = document.createElement("tr") as HTMLTableRowElement;
        this.BASE.setAttribute("data-item-id", String(this.id));
        
    }
    
    private set_name():void {
        const td:HTMLTableCellElement = document.createElement("td");
        
        td.appendChild(document.createTextNode(ucfirst(this.name)));
        
        this.BASE.appendChild(td);
    }
    
    private set_color():void {
        const td:HTMLTableCellElement = document.createElement("td");
        
        td.appendChild(document.createTextNode(ucfirst(this.color)));
        
        this.BASE.appendChild(td);
    }
    
    private set_count():void {
        /**
         * Makinh InnerText of this Table row accessible to modify
         * */
       // this.myCount.appendChild(document.createTextNode(String(this.myCount)));

        this.BASE.appendChild(this.myCount);
    }
    
    set numCount(num:number) {
        /**
         * We can update numbering system manually during 
         * list manipulation
         * 
         * */
        this.myCount.innerText = String(num);
    }

    private set_action():void {
        const base:HTMLTableCellElement = document.createElement("td");
        const div:HTMLDivElement = document.createElement("div");
        
        const editbtn:HTMLButtonElement = document.createElement("button");
        const removebtn:HTMLButtonElement = document.createElement("button");
        
        /**
         * Define attributes
         * 
         * */
         
        editbtn.classList.add("action");
        editbtn.classList.add("edit-action");
        editbtn.classList.add("icon-pen");
        
        editbtn.setAttribute("data-item-id", String(this.id));
        
        removebtn.classList.add("action");
        removebtn.classList.add("delete-action");
        removebtn.classList.add("icon-trash");
        
        removebtn.setAttribute("data-item-id", String(this.id));
        
        // Construct
        
        div.appendChild(editbtn);
        div.appendChild(removebtn);
        
        base.appendChild(div);
        
        // Event handlers
        editbtn.addEventListener("click", () => this.callbacks.edit(this.id));
        removebtn.addEventListener("click", () => this.callbacks.remove(this.id));
        
        this.BASE.appendChild(base);
    }
    
    /**
     * Set Function for Event Handlers in set actions
     * */
    
    set onEdit(func:(id:number) => void) {
        this.callbacks.edit = func;
    }
    
    set onRemove(func:(id:number) => void) {
        this.callbacks.remove = func;
    }
    
    get html():HTMLTableRowElement {
        this.set_count();
        this.set_name();
        this.set_color();
        this.set_action();
        
        return this.BASE;
    }
}



