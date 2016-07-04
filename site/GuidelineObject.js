//Created by davidlewis on 09/05/2016.
var useStored = false;

// the global guideline
window.gActiveGuideline = undefined;


//    Objects for guidelines
function Guideline(name) {
    this.classSelectors = ["#Guideline"];
    this.name = name || "Untitled";
    this.indications = [];
    this.dirtyTexts = 0;
}
//   STATICS
Guideline.jstring = '{"classSelectors":["#Guideline"],"name":"WHO","indications":[{"classSelectors":["#Indication"],"name":"Adults Daily","weightUnits":"Kg","minWeight":30,"maxWeight":100,"startWeight":60,"weight":60,"phases":[{"classSelectors":["#Phase"],"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"classSelectors":["#Drug","#Drug_threshold"],"name":"threshes drug","acronym":"TD","doseCalculationMethod":2,"units":"threshes","notes":"threshes notes","thresholds":[{"classSelectors":["#Threshold"],"thresholdTriggerWeight":100,"thresholdComparator":"1","thresholdDose":"max dose"}]}]},{"classSelectors":["#Phase"],"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"classSelectors":["#Drug","#Drug_mgKg"],"name":"ADC_Isoniazid","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"roundval":50,"roundirect":1},{"classSelectors":["#Drug","#Drug_mgKg"],"name":"ADC_Rifampicin","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"roundval":150,"roundirect":1}]}]},{"classSelectors":["#Indication"],"name":"DOTs","weightUnits":"Kg","minWeight":30,"maxWeight":100,"startWeight":60,"weight":60,"phases":[{"classSelectors":["#Phase"],"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"classSelectors":["#Drug","#Drug_mgKg"],"name":"DI_Ethambutol","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"roundval":100,"roundirect":1}]},{"classSelectors":["#Phase"],"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"classSelectors":["#Drug","#Drug_mgKg"],"name":"DC_Rifampicin","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"roundval":150,"roundirect":1}]}]}],"dirtyTexts":0}';
//    '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADI_Isoniazid","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"roundval":50,"roundirect":1},{"name":"ADI_Rifampicin","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"roundval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"roundval":100,"roundirect":1},{"name":"ADI_Ethambutol","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"roundval":100,"roundirect":1}]},{"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADC_Isoniazid","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"roundval":50,"roundirect":1},{"name":"ADC_Rifampicin","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"roundval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DI_Ethambutol","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"roundval":100,"roundirect":1}]},{"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DC_Rifampicin","acronym":"","doseCalculationMethod":1,"units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"roundval":150,"roundirect":1}]}]}]}';
// Dirty texts

//   IDs
Guideline.ID_editor_hanger_top = "editor-top-hanger";
Guideline.ID_editor_button_saveguideline = "Geditor_button_saveguideline";
Guideline.ID_editor_hanger_guideline_editor_texts = "editor_hanger_guideline_texts";
Guideline.ID_editor_text_guideline_editor_name = "Geditor_text_guideline_editor_name";
Guideline.ID_editor_select_indications = "editor_select_indications";
Guideline.ID_editor_header = "page_header_editor";
Guideline.ID_editor_bar_header_guideline = "bar_header_guideline";
Guideline.ID_editor_header_button_export = "Geditor_header_button_export";
Guideline.KEY_objectType_Guideline = 'G';
Guideline.KEY_objectType_Indication = 'I';
Guideline.KEY_objectType_Phase = 'P';
Guideline.KEY_objectType_Drug = 'D';
Guideline.KEY_objectType_Threshold = 'T';

Guideline.ID_prescribe_menus_indications_weight_hanger = "prescribe_menus_indications_weight_hanger";
Guideline.ID_prescribe_select_indications = "prescribe_select_indications";
Guideline.ID_prescribe_header = "page_header_prescribe";
Guideline.ID_prescribe_headertitle = "page_headertitle_prescribe";
Guideline.ID_prescribe_header_button_export = "Gprescribe_header_button_export";

Guideline.ID_export_content_hanger = "export_content_hanger";

Guideline.ID_popup_deletepopup_button_delete = "button_popupdelete";
Guideline.ID_popup_deletepopup_button_delete_key_ID = "whattodelete";
Guideline.ID_popup_deletepopup = "page_popupdelete";
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
// GLOBALISED  ACTIVES
Guideline.global_active_Indication_editor = function () {
    return window.gActiveGuideline.active_Indication_editor();
};
Guideline.global_active_Phase_editor = function () {
    return window.gActiveGuideline.active_Phase_editor();
};
Guideline.global_active_Drug_editor = function () {
    return window.gActiveGuideline.active_Drug_editor();
};

//  INSTANCE
Guideline.prototype.constructor = Guideline;
Guideline.prototype = Object.create(EditableDataObject.prototype);
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
        if (g) {
            this.initFromJSONstringObject(g);
        }
    }
};
Guideline.prototype.exportGuideline = function () {
    //window.open().document.write(JSON.stringify(this));
    console.log(JSON.stringify(this));
    var content = jqo(Guideline.ID_export_content_hanger);
    content.empty();
    content.append(JSON.stringify(this));
    content.trigger('refresh');
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

    //    INDCATIONS
    Indication.completeHTMLsetup_Editor();
    <!--PHASES-->
    Phase.completeHTMLsetup_Editor();
    <!--DRUGS-->
    Drug.completeHTMLsetup_Editor();
    Drug_mgKg.completeHTMLsetup_Editor();
    Drug_threshold.completeHTMLsetup_Editor();

};
//    Display GL
Guideline.prototype.displayGuideline_editing = function () {
    this.displayObjectSpecificData();
    jqo(Guideline.ID_editor_bar_header_guideline).text(this.name || "");
    //cascade down
    this.initialiseIndication();
};
//    Save
Guideline.prototype.saveObjectSpecificData = function () {
    EditableDataObject.prototype.saveObjectSpecificData.call(this);
    jqo(Guideline.ID_editor_bar_header_guideline).text(this.name || "");

};
// GLOBAL EVENTS
Guideline.prototype.someTextInputChanged = function (objectID) {
    var objectIDnum = parseInt(objectID.charAt(0));
    //console.log(objectID+'>>>'+objectIDnum);

    this.dirtyTexts = this.dirtyTexts | objectIDnum;
};
Guideline.prototype.selectmenuChanged = function (menuID) {
    switch (menuID) {
        case Guideline.ID_editor_select_indications:
            this.displayIndication_editor();
            break;
        case Indication.ID_editor_select_phases:
            this.active_Phase_editor().displayPhase_editor();
            break;
        case Phase.ID_editor_select_drugs:
            this.active_Drug_editor().displayDrugs_editor();
            break;
        case Indication.ID_prescribe_select_weight:
            if (this.activeIndication_prescribe()) {
                this.activeIndication_prescribe().selectWeightChanged_prescribe();
            }
            break;
        case Drug_threshold.ID_editor_select_thresholds:
            this.active_Drug_editor().selectThresholdsChanged();
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
    switch (whoWantsToSave) {
        case Guideline.KEY_objectType_Guideline:
            this.saveObjectSpecificData();
            break;
        case Guideline.KEY_objectType_Indication:
            if (this.active_Indication_editor()) {
                this.active_Indication_editor().saveObjectSpecificData();
                this.populateIndicationsSelect_Editor(Guideline.selectedIndicationIndex_editor());
            }
            break;
        case Guideline.KEY_objectType_Phase:
            if (this.active_Phase_editor()) {
                this.active_Phase_editor().saveObjectSpecificData();
                this.active_Indication_editor().populatePhasesSelectAndShowHideDrugsHanger_editor(Indication.selectedPhaseIndex());
            }
            break;
        case Guideline.KEY_objectType_Drug:
            if (this.active_Drug_editor()) {
                this.active_Drug_editor().saveObjectSpecificData();
                this.active_Phase_editor().populateDrugsSelect_editor(Phase.selectedDrugIndex());
            }
            break;
        case Guideline.KEY_objectType_Threshold:
            if (this.active_Drug_editor()) {
                this.active_Drug_editor().saveThreshold();
                this.active_Drug_editor().populateThresholdsSelect(Drug_threshold.selectedThresholdIndex_editor());
            }
            break;
        default:
            break;
    }
    this.saveGuidelineInLocalStorage();
};
Guideline.prototype.addSomething = function (whatToAdd) {
    switch (whatToAdd) {
        case Guideline.KEY_objectType_Indication:
            this.addIndication();
            break;
        case Guideline.KEY_objectType_Phase:
            this.addPhase();
            break;
        case Guideline.KEY_objectType_Drug:
            this.addDrug();
            break;
        case Guideline.KEY_objectType_Threshold:
            this.addThreshold();
            break;
        default:
            break;
    }
    scrollIDIntoView('bottomOf_editor');
};
Guideline.prototype.deleteSomething = function (whatToDelete) {
    switch (whatToDelete) {
        case Guideline.KEY_objectType_Indication:
            if (this.indications.length > Guideline.selectedIndicationIndex_editor()) {
                this.indications.splice(Guideline.selectedIndicationIndex_editor(), 1);
                this.initialiseIndication();
            }
            break;
        case Guideline.KEY_objectType_Phase:
            if (this.active_Indication_editor()) {
                this.active_Indication_editor().deletePhase();
            }
            break;
        case Guideline.KEY_objectType_Drug:
            if (this.active_Phase_editor()) {
                this.active_Phase_editor().deleteDrug();
            }
            break;
        case Guideline.KEY_objectType_Threshold:
            if (this.active_Drug_editor()) {
                this.active_Drug_editor().deleteThreshold();
            }
            break;
        default:
            break;
    }
    this.saveGuidelineInLocalStorage();
};
Guideline.prototype.confirmDelete = function (whatToDelete) {
    var myself = this;
    jqo(Guideline.ID_popup_deletepopup).popup();
    jqo(Guideline.ID_popup_deletepopup_button_delete).data(Guideline.ID_popup_deletepopup_button_delete_key_ID, whatToDelete);
    jqo(Guideline.ID_popup_deletepopup_button_delete).click(function () {
        myself.deleteSomething($(this).data(Guideline.ID_popup_deletepopup_button_delete_key_ID))
    });

    jqo(Guideline.ID_popup_deletepopup).popup('open');

};
//    INDICATIONS
//Display
Guideline.prototype.initialiseIndication = function () {
    this.populateIndicationsSelect_Editor();
    this.displayIndication_editor();
};
Guideline.prototype.populateIndicationsSelect_Editor = function (initialIndex) {
    populateValidSelectIDWithTheseOptions(Guideline.ID_editor_select_indications, this.indicationsNames(), "", initialIndex);
    showTrueHideFalse(Phase.ID_editor_hanger_phase_top, this.indications.length > 0);
    showTrueHideFalse(Drug.ID_editor_hanger_drug_top, this.indications.length > 0);
};
Guideline.prototype.displayIndication_editor = function () {
    if (this.active_Indication_editor()) {
        this.active_Indication_editor().displayIndication_editor();
    }
    else {
        jqo(Indication.ID_editor_hanger_indication_top_texts).hide();
        jqo(Phase.ID_editor_hanger_phase_top_texts).hide();
        jqo(Drug.ID_editor_hanger_drug_texts).hide();
        emptySelectArrayOfIDs([Guideline.ID_editor_select_indications, Indication.ID_editor_select_phases, Phase.ID_editor_select_drugs]);
        // jqo(Guideline.ID_editor_select_indications).empty().selectmenu('refresh');
        // jqo(Indication.ID_editor_select_phases).empty().selectmenu('refresh');
        // jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }
};
//Events
Guideline.prototype.addIndication = function () {
    this.indications.push(new Indication("Untitled"));
    this.populateIndicationsSelect_Editor(this.indicationsNames().length - 1);
    this.active_Indication_editor().displayIndication_editor();
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
Guideline.prototype.addThreshold = function () {
    console.log('add threshold');
    if (this.active_Drug_editor()) {
        this.active_Drug_editor().addThreshold();
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
    return extractNamesFromArray(this.indications)
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
        this.activeIndication_prescribe().displayWeightAndIndication_prescribe();
    }

};
// EVents
Guideline.prototype.selectIndicationsChanged = function () {
    if (this.activeIndication_prescribe()) {
        this.activeIndication_prescribe().displayWeightAndIndication_prescribe();
    }
};

