import {
    btnDeleteConfirm,
    btnDeleteDeny,
    btnAddAction,
    catList,
    btnDeletetActions
} from './dom';

import CatTable from './components/cat-table';
import ErrorDialog from './components/error-dialog';
import AddCatDialog from './components/add-cat-dialog';

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

    /**
     * Automatically pause if the page has been minimized,
     * Resume if the page is visible
     */
    document.addEventListener("visibilitychange", () => {
        ct.send_command((document.hidden ? "pause" : "resume"));
    });
} else {
    const ed = new ErrorDialog();
    ed.no_rm();
    ed.msg = "Unable to run";
    ed.msg = "Web worker is not available";
    ed.show(0);
    
    // Stop 
    throw new Error("Unable to start. Web worker is not available");
}

/**
 * Add new Cat Data
 */
const acd = new AddCatDialog();

btnAddAction.addEventListener("click", () => {
    acd.activate();
});

export {};
