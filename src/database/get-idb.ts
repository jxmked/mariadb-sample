declare global {
    interface Window {
        webkitIndexedDB:IDBFactory;
        mozIndexedDB:IDBFactory;
        OIndexedDB:IDBFactory;
        msIndexedDB:IDBFactory;
    }
}

const idb = () => {
    try {
        return window.indexedDB ||
            window.webkitIndexedDB ||
            window.mozIndexedDB ||
            window.OIndexedDB ||
            window.msIndexedDB;
    } catch (err) {}
    return;
};

export default idb() as IDBFactory;
