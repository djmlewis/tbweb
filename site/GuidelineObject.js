//Created by davidlewis on 09/05/2016.
var useStored = true;

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
    '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADI_Isoniazid","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADC_Isoniazid","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DI_Ethambutol","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DC_Rifampicin","acronym":"","doseCalculationMethod":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';
// Dirty texts
Guideline.changed = 'G';

//   IDs
Guideline.ID_editor_hanger_top = "editor-top-hanger";
Guideline.ID_editor_button_saveguideline = "Geditor_button_saveguideline";
Guideline.ID_editor_hanger_guideline_editor_texts = "editor_hanger_guideline_texts";
Guideline.ID_editor_text_guideline_editor_name = "Geditor_text_guideline_editor_name";
Guideline.ID_editor_select_indications = "editor_select_indications";
Guideline.ID_editor_header = "page_header_editor";
Guideline.ID_editor_headertitle = "page_headertitle_editor";
Guideline.ID_editor_header_button_export = "Geditor_header_button_export";

Guideline.ID_prescribe_menus_indications_weight_hanger = "prescribe_menus_indications_weight_hanger";
Guideline.ID_prescribe_select_indications = "prescribe_select_indications";
Guideline.ID_prescribe_header = "page_header_prescribe";
Guideline.ID_prescribe_headertitle = "page_headertitle_prescribe";
Guideline.ID_prescribe_header_button_export = "Gprescribe_header_button_export";

// Keys
Guideline.keys_storage_guideline = 'guideline_webtbrx';

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

    if (window.localStorage && useStored) {
        var storedGuidelineString = localStorage.getItem(Guideline.keys_storage_guideline);
        if (storedGuidelineString === null) {
            console.log("initiated from JS and stored");
            this.initFromJSONstring(Guideline.jstring);
            this.saveGuidelineInLocalStorage();
        }
        else {
            console.log("initiated from stored");
            this.initFromJSONstring(storedGuidelineString);
        }
    }
    else {
        this.initFromJSONstring(Guideline.jstring);
        console.log("initiated from JS without storage");
    }
};
Guideline.prototype.initFromJSONstringObject = function (jasonStringObject) {
    if (jasonStringObject) {
        if (jasonStringObject.name) {
            this.name = jasonStringObject.name;
        }
        //this.indications is initialised in constructor
        if (jasonStringObject.indications) {
            for (var i = 0; i < jasonStringObject.indications.length; i++) // wont run if no indics
            {
                var indic = new Indication();
                indic.initFromJSONstringObject(jasonStringObject.indications[i]);
                this.indications.push(indic);
            }
        }
    }
};
Guideline.prototype.initFromJSONstring = function (jasonString) {
    if (jasonString) {
        var g = JSON.parse(jasonString);
        console.log(g);

        if (g) {
            this.initFromJSONstringObject(g);
        }
    }
};
Guideline.prototype.exportGuideline = function () {
    window.open().document.write(JSON.stringify(this));

};
Guideline.prototype.saveGuidelineInLocalStorage = function () {
    if (window.localStorage) {
        localStorage.setItem(Guideline.keys_storage_guideline, JSON.stringify(this));
        console.log('saved to storage');
    }
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
Guideline.prototype.completeHTMLsetup_Editor = function () {
    var myself = this;
    //add change events
    var page_editor_elements = $('#page_editor');
    page_editor_elements.find('[type=text],[type=number]').on('input propertychange paste', function () {
        myself.someTextInputChanged($(this).attr('id'));
    });
    page_editor_elements.find('select').change(function () {
        myself.selectmenuChanged($(this).attr('id'));
    });
    page_editor_elements.find('.ui-icon-check').click(function () {
        myself.saveSomething($(this).attr('id').charAt(0))
    });
    page_editor_elements.find('.ui-icon-plus').click(function () {
        myself.addSomething($(this).attr('id').charAt(0))
    });
    page_editor_elements.find('.ui-icon-minus').click(function () {
        myself.confirmDelete($(this).attr('id').charAt(0))
    });
    page_editor_elements.find('.ui-icon-action').click(function () {
        myself.exportGuideline()
    });

    //    INDCATIONS
    Indication.completeHTMLsetup_Editor();
    <!--PHASES-->
    Phase.completeHTMLsetup_Editor();
    <!--DRUGS-->
    Drug.completeHTMLsetup_Editor();
    Drug_mgKg.completeHTMLsetup_Editor();

};
//    Display GL
Guideline.prototype.displayGuideline_editing = function () {
    this.displayTextsForGuideLine();
    //cascade down
    this.initialiseIndication();
};
Guideline.prototype.displayTextsForGuideLine = function () {
    jqo(Guideline.ID_editor_text_guideline_editor_name).val(this.name);
};
//    Save
Guideline.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Guideline.ID_editor_text_guideline_editor_name).val() || '???';
};
// GLOBAL EVENTS
Guideline.prototype.someTextInputChanged = function (objectID) {
    var objectIDnum = parseInt(objectID.charAt(0));
    //console.log(objectID+'>>>'+objectIDnum);

    this.dirtyTexts = this.dirtyTexts | objectIDnum;
};
Guideline.prototype.selectmenuChanged = function (menuID) {
    console.log('handled: >>>' + menuID);

    switch (menuID) {
        case Guideline.ID_editor_select_indications:
            this.displayIndication();
            break;
        case Indication.ID_editor_select_phases:
            this.active_Phase_editor().displayPhase();
            break;
        case Phase.ID_editor_select_drugs:
            this.active_Drug_editor().displayDrugsEditor();
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
Guideline.prototype.saveSomething = function (whoWantsToSave) {
    console.log(whoWantsToSave);
    switch (whoWantsToSave) {
        case Guideline.changed:
            this.saveObjectSpecificData();
            break;
        case Indication.changed:
            if (this.active_Indication_editor()) {
                this.active_Indication_editor().saveObjectSpecificData();
            }
            break;
        case Phase.changed:
            if (this.active_Phase_editor()) {
                this.active_Phase_editor().saveObjectSpecificData();
            }
            break;
        case Drug.changed:
            if (this.active_Drug_editor()) {
                this.active_Drug_editor().saveObjectSpecificData();
            }
            break;

        default:
            break;
    }
    this.saveGuidelineInLocalStorage();
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
        jqo(Phase.ID_editor_hanger_phase_top).show();
    }
    else {
        jqo(Phase.ID_editor_hanger_phase_top).hide();
        jqo(Drug.ID_editor_hanger_drug_top).hide();
    }
};
Guideline.prototype.displayIndication = function () {
    if (this.active_Indication_editor()) {
        this.active_Indication_editor().displayIndication();
    }
    else {
        emptyThisHangerWithID(Indication.ID_editor_hanger_indication_top_texts);
        emptyThisHangerWithID(Phase.ID_editor_hanger_phase_top_texts);
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
Guideline.prototype.completeHTMLsetup_Prescribe = function () {
    var myself = this;
    //add change events
    var page_prescribe_elements = $('#page_prescribe');
    page_prescribe_elements.find('select').change(function () {
        myself.selectmenuChanged($(this).attr('id'));
    });

};
Guideline.prototype.displayGuideline_prescribe = function () {
    populateValidSelectIDWithTheseOptions(Guideline.ID_prescribe_select_indications, this.indicationsNames(), "");
    if (this.activeIndication_prescribe()) {
        this.activeIndication_prescribe().displayWeightAndIndication();
    }

};
// EVents
Guideline.prototype.selectIndicationsChanged = function () {
    if (this.activeIndication_prescribe()) {
        this.activeIndication_prescribe().displayWeightAndIndication();
    }
};

