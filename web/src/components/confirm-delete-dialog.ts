import {
    deleteCatDialog,
    deleteCatName,
    btnDeleteConfirm,
    btnDeleteDeny

} from '../dom';
import { ucfirst } from '../helpers';

export default class ConfirmDeleteDialog {

    private static is_visible: boolean = false;
    private static dialog: HTMLDivElement = deleteCatDialog as HTMLDivElement;
    private static name_label: HTMLHeadingElement = deleteCatName as HTMLHeadingElement;
    private static btn_delete: HTMLButtonElement = btnDeleteConfirm as HTMLButtonElement;
    private static btn_deny: HTMLButtonElement = btnDeleteDeny as HTMLButtonElement;
    private static callbacks: { confirm: Function, cancel: Function } = {
        "confirm": () => { },
        "cancel": () => { }
    };

    constructor({ name, id }: CatInterface) {
        if (ConfirmDeleteDialog.is_visible) {
            throw new Error("Close the dialog before reusing it");
        }

        ConfirmDeleteDialog.name_label.innerText = ucfirst(name);
        ConfirmDeleteDialog.dialog.setAttribute("data-id", String(id));
        ConfirmDeleteDialog.dialog.setAttribute("data-status", "hidden");
        ConfirmDeleteDialog.dialog.setAttribute("hidden", "hidden");

        ConfirmDeleteDialog.btn_delete.addEventListener("click", () => ConfirmDeleteDialog.callbacks['confirm']());
        ConfirmDeleteDialog.btn_deny.addEventListener("click", () => ConfirmDeleteDialog.callbacks['cancel']());
    }

    show(): void {
        const self = ConfirmDeleteDialog;
        self.is_visible = true;
        self.dialog.removeAttribute("hidden");
        self.dialog.setAttribute("data-status", "visible");
    }

    hide(): void {
        const self = ConfirmDeleteDialog;
        self.is_visible = false;

        self.dialog.setAttribute("hidden", "hidden");
        self.dialog.setAttribute("data-status", "hidden");
    }

    /**
     * Events
     * */
    set onconfirm(callback: Function) {
        ConfirmDeleteDialog.callbacks['confirm'] = callback;
    }

    set ondeny(callback: Function) {
        ConfirmDeleteDialog.callbacks['cancel'] = callback;
    }

}
