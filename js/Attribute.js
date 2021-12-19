import Item from "./Item.js";

export default class Attribute extends Item {

    constructor(id, data, rowClassName) {
        super(id, data, rowClassName);
    }

    set value(nbr) {
        this.watchUpdate();
    }

    addValue(nbr){
        let newValue = nbr + this.value;
        this.value(newValue);
    }







}