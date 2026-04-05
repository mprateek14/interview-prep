const debounce = (callback, delay) =>{
    let timer;

    return function(...args){
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}

const throttle = (callback, delay) => {
    let inThrottle = false;

    return function(...args){
        if(inThrottle) return;
        callback(...args)
        inThrottle = true
        setTimeout(() => {
            inThrottle = false;
        }, delay)
    }
}


Array.prototype.newMap = function(callback){
    const output = []

    for(let i=0; i<this.length; i++){
        let res = callback(this[i], i, this);
    }

    return output
}

Array.prototype.newReduce = function(callback, initVal){
    let acc;
    let startIdx = 0;

    if(arguments.length >= 2){
        acc = initVal
    }
    else{
        if(this.length === 0){
            throw new Error("array length is 0")
        }
        else{
            acc = this[0];
            startIdx = 1;
        }
    }

    for(let i=startIdx; i<this.length; i++){
        acc = callback(acc, this[i], i, this);
    }

    return acc;
}