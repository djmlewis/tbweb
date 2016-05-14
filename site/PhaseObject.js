/**
 * Created by davidlewis on 11/05/2016.
 */

function Phase(name, duration, drugsAcronym) {
    this.name = name || "Untitled";
    this.duration = duration || "";
    this.drugsAcronym = drugsAcronym || "";
    this.drugs = [];
}
// STATICS
Phase.ID_editor_hanger_phase_texts = "editor_hangerphasetexts";
Phase.ID_editor_text_phase_name = "editor_textphasename";
Phase.ID_editor_text_phase_duration = "editor_textphaseduration";
Phase.ID_editor_text_phase_acronym = "editor_textphaseacronym";
Phase.ID_editor_select_drugs = "editor_selectdrugs";
// STATIC FUNCTS
Phase.selectedDrugIndex = function (newIndex) {
    if (newIndex) {
        jqo(Phase.ID_editor_select_drugs).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Phase.ID_editor_select_drugs).val();
    }
};

// Actives
Phase.prototype.active_Drug = function () {
    return this.drugs[Phase.selectedDrugIndex()];
};

// INSTANCE
// PHASE
Phase.prototype.constructor = Phase;
// Create HTML
Phase.addElementsToThisHangerForGuideline_editor = function (baseElement, guideline) {

    $(document.createElement("h4")).addClass("ui-bar ui-bar-b ").text('Phases').appendTo(baseElement);

    //Phases Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Indication.ID_editor_select_phases)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectPhasesChanged()
            })
            .attr({'id': Indication.ID_editor_select_phases, 'name': Indication.ID_editor_select_phases}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                guideline.updatePhaseSpecificData()
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                guideline.addPhase()
            }));

    //Texts Hanger
    $(document.createElement("div")).attr('id', Phase.ID_editor_hanger_phase_texts).appendTo(baseElement);


    //Refresh
    baseElement.trigger('create');
};
// Display
Phase.prototype.displayPhase = function () {
    this.displayTextsForPhase();
    //cascade down
    this.populateDrugsSelect();
    this.displayDrugs();
};
Phase.prototype.displayTextsForPhase = function () {
    var baseElement = jqo(Phase.ID_editor_hanger_phase_texts);
    emptyThisHangerWithID(Phase.ID_editor_hanger_phase_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_name, "Name", this.name);
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_duration, "Duration", this.duration);
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_acronym, "Drugs Acronym", this.drugsAcronym);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Phase.ID_editor_hanger_phase_texts);

};
// Drugs
Phase.prototype.populateDrugsSelect = function () {
    var jqo_select_drugs = jqo(Phase.ID_editor_select_drugs);
    jqo_select_drugs.empty();
    for (var i = 0; i < this.drugs.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(this.drugs[i].name)
            .appendTo(jqo_select_drugs);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_drugs.selectmenu('refresh');
};
Phase.prototype.displayDrugs = function () {
    if (this.active_Drug()) {
        this.active_Drug().displayDrugs();
    }
    else {
        emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
        jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
Phase.prototype.addDrug = function () {
    switch (Drug.selectedHowDoseCalculatedString()) {
        case "mg/Kg":
            this.drugs.push(new Drug_mgKg());
            break;
        default:
            this.drugs.push(new Drug());
            break;
    }
    this.populateDrugsSelect();
    Phase.selectedDrugIndex(this.drugs.length - 1);
    this.active_Drug().displayDrugs();
};
