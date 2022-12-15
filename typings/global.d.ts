declare global {
    interface Window {
        webkitIndexedDB:IDBFactory;
        mozIndexedDB:IDBFactory;
        OIndexedDB:IDBFactory;
        msIndexedDB:IDBFactory;
    }
}
