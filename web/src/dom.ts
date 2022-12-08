// Background hover for dialogs
export const bgCover = document.getElementById("bg-cover") !;


export const catList = document.getElementById("cats-table") !;
export const btnDeletetActions = document.getElementsByClassName("delete-action") !;
export const btnEditActions = document.getElementsByClassName("edit-action") !;
export const btnAddAction = document.getElementById("add-cat")!;
export const noEntriesDialog = document.getElementById("no-entries-dialog")!;

// Add Cat Dialog
export const addCatDialog = document.getElementById("add-cat-interface-dialog")!;
export const addCatInputs = {
    name: document.getElementById("add-new-cat-name-input")! as HTMLInputElement,
    color: document.getElementById("add-new-cat-color-input")! as HTMLInputElement
}; 

export const addCatMsgBox = document.getElementById("add-cat-msg-box")!;

// Add cat Dialog Events
export const btnAddCatConfirm = document.getElementById("add-cat-confirmed")!;
export const btnAddCatDeny = document.getElementById("add-cat-denied")!;



// Delete Dialog
export const deleteCatDialog = document.getElementById("confirm-delete-dialog")!;

// Cat to delete msg box
export const deleteCatName = document.getElementById("delete-cat-name")!;

// Delete Dialog Events
export const btnDeleteConfirm = document.getElementById("delete-confirmed")!;
export const btnDeleteDeny = document.getElementById("delete-denied")!;


export default {};

