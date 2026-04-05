Array.prototype.newMap = function(callback){
    let output = []

    for(let i=0; i<this.length; i++){
        output.push(callback(this[i], i, this))
    }
    return output
}