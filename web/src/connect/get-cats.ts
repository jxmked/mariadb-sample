/**
 * 
 * 
 * */

import conn from 'config';

type getCatsCallbackFunction = (data:CatInterface[]) => void;

export default class getCats {
    private host:string;
    private callbacks:{
        error:(err:any) =>  void;
        response:getCatsCallbackFunction;
    }
    private state:string;
    private data:CatInterface[];
    private data_error:any;
    
    constructor() {
        
        this.host = conn.host;
      //  this.host = "https://api.github.com/";
        this.state = "pending";
        
        this.callbacks = {
            error: (err) => {},
            response: (data) => {}
        }
        this.data = [];
        this.data_error = "";
        
        this.fullReload();
    }
    
    public onupdate() {
        
    }
    
    public fullReload() {
        fetch(this.host, {
            method: "GET",
            cache: "no-cache"
        })
        .then((req) => req.json())
        .then((req) => {
            this.state = "completed";
            
            // Clone
            this.data = Object.assign({}, req) as CatInterface[];
            console.log(req);
            
            this.callbacks.response(req as CatInterface[]);
        }).catch((err) => {
            this.state = "error";
            this.callbacks.error(err);
        })
        
    }
    
    
    set onload(callback:getCatsCallbackFunction) {
        /**
         * If we reuse event callbacks with resolve state,
         * we can immediately call the callbacks
         * */
        if(this.state == "completed")
            callback(this.data);
        else
            this.callbacks.response = callback;
    }
    
    set onerror(callback:(err:any) => void) {
        if(this.state == "error")
            callback(this.data_error)
        else
            this.callbacks.error = callback;
    }
}


