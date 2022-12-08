import {
    btnDeleteConfirm,
    btnDeleteDeny,
    btnAddAction
} from './dom';

import Cover from './components/bg-cover';
import AddCat from './components/add-cat-dialog'; 

const addcat:AddCat = new AddCat();
btnAddAction.addEventListener("click", () => {
    addcat.activate();   
});





export {};
