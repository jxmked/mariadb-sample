import {
    btnDeleteConfirm,
    btnDeleteDeny,
    btnAddAction,
    catList,
    btnDeletetActions
} from './dom';

import CatTable from './components/cat-table';
import ErrorDialog from './components/error-dialog';

// Start web worker
if (window.Worker) {
    const ct = new CatTable();
    ct.start();
    ct.listen();
    ct.onerror = (err:any) => {
        const ed = new ErrorDialog();
        ed.no_rm();
        ed.msg = err["type"] + ": Does stop during runtime";
        ed.msg = err["body"];
        ed.show(0);    
    }
} else {
    const ed = new ErrorDialog();
    ed.no_rm();
    ed.msg = "Unable to run";
    ed.msg = "Web worker is not available";
    ed.show(0);
}




//new CatTable()
/*
import ErrorDialog from './components/error-dialog';

const error = new ErrorDialog();
error.show(3000);
error.msg = "Hakdohsdjkfsdk dsjfklsdjfkld l hl ldslkj fhjkdh fkjdshf kjdsfh kjdfh kdsf hkjdh dh fg"
*/
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
