import __idb from './get-idb';

/**
 * How to use example
 * 
 * const idb = DB("name");
 * const store = idb.store("storeName");
 * store.item("key", "value").then((result:any) => {
 *     // set new value
 *     console.log(result); // Is success???
 * });
 * 
 * store.item("key").then((result:any) => {
 *     console.log(result); // Your value
 * });
 * */

const DB = (name:string) => {
console.log("asd")
}

export default DB;
