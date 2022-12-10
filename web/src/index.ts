import {
    btnDeleteConfirm,
    btnDeleteDeny,
    btnAddAction,
    catList,
    btnDeletetActions
} from './dom';

import Cover from './components/bg-cover';
import AddCat from './components/add-cat-dialog'; 
import CatItem from './components/cat-item';
import getCats from './connect/get-cats';

import CatTable from './components/cat-table';

const p = require("./dom");

let ctime = new Date().getTime();
const interval = 500; // 1 second
let diff, last;

window.setInterval(() => {
    last = new Date().getTime();
    
    diff = last - ctime;
    
    if(diff >= interval) {
        console.log(diff);
        ctime = last;
    }
}, 10)

 

/*
let item = new CatItem({
    name:"Louqui",
    color: "white",
    id: 123,
    lastModified: "1231"
} as CatInterface).html;


catList.appendChild(item)

const ci = new CatItem({
    name:"Louqui",
    color: "white",
    id: 123,
    lastModified: "1231"
} as CatInterface);


catList.appendChild(ci.html)

ci.numCount = 8


btnAddAction.addEventListener("click", () => {
    catList.appendChild(new CatItem({
        name:"Louqui",
        color: "white",
        id: 123,
        lastModified: "1231"
    } as CatInterface).html)

})

// Create an observer instance.
var observer = new MutationObserver(function(mutations) {
    console.log(123123)
    Array.from(btnDeletetActions).forEach((item) => {
        item.addEventListener("click", () => {
             item.parentElement?.parentElement?.parentElement?.remove();
        })
    });   
});

// Pass in the target node, as well as the observer options.
observer.observe(catList, {
    attributes:    true,
    childList:     true,
    characterData: true
});

*/



export {};
