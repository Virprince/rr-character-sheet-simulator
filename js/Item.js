import data from "./charactersSheet.json" assert { type: "json" };


export default class Item {

    value;
    type;
    startMax;
    totalValue;
    modValue;
    dataBonus;

    constructor(id, data, rowClassName) {
        this.id = id;
        this.data = data;
        this.rowClassName = rowClassName;
        this.name = data.name;
        this.desc = data.desc;
        this.type = data.type;
        this.modValue = 0;
        this.value = 0;
        this.dataBonus = 0;
        this.totalValue = 0;
        this.itemRow = `.${rowClassName}[data-id="${id}"]`;
        this.startMax = data.hasOwnProperty('startMax') ? data.startMax : 0;
    }

    get row() {
        return $(this.itemRow);
    }

    set value(nbr) {
        this.value = nbr;
    }

    get value() {
        return this.value;
    }

    get type() {
        return this.type;
    }

    set dataBonus(nbr) {
        this.dataBonus += nbr;
        this.itemRow.find('.js-value').attr('data-bonus', this.dataBonus);

        this.watchUpdate();
    }

    get getDataBonus() {
        return this.dataBonus;
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
        console.log('foo');
        $(document).on('click', this.row.find('button'), (e) => {
            console.log('click');
            $(this).css('background', 'red');
        })

        // update MODS
        // update STAT
        // update TOTAL
        this.totalValue(this.value + this.dataBonus + this.modValue);
        return true;
    }
}