
/**
 * This worker is for table sync only.
 */


// deepCompare
importScripts(['./deepCompare.js']);


let CONFIG = {
    "interval": 1000,
    "pulse": 10,
    "host": "http://localhost:8000/",
    "stop_on_error":true
};


/**
 * Interface
 * 
 * { [id:string]:{
 *  name:string;
 *  color:string;
 *  last_modified:string;
 * 
 *  } 
 * }
 */
const current_data = {};

let is_running = false;
let to_stop = false;
let hang_up = false;

/**
 * Check the difference between current_data and latest fetched data
 * 
 * @param {object} new_data 
 */
const check_diff = function(new_data) {
    const old_data = Object.assign({}, current_data);

    /**
     * Save all result here
     */
    const result = [];

    Object.values(new_data).forEach(function(new_single_data){
        let id = new_single_data['id'];

        if(old_data.hasOwnProperty(id)) {
            // Compare
            if(! deepCompare(new_single_data, old_data[id])) {
                // Modified
                result.push({
                    "data-id": id,
                    "data-action": "modified"
                });
            }

            // Delete the already check data
            delete old_data[id];
        } else {
            // New data
            result.push({
                "data-id": id,
                "data-action": "added"
            });
        }
    });
    
    // Extract all keys The rest of the old_data 
    // Those keys are no longer exists in our database
    return result.concat(Object.keys(old_data).map(function(id){
        return {
            "data-id": id,
            "data-action": "deleted"
        };
    }));
}

const sendMsg = function(type, msg) {
    self.postMessage({
        "type": type,
        "body": msg
    });
} 

const stop = function() { 
    to_stop = true;
}
 
const start = async function() {
    
    if(to_stop) {
        return;
    }

    let last = new Date().getTime();
    let response;

    try {
        response = await fetch(CONFIG['host'], {
            "method":"GET",
            "cache":"no-cache"
        });
    } catch(err) {
        sendMsg("crash","unable to resolve response status");
        stop();
        return;
    }
    

    if(response.ok) {
        let new_data;

        try {
            new_data = await response.json();
        } catch(err) {
            sendMsg("crash","unable to resolve response status");
            stop();
            return;
        }
        
        const result = check_diff(new_data);

        // reset
        Object.keys(current_data).forEach(function(id){
            delete current_data[id];
        });

        // Update our current_data
        new_data.forEach(function(data) {
            current_data[data['id']] = data;
        });

        // Send changes to main thread
        result.forEach(function(data){
            if(data["data-action"] == "deleted") {
                sendMsg(data["data-action"], {
                    "id": data["data-id"]
                });
                
                return;
            }

            sendMsg(data["data-action"], {
                "id": data["data-id"],
                "content": current_data[data["data-id"]]
            });
        });
       
    }

    switch(response.status) {
        case 400: // Bad Request
            sendMsg("error", "bad-request");
            if(CONFIG['stop_on_error']) {
                stop();
                return;
            }
        break;

        case 200: // Ok 
            
        break;

        case 409: // Conflict
            sendMsg("error", "conflict");
            if(CONFIG['stop_on_error']) {
                stop();
                return;
            }
        break;

        case 404: // Not Found
            sendMsg("error", "not-found");
            if(CONFIG['stop_on_error']) {
                stop();
                return;
            }
        break;

        default:
            // Fatal crash
            sendMsg("crash","unable to resolve response status");
            stop();
            return;
    }

    // setTimeout but expensive. Hahaha
    let ival = self.setInterval(function(){
        if( ! hang_up && (new Date().getTime() - last) >= CONFIG['interval']) {
            (! to_stop && start());
            self.clearInterval(ival);
        }
    }, CONFIG['pulse']);
}

self.addEventListener("message", (e) => {
    const type = e.data['type'];
    const body = e.data['body'];

    if(type == "config") {
        CONFIG = body;
        return;
    }
    
    if(! type == 'command') {
        stop();
        self.postMessage({
            "type": "error",
            "body": "No available method"
        });
        return;
    }

    switch(body) {
        case 'start':
            if(! is_running) {
                is_running = true;   
                start();
            }
        break;
        
        case 'stop':
            stop();
        break;

        case 'pause':
            hang_up = true;
        break;

        case 'resume':
            hang_up = false;
        break;

    }
})



