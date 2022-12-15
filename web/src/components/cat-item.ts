
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
    
    private _name:string;
    private _color:string;
    private _id:number;
    private BASE:HTMLTableRowElement;    
    private elements:{
        name:HTMLTableCellElement;
        color:HTMLTableCellElement;
        count:HTMLTableCellElement;
    };
    
    private callbacks:{
        edit:(id:number) => void;
        remove:(id:number) => void;
    }
    
    private _data:CatInterface;
   
    constructor({name, color, id, lastModified}:CatInterface) {
        this._data = {name, color, id, lastModified};
        
        this._name = name;
        this._color = color;
        this._id = id;
        this.callbacks = {
            edit:(id:number) => {},
            remove:(id:number) => {}
        };
        
        this.elements = {
            "name" : document.createElement("td"),
            "color" : document.createElement("td"),
            "count" : document.createElement("td")
        };
        
        this.BASE = document.createElement("tr") as HTMLTableRowElement;
        this.BASE.setAttribute("data-item-id", String(this._id));
    }
    
    get data(): CatInterface {
        return this._data;
    }
    
    private set_name():void {
        this.elements["name"].appendChild(document.createTextNode(ucfirst(this._name)));
        this.BASE.appendChild(this.elements["name"]);
    }
    
    private set_color():void {
        this.elements["color"].appendChild(document.createTextNode(ucfirst(this._color)));
        this.BASE.appendChild(this.elements["color"]);
    }
    
    private set_count():void {
        this.BASE.appendChild(this.elements["count"]);
    }
    
    set numCount(num:number) {
        this.elements["count"].innerText = String(num);
    }

    set name(str:string) {
        this.elements["name"].innerText = ucfirst(str);
    } 

    set color(str:string) {
        this.elements["color"].innerText = ucfirst(str);
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
        editbtn.setAttribute("data-item-id", String(this._id));
        
        removebtn.classList.add("action");
        removebtn.classList.add("delete-action");
        removebtn.classList.add("icon-trash");
        removebtn.setAttribute("data-item-id", String(this._id));
        
        // Construct
        div.appendChild(editbtn);
        div.appendChild(removebtn);
        
        // Event handlers
        editbtn.addEventListener("click", () => this.callbacks.edit(this._id));
        removebtn.addEventListener("click", () => this.callbacks.remove(this._id));
        
        base.appendChild(div);
        this.BASE.appendChild(base);
    }
    
    /**
     * Set Function for Event Handlers in set actions
     * */
    set onedit(func:(id:number) => void) {
        this.callbacks.edit = func;
    }
    
    set onremove(func:(id:number) => void) {
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
