/**
 * Created by davidlewis on 11/05/2016.
 */
function Indication(name) {
    this.name = name || "Untitled";
    this.phases = [];
}

Indication.prototype.constructor = Indication;

/* STATICS */
Indication.ID_hanger_indication = "hangerIndication";
Indication.ID_hanger_indication_texts = "hangerIndicationtexts";
Indication.ID_text_indication_name = "textindicationname";
Indication.ID_select_indications = "selectindication";


Indication.addElementsToThisHangerForGuideline = function (baseElement, guideline) {

    $(document.createElement("h4")).addClass("ui-bar ui-bar-b").text('Indications').appendTo(baseElement);

    //Indications Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Indication.ID_select_indications)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectIndicationsChanged($(this).val())
            })
            .attr({'id': Indication.ID_select_indications, 'name': Indication.ID_select_indications}))
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
                guideline.addIndication()
            }));

    //Texts Hanger
    $(document.createElement("div")).attr('id', Indication.ID_hanger_indication_texts).appendTo(baseElement);


    //Refresh
    baseElement.trigger('create');
};

/* INSTANCE */
Indication.prototype.constructor = Indication;
Indication.prototype.displayTextsForIndication = function () {
    var baseElement = $('#' + Indication.ID_hanger_indication_texts);
    emptyThisHangerWithID(Indication.ID_hanger_indication_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Indication.ID_text_indication_name, "Name", this.name);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Indication.ID_hanger_indication_texts);

};
