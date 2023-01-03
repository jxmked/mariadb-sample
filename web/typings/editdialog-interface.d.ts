interface EditDialogPrivateCallbackFunctionsInterface {
    confirm: ConfirmCallbackInterface,
    cancel: () => void;
}

type ConfirmCallbackInterface = ({ name, color }: { name: string, color: string }) => void;
