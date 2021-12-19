export const buildDom = data => {

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
            // update(data).stat(el, $(stat(el)));
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
                <div class="col-6 d-flex align-items-center">
                    <p class="m-0 fw-bold">${attr.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-trigger="focus" 
                        data-bs-html="true"
                        title="Infos" data-bs-content="${attr.desc}">
                        <span class="badge bg-light text-dark">?</span></a>
                    </p>
                </div>
                <div class="col border-start d-flex align-items-center" data-mod="0">
                    + <span class="js-modValue" data-modvalue="0">0</span>
                </div>
                <div class="col border-start  d-flex align-items-center">
                    + <span class="js-value" data-bonus="0" data-value="0" data-startmax="${attr.startMax}">0</span>
                </div>
                <div class="col border-start d-flex align-items-center">
                    + <span class="js-totalValue" data-totalvalue="0">0</span>
                </div>
                <div class="col-2 d-flex align-items-start border-start">
                    <button class="btn btn-xs btn-light js-point me-2" data-action="add" data-type="attribute"><i class="bi bi-plus"></i></button>
                    <button class="btn btn-xs btn-light js-point" data-action="remove" data-type="attribute" disabled><i class="bi bi-dash-lg"></i></button>
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
                <div class="col-6 d-flex align-items-center">
                    <p class="m-0 fw-bold">${skill.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-html="true"
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${skill.desc}">
                        <span class="badge bg-light text-dark">?</span></a>
                    </p>
                </div>
                <div class="col border-start d-flex align-items-center" data-mod="0">
                    + <span class="js-modValue" data-modvalue="0">0</span>
                </div>
                <div class="col border-start d-flex align-items-center">
                    + <span class="js-value" data-bonus="0" data-value="0" data-startmax="${skill.startMax}">0</span>
                </div>
                <div class="col border-start d-flex align-items-center">
                    + <span class="js-totalValue" data-totalvalue="0">0</span>
                </div>
                <div class="col-2 d-flex align-items-start border-start">
                    <button class="btn btn-xs btn-light js-point me-2" data-action="add" data-type="skill" ${btnDisabled}><i class="bi bi-plus"></i></button>
                    <button class="btn btn-xs btn-light js-point" data-action="remove" data-type="skill" disabled><i class="bi bi-dash-lg"></i></button>
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
                <div class="col-6 border-start d-flex align-items-center">
                    <p class="m-0 fw-bold">${special.name} 
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${special.desc}">
                        <span class="badge bg-light text-dark"">?</span></a>
                    </p>
                    <p class="m-0"></p>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col border d-flex align-items-center">
                    + <span class="js-value" data-bonus="0" data-value="0" >0</span>
                </div>
                <div class="col-2 border-start border-end">
                    <select class="js-guild form-select">
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
                        <span class="badge bg-light text-dark">?</span></a>
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
                <div class="col-10">
                    <p class="m-0 fw-bold pt-2 pb-2">${stat.name}
                        <a tabindex="0" 
                        role="button" 
                        data-bs-toggle="popover" 
                        data-bs-html="true"
                        data-bs-trigger="focus" 
                        title="Infos" data-bs-content="${stat.desc}">
                        <span class="badge bg-light text-dark">?</span></a>
                    </p>
                </div>
                <div class="col border-start pt-2 pb-2">
                    <span class="js-value" data-value="0">0</span>
                </div>
            </div>
        `;
    }
    const level = (level) => {
        return `
            <div class="row border">
                <div class="col-6">
                    ${level.name}
                </div>
                <div class="col-3 border-start">+ ${level.attr}</div>
                <div class="col-3 border-start">+ ${level.skill}</div>
            </div>
        `;
    }
    const threshold = (threshold) => {
        return `
            <div class="row border">
                <div class="col-9">
                    ${threshold.name}
                </div>
                <div class="col-3 border-start">${threshold.roll} +</div>
            </div>
        `;
    }
    return {
        init : () => {
            init()
        }

    }
};