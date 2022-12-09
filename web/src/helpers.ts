
export const isEmpty:Function = (param:any): boolean => {
    if(param instanceof Object) {
        // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        for(const prop in param) {
            if(Object.prototype.hasOwnProperty.call(param, prop))
                return false;
        }
        
        return JSON.stringify(param) === JSON.stringify({})
    }
    
    if(param instanceof Array) {
        return param.length == 0;
    }
    
    if(param instanceof String || typeof param === "string") {
        return (param === "" || param === void 0 || param === null)
    }
    
    if(param === void 0 || param === null) {
        return true;
    }
    
    throw new TypeError("Undefined Object");
    
}

function fallbackEmpty<T>(str:string, fallback:T):T|string {
    return (isEmpty(str)) ? fallback : str;
}

export {fallbackEmpty, fallbackEmpty as fallback_empty};

export function normalizeString(param:string|number, method:string = "NFD"):string {
    // @ts-ignore
    if((! param instanceof Number)  && isEmpty(param)) {
        return "";
    }
    
    return String(param).normalize(method).trim();
}

export function ucfirst(str:string):string {
    return str.substring(0,1).toUpperCase() + str.substring(1);
}