/**
 * Created by davidlewis on 11/05/2016.
 */

function Phase(name, duration, drugsAcronym) {
    this.name = name || "Untitled";
    this.duration = duration || "";
    this.drugsAcronym = drugsAcronym || "";
    this.drugs = [];
}
Phase.prototype.constructor = Phase;
/* STATICS */
Phase.ID_hanger_phase_texts = "hangerphasetexts";
Phase.ID_select_phases = "selectphases";
Phase.ID_text_phase_name = "textphasename";
Phase.ID_text_phase_duration = "textphaseduration";
Phase.ID_text_phase_acronym = "textphaseacronym";


Phase.addElementsToThisHangerForGuideline = function (baseElement, guideline) {

    $(document.createElement("h4")).addClass("ui-bar ui-bar-b").text('Phases').appendTo(baseElement);

    //Phases Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Phase.ID_select_phases)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectPhasesChanged($(this).val())
            })
            .attr({'id': Phase.ID_select_phases, 'name': Phase.ID_select_phases}))
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
                guideline.addPhaseToActiveIndication()
            }));

    //Texts Hanger
    $(document.createElement("div")).attr('id', Phase.ID_hanger_phase_texts).appendTo(baseElement);


    //Refresh
    baseElement.trigger('create');
};
Phase.prototype.displayTextsForPhase = function () {
    var baseElement = $('#' + Phase.ID_hanger_phase_texts);
    emptyThisHangerWithID(Phase.ID_hanger_phase_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Phase.ID_text_phase_name, "Name", this.name);
    appendLabelAndTextValueTo(baseElement, Phase.ID_text_phase_duration, "Duration", this.duration);
    appendLabelAndTextValueTo(baseElement, Phase.ID_text_phase_acronym, "Drugs Acronym", this.drugsAcronym);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Phase.ID_hanger_phase_texts);

};
