import data from "./charactersSheet.json" assert { type: "json" };
import Item from "./Item.js";
import Point from "./Points.js";
import Attribute from "./Attribute.js";

import {templates} from "./templates.js";

const {startPoints,maxPoints,items,stats,levels, thresholds} = data;
const attrTable = $('#attrTable');
const skillTable = $('#skillTable');
const lifePathTable = $('#lifePathTable');
const statTable = $('#statTable');
const levelTable = $('#levelTable');
const thresholdTable = $('#thresholdTable');

const init = (data) => {
    items.forEach(el =>{
        let item = new Item(el.id, el, 'js-row');

        switch ( item.type) {
            case 'attribute':
                attrTable.append(templates.attribute(item));
                break;
            case 'skill':
                skillTable.append(templates.skill(item));
                break;
            case 'special':
                skillTable.append(templates.special(item));
                break;
        }

        // Modification des points

    })

    stats.forEach(el=>{
        statTable.append(templates.stat(el));
    })

    levels.forEach(el=>{
        levelTable.append(templates.level(el));
    })

    thresholds.forEach(el=>{
        thresholdTable.append(templates.threshold(el));
    })

    let attrPoints = new Point('attrPoints', startPoints.attr);
    $('#'+attrPoints.id).append(templates.point(attrPoints));

    let skillPoints = new Point('skillPoints', startPoints.skill);
    $('#'+skillPoints.id).append(templates.point(skillPoints));


};


$( function () {

    init(data);

    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

});