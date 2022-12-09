import {
    btnDeleteConfirm,
    btnDeleteDeny,
    btnAddAction,
    catList
} from './dom';

import Cover from './components/bg-cover';
import AddCat from './components/add-cat-dialog'; 
import CatItem from './components/cat-item';
import getCats from './connect/get-cats';


const gc = new getCats();


gc.onload = (res) => {
    console.log(res)
}
const addcat:AddCat = new AddCat();
btnAddAction.addEventListener("click", () => {
    addcat.activate();   
});


catList.appendChild(new CatItem({
    name: "Louqui",
    color: "White",
    id: 8299,
    lastModified: "Jsjsjs"
} as CatInterface).html)

catList.appendChild(new CatItem({
    name: "Louqui",
    color: "White",
    id: 8299,
    lastModified: "Jsjsjs"
} as CatInterface).html)


catList.appendChild(new CatItem({
    name: "Louqui",
    color: "White",
    id: 8299,
    lastModified: "Jsjsjs"
} as CatInterface).html)






export {};
