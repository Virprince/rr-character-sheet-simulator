export default class Point {

    value;
    maxValue;
    id;
    itemRow

    constructor(id, maxValue) {
       this.id = id;
       this.maxValue = maxValue;
       this.value = maxValue;
        this.itemRow = $(`#${this.id}`);
    }

    set value(nbr) {
        this.value = nbr;
    }

    updateValue(nbr){
        let newValue = nbr + this.value;
        this.value(newValue);
    }


}