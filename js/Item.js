import data from "./charactersSheet.json" assert { type: "json" };


export default class Item {

    value;

    constructor(id, data, rowClassName) {
        this.id = id;
        this.data = data;
        this.rowClassName = rowClassName;
        this.name = data.name;
        this.desc = data.desc;
        this.value = 0;
        this.itemRow = $(`.${this.rowClassName}[data-id=${this.id}]`);
    }

    get row() {
        return this.itemRow;
    }

    set value(nbr) {
        this.value = nbr;
    }

    get value() {
        return this.value;
        // return parseInt(this.itemRow.find('.js-value').attr('data-value'));
    }
}