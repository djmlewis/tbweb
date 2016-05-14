//Created by davidlewis on 09/05/2016.


//    Objects for guidelines
function Guideline(name) {
    this.name = name || "Untitled";
    this.indications = [];
}
//   STATICS
//   IDs
Guideline.ID_editor_text_guideline_editor_name = "editor_textguidelinename";
Guideline.ID_editor_hanger_guideline_editor_texts = "editor_hangerguidelineeditortexts";
Guideline.ID_editor_hanger_guideline_editor_texts_Editor = "editor-guideline-hanger";
Guideline.ID_editor_select_indications = "editor_selectindication";

//STATICS
Guideline.selectedIndicationIndex = function (newIndex) {
    if (newIndex) {
        jqo(Guideline.ID_editor_select_indications).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Guideline.ID_editor_select_indications).val();
    }
};

//  INSTANCE
Guideline.prototype.constructor = Guideline;
//    IN OUTs
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
//    ACTIVES
Guideline.prototype.active_Indication = function () {
    return this.indications[Guideline.selectedIndicationIndex()];
};
Guideline.prototype.active_Phase = function () {
    return this.active_Indication() ? this.active_Indication().active_Phase() : false;
};
Guideline.prototype.active_Drug = function () {
    return this.active_Phase() ? this.active_Phase().active_Drug() : false;
};
//    CREATE HTML
Guideline.prototype.createPagesAndDisplay = function () {
    /*create structure*/
    gActiveGuideline.createPage_Editor();
    /*update display*/
    gActiveGuideline.displayGuideline();

};
Guideline.prototype.createPage_Editor = function () {
    // closure over this via myself to give access to self, as when the anonymous mini function is called,  this->element_calling.
    // When that calls the prototype function this reverts to the Object again, so no need to pass this parameter
    var myself = this;
    var baseElement = jqo(Guideline.ID_editor_hanger_guideline_editor_texts_Editor);
    baseElement.empty();

    //GUIDELINE BAR
    $(document.createElement("h3")).addClass("ui-bar ui-bar-b").text('Guideline').appendTo(baseElement);

    //Guideline buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.enterGuidelineSpecificData()
            }))
        .append//EXPORT BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-action ui-btn-icon-notext")
            .text('Export')
            .click(function () {
                myself.exportGuideline()
            }));

    //GUIDELINE Texts Hanger
    $(document.createElement("div")).attr('id', Guideline.ID_editor_hanger_guideline_editor_texts).appendTo(baseElement);


    //    INDCATIONS
    Indication.addElementsToThisHangerForGuideline_editor(baseElement, this);
    <!--PHASES-->
    Phase.addElementsToThisHangerForGuideline_editor(baseElement, this);
    <!--DRUGS-->
    Drug.addElementsToThisHangerForGuideline_editor(baseElement, this);

    //Refresh
    baseElement.trigger("create");
};

//    Display GL
Guideline.prototype.displayGuideline = function () {
    this.displayTextsForGuideLine();
    //cascade down
    this.populateIndicationsSelect();
    this.displayIndication();

};
Guideline.prototype.displayTextsForGuideLine = function () {
    var baseElement = jqo(Guideline.ID_editor_hanger_guideline_editor_texts);
    emptyThisHangerWithID(Guideline.ID_editor_hanger_guideline_editor_texts);
//Guideline Texts
    appendLabelAndTextValueTo(baseElement, Guideline.ID_editor_text_guideline_editor_name, "Name", this.name);
    //Refresh
    triggerCreateElementsOnThisHangerWithID(Guideline.ID_editor_hanger_guideline_editor_texts);
};
//    Save
Guideline.prototype.enterGuidelineSpecificData = function () {
    this.name = jqo(Guideline.ID_editor_text_guideline_editor_name).val();
};
//    INDICATIONS
//Display
Guideline.prototype.populateIndicationsSelect = function () {
    var jqo_select_indications = jqo(Guideline.ID_editor_select_indications);
    jqo_select_indications.empty();
    for (var i = 0; i < this.indications.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(this.indications[i].name)
            .appendTo(jqo_select_indications);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_indications.selectmenu('refresh');
};
Guideline.prototype.displayIndication = function () {
    if (this.active_Indication()) {
        this.active_Indication().displayIndication();
    }
    else {
        emptyThisHangerWithID(Indication.ID_editor_hanger_indication_texts);
        emptyThisHangerWithID(Phase.ID_editor_hanger_phase_texts);
        emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
        jqo(Guideline.ID_editor_select_indications).empty().selectmenu('refresh');
        jqo(Indication.ID_editor_select_phases).empty().selectmenu('refresh');
        jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }
};
//Events
Guideline.prototype.selectIndicationsChanged = function () {
    this.displayIndication();
};
Guideline.prototype.addIndication = function () {
    this.indications.push(new Indication());
    this.populateIndicationsSelect();
    Guideline.selectedIndicationIndex(this.indications.length - 1);
    this.active_Indication().displayIndication();
};
//    PHASES Events
Guideline.prototype.selectPhasesChanged = function () {
    this.active_Phase().displayPhase();
};
Guideline.prototype.addPhase = function () {
    if (this.active_Indication()) {
        this.active_Indication().addPhase();
    }
};

//    DRUGS Events
Guideline.prototype.selectDrugsChanged = function () {
    this.active_Drug().displayDrugs();
};
Guideline.prototype.addDrug = function () {

    if (this.active_Phase()) {
        this.active_Phase().addDrug();
    }
};
