Array.prototype.newMap = function(callback, thisArg){
    if(this === null || this === undefined){
        throw new TypeError("newMap called on null or undefined")
    }

    if(typeof callback !== "function"){
        throw new TypeError(callback + "is not a function")
    }

    const O = Object(this);
    const len = O.length >>> 0;

    const result = Array(len)

    for(let i=0; i<len; i++){
        if(i in O){
            const val = callback.call(thisArg, O[i], i, O)

            result[i] = val;
        }
    }
    return result;
}

Array.prototype.newForEach = function(callback, thisArg){
        if(this === null || this === undefined){
        throw new TypeError("newForEach called on null or undefined")
    }

    if(typeof callback !== "function"){
        throw new TypeError(callback + "is not a function")
    }

    const O = Object(this);
    const len = O.length >>> 0;

    for(let i=0; i<len; i++){
        if(i in O){
            callback.call(thisArg, O[i], i, O);
        }
    }


}


// oauth
// pingfed
// sso
// oidc


// noisy neighbour
// split brain