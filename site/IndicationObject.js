/**
 * Created by davidlewis on 11/05/2016.
 */
function Indication(name) {
    this.name = name || "Untitled";
    this.phases = [];

}

Indication.prototype.constructor = Indication;

// STATICS */
Indication.ID_editor_hanger_indication = "editor_hangerIndication";
Indication.ID_editor_hanger_indication_texts = "editor_hangerIndicationtexts";
Indication.ID_editor_text_indication_name = "editor_textindicationname";
Indication.ID_editor_select_phases = "editor_selectphases";

// STATIC FUNCTS
Indication.selectedPhaseIndex = function (newIndex) {
    if (newIndex) {
        jqo(Indication.ID_editor_select_phases).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Indication.ID_editor_select_phases).val();
    }
};

// Create HTML
Indication.addElementsToThisHangerForGuideline_editor = function (baseElement, guideline) {
    var indicationHanger = $(document.createElement("div"))
        .attr('id', Indication.ID_editor_hanger_indication)
        .appendTo(baseElement);


    $(document.createElement("h4")).addClass("ui-bar ui-bar-b ").text('Indications').appendTo(indicationHanger);

    //Indications Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(indicationHanger)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_editor_select_indications)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectmenuChanged(Guideline.ID_editor_select_indications)
            })
            .attr({'id': Guideline.ID_editor_select_indications, 'name': Guideline.ID_editor_select_indications}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                guideline.updateIndicationSpecificData()
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                guideline.addSomething('i')
            }))
        .append//- BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-minus ui-btn-icon-notext")
            .text('Delete')
            .click(function () {
                guideline.deleteSomething('i')
            }));

    //Texts Hanger
    $(document.createElement("div")).attr('id', Indication.ID_editor_hanger_indication_texts).appendTo(indicationHanger);


    //Refresh
    indicationHanger.trigger('create');
};

// INSTANCE
Indication.prototype.constructor = Indication;
//ACTIVES
Indication.prototype.active_Phase = function () {
    return this.phases[jqo(Indication.ID_editor_select_phases).val()];
};
Indication.prototype.active_Drug = function () {
    return this.active_Phase() ? this.active_Phase().active_Drug() : false;
};

//DISPLAY INDIC
Indication.prototype.initialisePhase = function () {
    this.populatePhasesSelect();
    this.displayPhase();
};
Indication.prototype.displayIndication = function () {
    this.displayTextsForIndication();
    //cascade down
    this.initialisePhase();
};
Indication.prototype.displayTextsForIndication = function () {
    var baseElement = jqo(Indication.ID_editor_hanger_indication_texts);
    emptyThisHangerWithID(Indication.ID_editor_hanger_indication_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Indication.ID_editor_text_indication_name, "Name", this.name);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Indication.ID_editor_hanger_indication_texts);

};

// PHASE display
Indication.prototype.populatePhasesSelect = function () {
    var jqo_select_phases = jqo(Indication.ID_editor_select_phases);
    jqo_select_phases.empty();
    for (var i = 0; i < this.phases.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(this.phases[i].name)
            .appendTo(jqo_select_phases);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_phases.selectmenu('refresh');
    if (this.phases.length > 0) {
        jqo(Drug.ID_editor_hanger_drug).show();
    }
    else {
        jqo(Drug.ID_editor_hanger_drug).hide();
    }

};
Indication.prototype.displayPhase = function () {
    if (this.active_Phase()) {
        this.active_Phase().displayPhase();
    }
    else {
        emptyThisHangerWithID(Phase.ID_editor_hanger_phase_texts);
        emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
        jqo(Indication.ID_editor_select_phases).empty().selectmenu('refresh');
        jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
//Events
Indication.prototype.addPhase = function () {
    this.phases.push(new Phase());
    this.populatePhasesSelect();
    Indication.selectedPhaseIndex(this.phases.length - 1);
    this.active_Phase().displayPhase();
};
Indication.prototype.deletePhase = function () {
    if (this.phases.length > Indication.selectedPhaseIndex()) {
        this.phases.splice(Indication.selectedPhaseIndex(), 1);
        this.initialisePhase();
    }
};
