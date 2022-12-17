/***
 * Get item by id
 * */
import conn from './config';

export default (id?:CatInterface['id']):Promise<CatInterface> => {
    
    return new Promise<CatInterface>((resolve, reject) => {
        let base_url:string = `${conn['host']}${(id == void 0) ? "" : "?id=" + id}`;
        
        // @ts-ignore
        if(id === 'true') {
            base_url = `${conn['host']}?notime=true`;
        // @ts-ignore
        } else if (id === 'false') {
            base_url = conn['host'];
        }
        
        
        
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.responseType = 'text';
        xhr.addEventListener("readystatechange", function(){
            if(xhr.readyState != 4) return;
            
            resolve(JSON.parse(xhr.responseText));
        });
        
        xhr.onerror = function(err){
            reject({
                "status":xhr.status,
                "msg":"Unable to resolve reponse status"
            });
        };
        xhr.open("GET", base_url, true);
        xhr.send();
        
        
        
        
        
        /*
        fetch(base_url, {
            "method":"GET",
            "cache":"no-cache",
         //   "credentials":"include",
          //  "mode": "no-cors"
        }).then((res) => res.json())
        .then(resolve)
        .catch(reject); */
    });
}
