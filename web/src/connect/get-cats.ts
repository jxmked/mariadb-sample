/**
 * 
 * 
 * */

import conn from 'config';

export default class getCats {
    private host:string;
    private callbacks:{
        error:(err:any) =>  void;
        response:(data:CatInterface[]) => void;
    }
    
    constructor() {
        this.host = conn.host;
      //  this.host = "https://api.github.com/";
        
        this.callbacks = {
            error: (err) => {},
            response: (data) => {}
        }
        
        fetch(this.host, {
            method: "GET",
            cache: "no-cache"
        })
        .then((req) => req.json())
        .then((req) => {
            this.callbacks.response(req as CatInterface[]);
        }).catch((err) => {
            this.callbacks.error(err);
        })
        
    }
    
    set onload(callback:(data:CatInterface[]) => void) {
        this.callbacks.response = callback;
    }
    
    set onerror(callback:(err:any) => void) {
        this.callbacks.error = callback;
    }
}
