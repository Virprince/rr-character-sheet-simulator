import data from "./charactersSheet.json" assert { type: "json" };
import {buildDom} from "./buildDom.js";
import Item from "./Item.js";
import Attribute from "./Attribute.js";


const {startPoints,maxPoints,attributes,skills} = data;

const update = data => {
    const {attrModifier,startPoints,maxPoints,attributes,skills, stats, lifePaths} = data;

    const attrTable = $('#attrTable');
    const skillTable = $('#skillTable');
    const lifePathTable = $('#lifePathTable');
    const statTable = $('#statTable');
    const attrPoints = $('#attrPoints');
    const skillPoints = $('#skillPoints');

    const updatePoints = (type, action) => {

        if (type === 'attribute'){
            type = attrPoints;
        }
        if (type === 'skill'){
            type = skillPoints;
        }

        let maxType = type.attr('data-max');
        let valType = type.attr('data-value');

        // remove point from total
        if (action === 'add' && parseInt(valType) > 0){
            valType = parseInt(valType) - 1
            type.attr('data-value', valType).html(valType);
        }

        // add point to total
        if (action === 'remove' && parseInt(valType) < parseInt(maxType)){
            valType = parseInt(valType) + 1
            type.attr('data-value', valType).html(valType);
        }

        if (parseInt(valType) === 0) {
            $('button[data-action="add"]').each(el => {
                $(this).prop('disabled', true);
            })
        }

        if (parseInt(valType) === parseInt(maxType)) {
            $('button[data-action="remove"]').each(el => {
                $(this).prop('disabled', true);
            })
        }

        return valType;
    }

    const updateRow = (row, type, operation) => {

        let valueCell = row.find('.js-value');
        let value = parseInt(valueCell.attr('data-value'));
        let bonus = parseInt(valueCell.attr('data-bonus'));
        value = value + operation;

        if (operation > 0){
            valueCell.attr('data-value', value).html(value + bonus);
        }

        if (operation < 0){
            valueCell.attr('data-value', value).html(value + bonus);
        }

        if (parseInt(value) === 0){
            row.find('button[data-action="remove"]').prop('disabled', true);
        } else {
            row.find('button[data-action="remove"]').prop('disabled', false);
        }

        if (parseInt(value) < valueCell.attr('data-startmax')){
            row.find('button[data-action="add"]').prop('disabled', false);
        } else {
            row.find('button[data-action="add"]').prop('disabled', true);
        }

        if (type === 'attribute'){
            updateMod(row);
        }
        stats.forEach(stat => {
            updateStat(stat);
        })

        updateTotal(row);

    }

    const updateType = target =>{
        let type = $(target).attr('data-type'); // attribute or skill
        let row = $(target).closest('.js-row');
        let action = $(target).attr('data-action');

        let operation = 1
        if (action === 'remove'){
            operation = -1
        }

        updatePoints(type, action)
        updateRow(row,type, operation)

    }

    const updateMod = row => {
        let value = row.find('.js-value').attr('data-value')
        let id = row.attr('data-id');
        let modValue = row.find('.js-modValue').attr('data-modvalue');

        skills.forEach( el => {

            if (el.mod.includes(id)){
                let modCalc = 0;
                el.mod.forEach(attr => {
                    let modCell = attrTable.find(`.js-row[data-id="${attr}"] .js-value`);
                    let rowVal = parseInt(modCell.attr('data-value'));
                    let rowBonus = parseInt(modCell.attr('data-bonus'));
                    modCalc += (rowVal + rowBonus) * attrModifier
                })
                modCalc = modCalc /el.mod.length;
                modCalc = Math.floor(modCalc);

                let rowEl = skillTable.find(`[data-id="${el.id}"]`)

                rowEl.find('.js-modValue').html(modCalc).attr('data-modvalue', modCalc);
                updateTotal(rowEl);

            }
        })

        stats.forEach(stat => {
            updateStat(stat);
        })


    }

    const updateGuild = level => {
        let row = $(level).closest('.js-row');
        row.find('.js-value').html($(level).val()).attr('data-value', $(level).val());

        stats.forEach(stat => {
            updateStat(stat);
        })
    }

    const updateLifePath = target => {
        let row = $(target).closest('.js-lifePath');
        let pathId = row.attr('data-id');
        let pathData = lifePaths.find(o => o.id === pathId);

        // remove previous Path
        let activePaths = lifePathTable.find('.js-lifePath[data-active="true"]');
        if (activePaths.length > 0){
            let activePathData = lifePaths.find(o => o.id === $(activePaths[0]).attr('data-id'))
            removeLifePath(activePathData, $(activePaths[0]));
        }

        addLifePath(pathData, row);

    }

    const removeLifePath = (lifePathData, row) => {
        lifePathData.bonus.forEach(bonus => {
            let rowUpdate = $(`.js-row[data-id="${bonus.id}"]`);
            let jsValue = rowUpdate.find('.js-value');

            let dataBonus = parseInt(jsValue.attr('data-bonus'));
            let value = parseInt(jsValue.attr('data-value'));

            jsValue.attr('data-bonus', dataBonus - bonus.value);

            jsValue.html(dataBonus - bonus.value + value);

            if (rowUpdate.closest('#attrTable').length > 0 ){
                updateMod(rowUpdate);
            }
        })

        row.attr('data-active', false);
        row.find('[data-action="select"]').removeClass('d-none');
        row.find('[data-action="reset"]').addClass('d-none');

        stats.forEach(stat => {
            updateStat(stat);
        })
        updateTotal(row);
    }

    const addLifePath = (lifePathData, row) => {
        lifePathData.bonus.forEach(bonus => {
            let rowUpdate = $(`.js-row[data-id="${bonus.id}"]`);
            let jsValue = rowUpdate.find('.js-value');

            let dataBonus = parseInt(jsValue.attr('data-bonus'));
            let value = parseInt(jsValue.attr('data-value'));

            jsValue.attr('data-bonus', dataBonus + bonus.value);

            jsValue.html(dataBonus + bonus.value + value);

            if (rowUpdate.closest('#attrTable').length > 0 ){
                updateMod(rowUpdate);
            }
        })

        row.attr('data-active', true);
        row.find('[data-action="select"]').addClass('d-none');
        row.find('[data-action="reset"]').removeClass('d-none');
        stats.forEach(stat => {
            updateStat(stat);
        })
        updateTotal(row);
    }

    const updateStat = (statData) => {
        let result = '';
        let id = statData.id;
        if (statData.calc){
            result = statData.calc.value;
        }

        if (statData.hasOwnProperty("calc") && statData.calc.hasOwnProperty("mod")){
            // trouver les skills/attributes
            let modCalc = 0;
            statData.calc.mod.forEach(el => {
                let modCell = $(`.js-row[data-id="${el}"] .js-value`);
                let dataBonus = parseInt(modCell.attr('data-bonus'));
                let value = parseInt(modCell.attr('data-value'));

                modCalc += (dataBonus + value);
            })

            // moyenne
            modCalc = modCalc /statData.calc.mod.length;
            if (statData.calc.hasOwnProperty("attrModifier")){
                modCalc = modCalc * statData.calc.attrModifier;
            }
            modCalc = Math.floor(modCalc);

            if (statData.calc.hasOwnProperty("base")){
                modCalc += statData.calc.base;
            }
            result = modCalc;
        }


        let rowEl = statTable.find(`[data-id="${id}"]`)
        rowEl.find('.js-value').html(result).attr('data-value', result);
    }

    const updateTotal = (row) => {
        let modValue = row.find('.js-modValue');
        let value = row.find('.js-value');
        let totalValue = row.find('.js-totalValue');
        let calcTotal = 0;
        if (modValue.length > 0) {

            calcTotal +=  parseInt(modValue.attr('data-modvalue'));
            calcTotal +=  parseInt(value.attr('data-value'));
            calcTotal +=  parseInt(value.attr('data-bonus'));

            totalValue.html(calcTotal).attr('data-totalvalue', calcTotal);


        }
    }

    return {
        init: () => {
            $(document).on('click', 'button.js-point', e => {
                updateType(e.currentTarget);
            })

            $(document).on('change', '.js-guild', e => {
                updateGuild(e.target);
            })

            $(document).on('click', '.js-lifePath button[data-action="select"]', e => {
                updateLifePath(e.target);
            })

            $(document).on('click', '.js-lifePath button[data-action="reset"]', e => {
                let row = $(e.target).closest('.js-lifePath');
                let pathId = row.attr('data-id');
                let pathData = lifePaths.find(o => o.id === pathId);
                removeLifePath(pathData,row);
            })
        },
        stat: (statData, row) => {
            updateStat(statData, row);
        }
    }
}

$( function () {
    buildDom(data).init();
    update(data).init();

    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

});