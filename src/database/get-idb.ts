
export default () => {
    try {
        return window.indexedDB ||
            window.webkitIndexedDB ||
            window.mozIndexedDB ||
            window.OIndexedDB ||
            window.msIndexedDB;
    } catch (err) {}
    return;
}
