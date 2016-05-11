/**
 * Created by davidlewis on 09/05/2016.
 */
/* Objects for guidelines */
function Guideline(name, pageid) {
    this.name = name || "Untitled";
    this.indications = [];
    this.selectedIndex_indication = -1;
    this.selectedIndex_drug = -1;
    this.selectedIndex_drug = -1;
    this.pageID = pageid;
}

/*IDs */
Guideline.ID_text_guideline_name = "textguidelinename";
Guideline.ID_select_indications = "selectindications";
Guideline.ID_text_indication_name = "textindicationname";
Guideline.ID_select_phases = "selectphases";
Guideline.ID_text_phase_name = "textphasename";
Guideline.ID_text_phase_duration = "textphaseduration";
Guideline.ID_text_phase_acronym = "textphaseacronym";

Guideline.prototype.constructor = Guideline;
/* IN OUTs */
Guideline.prototype.initFromJSONstring = function (jasonString) {
    if (jasonString) {
        var g = JSON.parse(jasonString);
        this.name = (g.name ? g.name : "no name");
        //this.indications is initialised in constructor
        for (var i = 0; i < g.indications.length; i++) // wont run if no indics
        {
            var indic = new Indication(g.indications[i].name);
            for (var p = 0; p < g.indications[i].phases.length; p++) {
                var phse = new Phase(g.indications[i].phases[p].name);
                for (var d = 0; d < g.indications[i].phases[p].drugs.length; d++) {
                    var drug = new Drug_mgKg(
                        g.indications[i].phases[p].drugs[d].name,
                        g.indications[i].phases[p].drugs[d].acronym,
                        g.indications[i].phases[p].drugs[d].maxDose,
                        g.indications[i].phases[p].drugs[d].mgkg_initial,
                        g.indications[i].phases[p].drugs[d].mgkg_min,
                        g.indications[i].phases[p].drugs[d].mgkg_max,
                        g.indications[i].phases[p].drugs[d].rounval,
                        g.indications[i].phases[p].drugs[d].roundirect,
                        "Notes"
                    );
                    phse.drugs.push(drug);
                }
                indic.phases.push(phse);
            }
            this.indications.push(indic);
        }
    }
    else {
        this.name = 'undefined';
        this.indications = [];
    }
};
Guideline.prototype.exportGuideline = function () {
    window.open().document.write(JSON.stringify(this));
};
/* ACTIVES */
Guideline.prototype.active_Indication = function () {
    return this.indications[this.selectedIndex_indication];
};
Guideline.prototype.active_Phase = function () {
    if (this.active_Indication()) {
        return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase];
    }
    else return false;
};
Guideline.prototype.active_Drug = function () {
    if (this.active_Indication() && this.active_Phase()) {
        return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase].drugs[this.selectedIndex_drug];
    }
    else return false;
};

/* CREATE HTML */
Guideline.prototype.addElementsToThis = function (baseElement) {
    // closure over this via myself to give access to self, as when the anonymous mini function is called,  this->element_calling.
    // When that calls the prototype function this reverts to the Object again, so no need to pass this parameter
    var myself = this;

    baseElement.empty();

    //GUIDELINE BAR
    $(document.createElement("h3"))
        .addClass("ui-bar ui-bar-b")
        .text('Guideline')
        .appendTo(baseElement);

    //Guideline buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.updateGuidelineSpecificData()
            }))
        .append//EXPORT BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-action ui-btn-icon-notext")
            .text('Export')
            .click(function () {
                myself.exportGuideline()
            }));

    //Guideline TEXT NAME
    $(document.createElement("div"))
        .addClass("ui-field-contain")
        .appendTo(baseElement)
        .append//LABEL for TEXT NAME
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_text_guideline_name)
            .text('Name'))
        .append// TEXT NAME
        ($(document.createElement("input"))
            .attr({
                'type': "text",
                'id': Guideline.ID_text_guideline_name,
                'name': Guideline.ID_text_guideline_name,
                'placeholder': "Guideline Name"
            })
            .prop('value', ""));

    /* INDCATIONS */
    /* INDCATIONS Texts Hanger */
    $(document.createElement("div"))
        .attr('id', Indication.ID_hanger_indication_texts)
        .appendTo(baseElement);

    $(document.createElement("h4"))
        .addClass("ui-bar ui-bar-b")
        .text('Indications')
        .appendTo(baseElement);

    //Indications Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_select_indications)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                myself.selectIndicationsChanged($(this).val())
            })
            .attr({'id': Guideline.ID_select_indications, 'name': Guideline.ID_select_indications}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.updateIndicationSpecificData()
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                myself.addIndication()
            }));

//Indications Texts
    $(document.createElement("div"))
        .addClass("ui-field-contain")
        .appendTo(baseElement)
        .append//LABEL for TEXT NAME
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_text_indication_name)
            .text('Name'))
        .append// TEXT NAME
        ($(document.createElement("input"))
            .attr({
                'type': "text",
                'id': Guideline.ID_text_indication_name,
                'name': Guideline.ID_text_indication_name,
                'placeholder': "Indication Name"
            })
            .prop('value', ""));

    <!--PHASES-->
    $(document.createElement("h4"))
        .addClass("ui-bar ui-bar-b")
        .text('Phases')
        .appendTo(baseElement);

    //Phases Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_select_phases)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                myself.selectPhasesChanged($(this).val())
            })
            .attr({'id': Guideline.ID_select_phases, 'name': Guideline.ID_select_phases}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.updatePhaseSpecificData()
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                myself.addPhaseToActiveIndication()
            }));

//Phases Texts
    $(document.createElement("div"))
        .addClass("ui-field-contain")
        .appendTo(baseElement)
        .append//LABEL for phase NAME
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_text_phase_name)
            .text('Name'))
        .append// phase NAME
        ($(document.createElement("input"))
            .attr({
                'type': "text",
                'id': Guideline.ID_text_phase_name,
                'name': Guideline.ID_text_phase_name,
                'placeholder': "Phase Name"
            })
            .prop('value', ""))
        .append//LABEL for phase duratioh
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_text_phase_duration)
            .text('Duration'))
        .append// phase duration
        ($(document.createElement("input"))
            .attr({
                'type': "text",
                'id': Guideline.ID_text_phase_duration,
                'name': Guideline.ID_text_phase_duration,
                'placeholder': "Phase Duration"
            })
            .prop('value', ""))
        .append//LABEL for phase acronym
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_text_phase_acronym)
            .text('Acronym'))
        .append// phase NAME
        ($(document.createElement("input"))
            .attr({
                'type': "text",
                'id': Guideline.ID_text_phase_acronym,
                'name': Guideline.ID_text_phase_acronym,
                'placeholder': "Phase Acronym"
            })
            .prop('value', ""));

    <!--DRUGS-->
    /* Drugs  Hanger */
    var drugshanger = $(document.createElement("div"))
        .appendTo(baseElement);
    Drug.addElementsToThisHangerForGuideline(drugshanger, this);



    //Refresh
    baseElement.trigger("create");
};

/* DISPLAY */
Guideline.prototype.displayGuideline = function () {
    this.displayTextsForGuideLine();
    //reset Indication to zero , validity will be checked
    this.selectedIndex_indication = 0;

    //cascade down
    this.displayIndications();

};
Guideline.prototype.displayTextsForGuideLine = function () {
    $("#" + Guideline.ID_text_guideline_name).val(this.name);
};
Guideline.prototype.updateGuidelineSpecificData = function () {
    this.name = $("#" + Guideline.ID_text_guideline_name).val();
};

/* INDICATIONS */
Guideline.prototype.displayIndications = function () {
    this.populateIndicationsSelect();
    this.displayTextsForIndication();
    //reset phase to zero , validity will be checked
    this.selectedIndex_phase = 0;

    //cascade down
    this.displayPhases();
};
Guideline.prototype.displayTextsForIndication = function () {
    var activeIndic = this.active_Indication();
    $('#' + Guideline.ID_text_indication_name).val(activeIndic ? activeIndic.name : "?").textinput("option", "disabled", !activeIndic);
};
Guideline.prototype.populateIndicationsSelect = function () {
    var jqo_select_indications = $("#" + Guideline.ID_select_indications);
    jqo_select_indications.empty();
    var selectedIndication = this.selectedIndex_indication;
    for (var i = 0; i < this.indications.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == selectedIndication)
            .text(this.indications[i].name)
            .appendTo(jqo_select_indications);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_indications.selectmenu('refresh');
};
Guideline.prototype.addIndication = function () {
    this.indications.push(new Indication("Untitled"));
    this.selectedIndex_indication = this.indications.length - 1;
    this.displayIndications();
};
Guideline.prototype.addPhaseToActiveIndication = function () {
    if (this.active_Indication()) {
        this.active_Indication().push(new Phase())
    }
};
Guideline.prototype.selectIndicationsChanged = function (index) {
    this.selectedIndex_indication = index;
    this.displayIndications();
};
Guideline.prototype.updateIndicationSpecificData = function () {
    if (this.active_Indication()) {
        this.active_Indication().name = $('#' + Guideline.ID_text_indication_name).val();
    }

    //Update menu
    this.populateIndicationsSelect();

    //SAVE

};
/* PHASES */
Guideline.prototype.displayPhases = function () {
    this.populatePhasesSelect();
    this.displayTextsForPhase();
    //reset drug to zero , validity will be checked
    this.selectedIndex_drug = 0;
    this.displayDrugs();
};
Guideline.prototype.displayTextsForPhase = function () {
    var activePhase = this.active_Phase();
    $('#' + Guideline.ID_text_phase_name).val(activePhase ? activePhase.name : "?").textinput("option", "disabled", !activePhase);
    $('#' + Guideline.ID_text_phase_duration).val(activePhase ? activePhase.duration : "?").textinput("option", "disabled", !activePhase);
    $('#' + Guideline.ID_text_phase_acronym).val(activePhase ? activePhase.acronym : "?").textinput("option", "disabled", !activePhase);
};
Guideline.prototype.selectPhasesChanged = function (index) {
    this.selectedIndex_phase = index;
    //update self and cascade down
    this.displayTextsForPhase();
    this.displayDrugs();
};
Guideline.prototype.populatePhasesSelect = function () {
    var jqo_select_phases = $('#' + Guideline.ID_select_phases);
    jqo_select_phases.empty();
    var selectedPhase = this.selectedIndex_phase;
    var activeIndication = this.active_Indication();
    if (activeIndication) {
        for (var i = 0; i < activeIndication.phases.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == selectedPhase)
                .text(activeIndication.phases[i].name)
                .appendTo(jqo_select_phases);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_phases.selectmenu('refresh');

};
Guideline.prototype.updatePhaseSpecificData = function () {
    var activeIPhase = this.active_Phase();
    if (activeIPhase) {
        activeIPhase.name = $('#' + Guideline.ID_text_phase_name).val();
        activeIPhase.acronym = $('#' + Guideline.ID_text_phase_acronym).val();
        activeIPhase.duration = $('#' + Guideline.ID_text_phase_duration).val();
    }
    //Update menu
    this.populatePhasesSelect();
};
Guideline.prototype.newPhaseTapped = function () {
    this.addPhaseToActiveIndication();
    this.displayPhases();
};

/* DRUGS*/
Guideline.prototype.displayDrugs = function () {
    this.populateDrugsSelect();
    this.displayTextsForDrug();
};
Guideline.prototype.displayTextsForDrug = function () {
    if (this.active_Drug()) {
        this.active_Drug().displayDrugsForGuideline();
    }
    else {
        emptyThisHanger(Drug.ID_hanger_drug_texts);
    }
};
Guideline.prototype.populateDrugsSelect = function () {
    var jqo_select_drugs = $('#' + Drug.ID_select_drugs);
    jqo_select_drugs.empty();
    var selectedDrug = this.selectedIndex_drug;
    var activePhase = this.active_Phase();
    if (activePhase) {
        for (var i = 0; i < activePhase.drugs.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == selectedDrug)
                .text(activePhase.drugs[i].name)
                .appendTo(jqo_select_drugs);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_drugs.selectmenu('refresh');
};
Guideline.prototype.selectDrugsChanged = function (index) {
    this.selectedIndex_drug = index;
    //update self
    this.displayTextsForDrug();
};
Guideline.prototype.updateDrugSpecificData = function () {
    var activeDrug = this.active_Drug();
    if (activeDrug) {
        activeDrug.name = $('#' + Drug.ID_text_drug_name).val();
    }
    //Update menu
    this.populateDrugsSelect();
};
Guideline.prototype.addDrugToActivePhase = function () {
    if (this.active_Phase()) {
        this.active_Phase().push(new Drug())
    }
};
