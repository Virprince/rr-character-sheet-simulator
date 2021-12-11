import data from "./charactersSheet.json" assert { type: "json" };

const {startPoints,maxPoints,attributes,skills} = data;


const updatePoints = () => {

}

const buildDom = data => {

    const attrTable = $('#attrTable');
    const skillTable = $('#skillTable');
    const lifePathTable = $('#lifePathTable');
    const statTable = $('#statTable');
    const levelTable = $('#levelTable');
    const thresholdTable = $('#thresholdTable');

    const {startPoints,maxPoints,attributes,skills,specials,stats,lifePaths,levels,thresholds} = data;

    const init = () => {

        attributes.forEach(el => {
            attrTable.append(attribute(el));
        })

        skills.forEach(el => {
            skillTable.append(skill(el));
        })

        specials.forEach(el => {
            skillTable.append(special(el));
        })

        lifePaths.forEach(el => {
            lifePathTable.append(lifePath(el));
        })

        stats.forEach(el => {
            statTable.append(stat(el));
            update(data).stat(el, $(stat(el)));
        })

        levels.forEach(el => {
            levelTable.append(level(el));
        })

        thresholds.forEach(el => {
            thresholdTable.append(threshold(el));
        })

        $("#attrPoints")
            .html(startPoints.attr)
            .attr('data-max',startPoints.attr )
            .attr('data-value',startPoints.attr );
        $("#skillPoints")
            .html(startPoints.skill)
            .attr('data-max',startPoints.skill )
            .attr('data-value',startPoints.skill );
    }

    const attribute = (attr) => {
        return `
            <div class="js-row row border" data-id="${attr.id}">
                <div class="col-6 border-start border-end">
                    <p class="m-0 fw-bold">${attr.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-trigger="focus" 
                        data-bs-html="true"
                        title="Infos" data-bs-content="${attr.desc}">
                        <span class="badge bg-info text-dark">?</span></a>
                    </p>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col border-start">
                    + <span class="js-value" data-bonus="0" data-value="0" data-startmax="${attr.startMax}">0</span>
                </div>
                <div class="col-2 d-flex align-items-start border-start border-end">
                    <button class="btn btn-xs btn-outline-info js-point" data-action="add" data-type="attribute">+</button>
                    <button class="btn btn-xs btn-outline-info js-point" data-action="remove" data-type="attribute" disabled>-</button>
                </div>
            </div>
        `;
    };
    const skill = (skill) => {

        let btnDisabled = '';
        if (skill.startMax === 0){
            btnDisabled = 'disabled';
        }

        return `
            <div class="js-row row border" data-id="${skill.id}">
                <div class="col-6 border-start">
                    <p class="m-0 fw-bold">${skill.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-html="true"
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${skill.desc}">
                        <span class="badge bg-info text-dark">?</span></a>
                    </p>
                </div>
                <div class="col border-start" data-mod="0">
                    + <span class="js-modValue" data-modvalue="0">0</span>
                </div>
                <div class="col border-start">
                    + <span class="js-value" data-bonus="0" data-value="0" data-startmax="${skill.startMax}">0</span>
                </div>
                <div class="col border-start">
                    + <span class="js-totalValue" data-totalvalue="0">0</span>
                </div>
                <div class="col-2 d-flex align-items-start border-start border-end">
                    <button class="btn btn-xs btn-outline-info js-point" data-action="add" data-type="skill" ${btnDisabled}>+</button>
                    <button class="btn btn-xs btn-outline-info js-point" data-action="remove" data-type="skill" disabled>-</button>
                </div>
                
            </div>
        `;
    }
    const special = (special) => {

        let options = ``;

        special.levels.forEach(option => {
            options += `<option value="${option.value}">${option.title}</option>`;
        });

        return `
            <div class="js-row row border" data-id="${special.id}">
                <div class="col-6 border-start border-end">
                    <p class="m-0 fw-bold">${special.name} 
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${special.desc}">
                        <span class="badge bg-info text-dark"">?</span></a>
                    </p>
                    <p class="m-0"></p>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col border">
                    + <span class="js-value" data-bonus="0" data-value="0" >0</span>
                </div>
                <div class="col-2 border-start border-end">
                    <select class="js-guild">
                        ${options}
                    </select>
                </div>
            </div>
        `;
    }
    const lifePath = (lifePath) => {
        let content = lifePath.desc;

        lifePath.bonus.forEach(bonus => {
           content += `<br/> ${bonus.name} + ${bonus.value}`
        });

      return `
        <div class="col-6 js-lifePath" data-id="${lifePath.id}" data-active="false">
                <div class="p-3 text-center d-grid gap-2">
                <p>
                    <span class="fs-6 fw-bold">${lifePath.name}</span>
                    <a tabindex="0"
                       role="button"
                       data-bs-toggle="popover"
                       data-bs-html="true"
                       data-bs-trigger="focus"
                       title="Infos" data-bs-content="${content}">
                        <span class="badge bg-info text-dark">?</span></a>
                </p>
                <button data-action="select" class="btn btn-primary">Choisir</button>
                <button data-action="reset" class="d-none btn btn-light">Retirer</button>
            </div>
        </div>
      `;
    }
    const stat = (stat) => {
        return `
            <div class="js-stat row border" data-id="${stat.id}">
                <div class="col-8">
                    <p class="m-0 fw-bold">${stat.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-html="true"
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${stat.desc}">
                        <span class="badge bg-info text-dark">?</span></a>
                    </p>
                </div>
                <div class="col border-start">
                    <span class="js-value" data-value="0">0</span>
                </div>
            </div>
        `;
    }
    const level = (level) => {
        return `
            <div class="row">
                <div class="col-6">
                    ${level.name}
                </div>
                <div class="col-3">+ ${level.attr}</div>
                <div class="col-3">+ ${level.skill}</div>
            </div>
        `;
    }
    const threshold = (threshold) => {
        return `
            <div class="row">
                <div class="col-9">
                    ${threshold.name}
                </div>
                <div class="col-3">+ ${threshold.roll}</div>
            </div>
        `;
    }
    return {
         init : () => {
            init()
         }

    }


};

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
            console.log(activePathData);
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

    return {
        init: () => {
            $(document).on('click', 'button.js-point', el => {
                updateType(el.target);
            })

            $(document).on('change', '.js-guild', el => {
                updateGuild(el.target);
            })

            $(document).on('click', '.js-lifePath button[data-action="select"]', el => {
                updateLifePath(el.target);
            })

            $(document).on('click', '.js-lifePath button[data-action="reset"]', el => {
                let row = $(el.target).closest('.js-lifePath');
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