import Item from "./Item.js";

export default class Attribute extends Item {

    modValue;
    startMax;
    dataBonus;
    totalValue;

    constructor(id, data, rowClassName) {
        super(id, data, rowClassName);

        this.modValue = 0;
        this.startMax = data.startMax;
        this.dataBonus = 0;
        this.totalValue = 0;
    }

    set value(nbr) {
        this.watchUpdate();
    }

    addValue(nbr){
        let newValue = nbr + this.value;
        this.value(newValue);
    }

    set dataBonus(nbr) {
        this.dataBonus += nbr;
        this.itemRow.find('.js-value').attr('data-bonus', this.dataBonus);

        this.watchUpdate();
    }

    get getDataBonus() {
        return this.dataBonus;
        // return parseInt(this.itemRow.find('.js-value').attr('data-bonus'));
    }

    set totalValue(nbr) {
        this.totalValue += nbr;
        let result = this.totalValue > 0 ? '+' + this.totalValue : this.totalValue();

        this.itemRow
            .find('.js-totalValue')
            .attr('data-totalvalue', this.totalValue)
            .html(result);
    }

    get getTotalValue() {
        return this.value + this.dataBonus;
    }

    watchUpdate(){
        // update MODS
        // update STAT
        // update TOTAL
        this.totalValue(this.value + this.dataBonus + this.modValue);
    }

}