//Created by davidlewis on 09/05/2016.

// the global guideline
window.gActiveGuideline = undefined;

//    Objects for guidelines
function Guideline(name) {
    this.name = name || "Untitled";
    this.indications = [];
    this.dirtyTexts = 0;
}
//   STATICS
Guideline.jstring =
    '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADI_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADC_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';

//   IDs
Guideline.ID_editor_text_guideline_editor_name = "1editor_textguidelinename";
Guideline.ID_editor_hanger_guideline_editor_texts = "1editor_hangerguidelineeditortexts";
Guideline.ID_editor_hanger_guideline_editor_texts_Editor = "1editor-guideline-hanger";
Guideline.ID_editor_select_indications = "1editor_selectindication";
Guideline.ID_editor_header = "1page_header_editor";
Guideline.ID_editor_headertitle = "1page_headertitle_editor";


Guideline.ID_prescribe_menus_indications_hanger = "1prescribe_menus_indications_hanger";
Guideline.ID_prescribe_select_indications = "1prescribe_select_indications";
Guideline.ID_prescribe_header = "1page_header_prescribe";
Guideline.ID_editor_headertitle = "1page_headertitle_prescribe";

//STATICS
Guideline.selectedIndicationIndex_editor = function (newIndex) {
    if (newIndex) {
        jqo(Guideline.ID_editor_select_indications).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Guideline.ID_editor_select_indications).val();
    }
};
Guideline.createGlobalIfRequired = function () {
    if (window.gActiveGuideline == undefined) {
        window.gActiveGuideline = new Guideline("Untitled");
        window.gActiveGuideline.loadSettingsAndGlobals();
    }
};
//  INSTANCE
Guideline.prototype.constructor = Guideline;
//    IN OUTs
Guideline.prototype.loadSettingsAndGlobals = function () {
    this.initFromJSONstring(Guideline.jstring);

    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
    } else {
        // Sorry! No Web Storage support..
        console.log("Sorry! No Web Storage support");
    }
};
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
                        g.indications[i].phases[p].drugs[d].notes
                    );
                    console.log(g.indications[i].phases[p].drugs[d]);
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
Guideline.prototype.addExportButtonToHeader = function (headerID) {
    //EXPORT BUTTON
    var myself = this;
    $(document.createElement("button"))
        .addClass('ui-btn ui-btn-right ui-corner-all ui-icon-action ui-btn-icon-notext')
        .text('Export')
        .click(function () {
            myself.exportGuideline()
        })
        .appendTo(jqo(headerID));
};
Guideline.prototype.exportGuideline = function () {
    window.open().document.write(JSON.stringify(this));

};
//    ACTIVES
Guideline.prototype.active_Indication_editor = function () {
    return this.indications[Guideline.selectedIndicationIndex_editor()];
};
Guideline.prototype.active_Phase_editor = function () {
    return this.active_Indication_editor() ? this.active_Indication_editor().active_Phase_editor() : false;
};
Guideline.prototype.active_Drug_editor = function () {
    return this.active_Phase_editor() ? this.active_Phase_editor().active_Drug_editor() : false;
};
//    CREATE HTML
Guideline.prototype.createPagesAndDisplay_editing = function () {
    /*create structure*/
    window.gActiveGuideline.createPage_Editor();
    /*update display*/
    window.gActiveGuideline.displayGuideline_editing();

};
Guideline.prototype.createPage_Editor = function () {
    // closure over this via myself to give access to self, as when the anonymous mini function is called,  this->element_calling.
    // When that calls the prototype function this reverts to the Object again, so no need to pass this parameter
    var myself = this;
    var baseElement = jqo(Guideline.ID_editor_hanger_guideline_editor_texts_Editor);
    baseElement.empty();

    //back button
    $(document.createElement("a"))
        .addClass("ui-btn ui-btn-left ui-corner-all ui-icon-bullets ui-btn-icon-notext")
        .attr('href', '#page_prescribe')
        .text('View')
        .appendTo(jqo(Guideline.ID_editor_header));
    this.addExportButtonToHeader(Guideline.ID_editor_header);

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
Guideline.prototype.displayGuideline_editing = function () {
    this.displayTextsForGuideLine();
    //cascade down
    this.initialiseIndication();
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
// GLOBAL EVENTS
Guideline.prototype.someTextChanged = function (textID) {
    this.dirtyTexts = this.dirtyTexts | textID;
};
Guideline.prototype.selectmenuChanged = function (menuID) {
    switch (menuID) {
        case Guideline.ID_editor_select_indications:
            this.displayIndication();
            break;
        case Indication.ID_editor_select_phases:
            this.active_Phase_editor().displayPhase();
            break;
        case Phase.ID_editor_select_drugs:
            this.active_Drug_editor().displayDrugs();
            break;
        case Indication.ID_prescribe_select_weight:
            if (this.activeIndication_prescribe()) {
                this.activeIndication_prescribe().selectWeightChanged();
            }
            break;
        case Guideline.ID_prescribe_select_indications:
            this.selectIndicationsChanged();
            break;
        default:
            console.log('Not handled: ' + menuID);
            break;
    }
};
Guideline.prototype.addSomething = function (whatToAdd) {
    switch (whatToAdd) {
        case 'i':
            this.addIndication();
            break;
        case 'p':
            this.addPhase();
            break;
        case 'd':
            this.addDrug();
            break;
        default:
            break;
    }
};
Guideline.prototype.deleteSomething = function (whatToDelete) {
    //if (window.confirm("Are you sure?")) 
    {
        switch (whatToDelete) {
            case 'i':
                if (this.indications.length > Guideline.selectedIndicationIndex_editor()) {
                    this.indications.splice(Guideline.selectedIndicationIndex_editor(), 1);
                    this.initialiseIndication();
                }
                break;
            case 'p':
                if (this.active_Indication_editor()) {
                    this.active_Indication_editor().deletePhase();
                }
                break;
            case 'd':
                if (this.active_Phase_editor()) {
                    this.active_Phase_editor().deleteDrug();
                }
                break;
            default:
                break;
        }
    }
};

Guideline.prototype.confirmDelete = function (whatToDelete) {
    var myself = this;
    var popupQ = $(document.createElement("div")).attr({
        'data-role': "popup",
        'data-theme': 'a',
        'data-overlay-theme': "b"
    });
    var content = $(document.createElement("div"))
        .attr({'data-role': "main"})
        .addClass("ui-content")
        .appendTo(popupQ);
    $(document.createElement("h3"))
        .text("Warning: delete cannot be undone.")
        .appendTo(content);
    $(document.createElement("a"))
        .attr({'href': "#", 'data-rel': "back"})
        .addClass("ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a ui-icon-back ui-btn-icon-left")
        .text("Cancel")
        .appendTo(content);
    $(document.createElement("a"))
        .attr({'href': "#", 'data-rel': "back"})
        .addClass("ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-icon-delete ui-btn-icon-left")
        .text("Delete")
        .click(function () {
            myself.deleteSomething(whatToDelete)
        })
        .appendTo(content);

    popupQ.popup().popup('open');

};
//    INDICATIONS
//Display
Guideline.prototype.initialiseIndication = function () {
    this.populateIndicationsSelect();
    this.displayIndication();
};
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
    if (this.indications.length > 0) {
        jqo(Phase.ID_editor_hanger_phase).show();
    }
    else {
        jqo(Phase.ID_editor_hanger_phase).hide();
        jqo(Drug.ID_editor_hanger_drug).hide();
    }
};
Guideline.prototype.displayIndication = function () {
    if (this.active_Indication_editor()) {
        this.active_Indication_editor().displayIndication();
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
Guideline.prototype.addIndication = function () {
    this.indications.push(new Indication("Untitled"));
    this.populateIndicationsSelect();
    Guideline.selectedIndicationIndex_editor(this.indications.length - 1);
    this.active_Indication_editor().displayIndication();
};

//    PHASES Events
Guideline.prototype.addPhase = function () {
    if (this.active_Indication_editor()) {
        this.active_Indication_editor().addPhase();
    }
};

//    DRUGS Events
Guideline.prototype.addDrug = function () {

    if (this.active_Phase_editor()) {
        this.active_Phase_editor().addDrug();
    }
};

// PRESCRIBE
//Statics
Guideline.selectedIndicationIndex_prescribe = function (newIndex) {
    if (newIndex) {
        jqo(Guideline.ID_prescribe_select_indications).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Guideline.ID_prescribe_select_indications).val();
    }
};
//INSTANCE
Guideline.prototype.activeIndication_prescribe = function () {
    return this.indications[Guideline.selectedIndicationIndex_prescribe()];
};
Guideline.prototype.indicationsNames = function () {
    var namesArray = [];
    for (var i = 0; i < this.indications.length; i++) {
        namesArray.push(this.indications[i].name)
    }
    return namesArray;
};
Guideline.prototype.createPage_Prescribe = function () {
    // closure over this via myself to give access to self, as when the anonymous mini function is called,  this->element_calling.
    // When that calls the prototype function this reverts to the Object again, so no need to pass this parameter
    $(document.createElement("a"))
        .addClass("ui-btn ui-btn-left ui-corner-all ui-icon-edit ui-btn-icon-notext")
        .text('Edit')
        .attr('href', '#page_editor')
        .appendTo(jqo(Guideline.ID_prescribe_header));
    this.addExportButtonToHeader(Guideline.ID_prescribe_header);

    this.createSelectMenuIndications();
    if (this.activeIndication_prescribe) {
        this.activeIndication_prescribe().displayWeightAndIndication();
    }
    //Refresh
};

Guideline.prototype.createSelectMenuIndications = function () {
    var hanger = jqo(Guideline.ID_prescribe_menus_indications_hanger);
    hanger.empty();
    appendSelectMenuWithTheseOptions(hanger, Guideline.ID_prescribe_select_indications, this.indicationsNames(), "Indication", false);

    //create the selectmenu as created already in markup
    hanger.trigger('create');
};
// EVents
Guideline.prototype.selectIndicationsChanged = function () {
    if (this.activeIndication_prescribe()) {
        this.activeIndication_prescribe().displayWeightAndIndication();
    }
};

