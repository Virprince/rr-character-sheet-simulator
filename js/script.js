import data from "./charactersSheet.json" assert { type: "json" };
import template from './template.js'

const attrTable = $('#attrTable');
const skillTable = $('#skillTable');
const lifePathTable = $('#lifePathTable');
const statTable = $('#statTable');
const attrPoints = $('#attrPoints');
const skillPoints = $('#skillPoints');
const levelTable = $('#levelTable');
const thresholdTable = $('#thresholdTable');

const {items,attrModifier,startPoints,maxPoints,stats,lifePaths,levels,thresholds} = data;

const buildDom = () => {
    items.forEach(el=>{
        switch (el.type){
            case 'attribute':
                attrTable.append(template.skill(el));
                break;
            case 'skill':
                skillTable.append(template.skill(el));
                break;
            case 'special':
                skillTable.append(template.special(el));
                break;
        }
    });

    stats.forEach(el =>{
        statTable.append(template.stat(el));
    });

    lifePaths.forEach(el => {
        lifePathTable.append(template.lifePath(el));
    })

    levels.forEach(el =>{
        levelTable.append(template.level(el));
    });

    thresholds.forEach(el=>{
        thresholdTable.append(template.threshold(el));
    });

    $('#attrPoints').append(template.point(startPoints.attr));
    $('#skillPoints').append(template.point(startPoints.skill));

    updateStats();
};

const pointAction = (target) => {

    let row = $(target).closest('.js-row');
    let itemId = row.attr('data-id');
    let action = $(target).attr('data-action');
    let obj =  items.find(o => o.id === itemId);

    let points = getPoolPoints(obj.type);

    // si c'est add, est ce qu'il reste des points à distribuer ?
    if (action === 'add' && points.value > 0 ){
        // retire 1 au pool
        updatePoolPoints(-1, points);
        // ajoute 1 à obj si c'est possible
        updateLvlItem(row,obj, 1)
    }

    // si c'est remove est ce qu'il est possible d'en retirer ?
    if (action === 'remove' ){
        updatePoolPoints(1, points);
        updateLvlItem(row,obj, -1)
    }

    // update bonus
    if (obj.type === 'attribute'){
        updateMods(row, obj)
    }

    // update stats
    updateStats();

};

const updateStats = () => {

    stats.forEach(stat => {
        let result = '';
        let id = stat.id;
        if (stat.calc){
            result = stat.calc.value;
        }
        if (stat.hasOwnProperty("calc") && stat.calc.hasOwnProperty("mod")){
            // trouver les skills/attributes
            let modCalc = 0;
            stat.calc.mod.forEach(el => {
                let modCell = $(`.js-row[data-id="${el}"]`);
                let modValue = getItemValue(modCell);
                modCalc += (modValue.bonus + modValue.value + modValue.mod);
            })

            // moyenne
            modCalc = modCalc /stat.calc.mod.length;
            if (stat.calc.hasOwnProperty("attrModifier")){
                modCalc = modCalc * stat.calc.attrModifier;
            }
            modCalc = Math.floor(modCalc);

            if (stat.calc.hasOwnProperty("base")){
                modCalc += stat.calc.base;
            }
            result = modCalc;
        }
        let rowEl = statTable.find(`[data-id="${id}"]`);
        rowEl.find('.js-value').html(result).attr('data-value', result);
    })
}

const updateMods = (row, obj) => {
    let itemValue = getItemValue(row);
    let id = obj.id;

    let skills = items.filter(item => {
        return item.type === 'skill';
    })

    skills.forEach( el => {
        if (el.mod.includes(id)) {
            let modCalc = 0;
            el.mod.forEach(attr => {
                let modCell = attrTable.find(`.js-row[data-id="${attr}"]`);
                let modValue = getItemValue(modCell);
                modCalc += (modValue.value + modValue.bonus + modValue.mod) * attrModifier
            })
            modCalc = modCalc /el.mod.length;
            modCalc = Math.floor(modCalc);

            let rowEl = skillTable.find(`[data-id="${el.id}"]`);
            rowEl.find('.js-modValue').html(modCalc).attr('data-modvalue', modCalc);

            updateTotalItem(rowEl);

        }
    })

}

const updateLvlItem = (row,item,nbr, bonus= false) => {
    let jsValue = row.find('.js-value');
    let lvlValue = parseInt(jsValue.attr('data-value'));
    let lvlBonus = parseInt(jsValue.attr('data-bonus'));

    let result = 0;

    // le max est atteind quand on update un niveau ?

    if (nbr > 0 && !bonus && lvlValue < item.startMax){
        result = lvlValue + nbr;
        jsValue.attr('data-value', result).html(lvlBonus + result);
    } else if(nbr > 0 && bonus ){
        result = lvlBonus + nbr;
        jsValue.attr('data-bonus', result).html(lvlValue + result);
    }

    // if (parseInt(jsValue.attr('data-value')) === item.startMax) {
    //     row.find('[data-action="add"]').prop("disabled", true);
    // }

    // le min est atteind ?
    if (nbr < 0 && !bonus && lvlValue > 0){
        result = lvlValue + nbr;
        jsValue.attr('data-value', result).html(lvlBonus + result);
    } else if(nbr < 0 && bonus ){
        result = lvlBonus + nbr;
        jsValue.attr('data-bonus', result).html(lvlValue + result);
    }

    // if (parseInt(jsValue.attr('data-value')) === 0) {
    //     row.find('[data-action="remove"]').prop("disabled", true);
    // }

    // update
    updateTotalItem(row);
    updateButtons();

};

const updateTotalItem = (row)=> {
    let jsValue = row.find('.js-value');
    let modValue = row.find('.js-modValue');

    let itemValue = getItemValue(row);

    let total = itemValue.value + itemValue.bonus +  itemValue.mod;
    let totalValue = row.find('.js-totalValue');
    totalValue.attr('data-totalValue', total ).html(total);
}

const getItemValue = (row) => {
    let jsValue = row.find('.js-value');
    let modValue = row.find('.js-modValue');
    let mod = modValue.length > 0 ? parseInt(modValue.attr('data-modvalue')): 0;

    return {
        value: parseInt(jsValue.attr('data-value')),
        bonus: parseInt(jsValue.attr('data-bonus')),
        mod: mod,
    }
}

const getPoolPoints = (type) => {
    let pointRow = attrPoints.find('[data-points]');

    if (type === 'skill'){
        pointRow = skillPoints.find('[data-points]');
    }

    return {
        type: type,
        row: pointRow,
        max : parseInt(pointRow.attr('data-max')),
        value : parseInt(pointRow.attr('data-value')),
    }
};

const updatePoolPoints = (nbr, points) => {
    let result = points.value + nbr;
    points.row.attr('data-value', result).html(result);
    let buttonsAdd = attrTable.find('[data-action="add"]');
    let buttonsRemove = attrTable.find('[data-action="remove"]');

    if (points.type === 'skill'){
        buttonsAdd = skillTable.find('[data-action="add"]');
        buttonsRemove = skillTable.find('[data-action="remove"]');
    }

    updateButtons();

}

const updateButtons = () => {
    const buttonsAdd = $('button[data-action="add"]');
    const buttonsRemove = $('button[data-action="remove"]');

    let attrPool = getPoolPoints('attribute');
    let skillPool = getPoolPoints('skill');

    // add disabled
    buttonsAdd.each((i, el)=>{
        let type = $(el).attr('data-type');
        let jsValue = $(el).closest('.js-row').find('.js-value');

        if (type === 'attribute'){
            if (attrPool.value === 0 || parseInt(jsValue.attr('data-value')) >= parseInt(jsValue.attr('data-startmax'))){
                $(el).prop("disabled", true);
            } else {
                $(el).prop("disabled", false);
            }
        }


        if (type === 'skill'){
            if (skillPool.value === 0 || parseInt(jsValue.attr('data-value')) >= parseInt(jsValue.attr('data-startmax'))){
                $(el).prop("disabled", true);
            } else {
                $(el).prop("disabled", false);
            }
        }
    })


    // remove disabled
    buttonsRemove.each((i, el)=>{
        let type = $(el).attr('data-type');
        let jsValue = $(el).closest('.js-row').find('.js-value');

        if (type === 'attribute'){
            if (attrPool.value === attrPool.max || parseInt(jsValue.attr('data-value')) === 0){
                $(el).prop("disabled", true);
            } else {
                $(el).prop("disabled", false);
            }
        }


        if (type === 'skill'){
            if (skillPool.value === skillPool.max || parseInt(jsValue.attr('data-value')) === 0){
                $(el).prop("disabled", true);
            } else {
                $(el).prop("disabled", false);
            }
        }
    })



}

const updateGuild = level => {
    let row = $(level).closest('.js-row');
    row.find('.js-value').html($(level).val()).attr('data-value', $(level).val());

    updateStats();
}

const lifePathAction = (target, action) => {
    let row = $(target).closest('.js-lifePath');
    let pathId = row.attr('data-id');
    let pathData = lifePaths.find(o => o.id === pathId);

    let activePaths = lifePathTable.find('.js-lifePath[data-active="true"]');
    if (activePaths.length > 0){
        let activePathData = lifePaths.find(o => o.id === $(activePaths[0]).attr('data-id'))
        updateLifePath(activePathData, $(activePaths[0]), 'reset');
    }

    if (action === 'select'){
        updateLifePath(pathData, row, 'select');
    }

    updateStats();

};
const updateLifePath = (lifePath, row, action) => {
    lifePath.bonus.forEach(bonus => {
        let rowUpdate = $(`.js-row[data-id="${bonus.id}"]`);
        let obj =  items.find(o => o.id === bonus.id);
        let bonusNbr = action === 'reset' ? -Math.abs(bonus.value) : bonus.value;

        updateLvlItem(rowUpdate,obj,bonusNbr,true );
        updateTotalItem(rowUpdate);

    });

    if (action === 'select'){
        row.attr('data-active', true);
        row.find('[data-action="select"]').addClass('d-none');
        row.find('[data-action="reset"]').removeClass('d-none');
    }
    if (action === 'reset'){
        row.attr('data-active', false);
        row.find('[data-action="select"]').removeClass('d-none');
        row.find('[data-action="reset"]').addClass('d-none');
    }

}

$( function () {

    buildDom();

    $(document).on('click', 'button.js-point', e => {
        pointAction(e.currentTarget);
    });

    $(document).on('change', '.js-guild', e => {
        updateGuild(e.target);
    });

    $(document).on('click', '.js-lifePath button[data-action="select"]', e => {
        lifePathAction(e.target, 'select');
    });

    $(document).on('click', '.js-lifePath button[data-action="reset"]', e => {
        lifePathAction(e.target, 'resetgit stat');
    });


    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

});