
export const Store = function(data){

    this.context = null;

    Object.entries(data).forEach(entry=>{
        this[entry[0]] = entry[1];
    });

    Object.seal(this);
}
