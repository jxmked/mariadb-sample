/***
 * Get item by id
 * */
import conn from './config';

export default (id:CatInterface['id']):Promise<CatInterface> => {
    
    return new Promise<CatInterface>((resolve, reject) => {
        let base_url:string = conn['host'];
        
        fetch(`${base_url}?id=${id}`, {
            "method":"GET",
            "cache":"no-cache"
        }).then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
}
