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
// Dirty texts
Phase.changed = 'P';

Phase.ID_editor_hanger_phase_top = "editor_hanger_phase_top";
Phase.ID_editor_phase_button_add = "Peditor_phase_button_add";
Phase.ID_editor_phase_button_delete = "Peditor_phase_button_delete";
Phase.ID_editor_phase_button_save = "Peditor_phase_button_save";

Phase.ID_editor_hanger_phase_top_texts = "editor_hanger_phase_top_texts";
Phase.ID_editor_text_phase_name = "Peditor_text_phase_name";
Phase.ID_editor_text_phase_duration = "Peditor_text_phase_duration";
Phase.ID_editor_text_phase_acronym = "Peditor_text_phase_acronym";
Phase.ID_editor_select_drugs = "editor_select_drugs";
// STATIC FUNCTS
Phase.selectedDrugIndex = function (newIndex) {
    if (newIndex) {
        jqo(Phase.ID_editor_select_drugs).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Phase.ID_editor_select_drugs).val();
    }
};

// Actives
Phase.prototype.active_Drug_editor = function () {
    return this.drugs[Phase.selectedDrugIndex()];
};

// INSTANCE
// PHASE
Phase.prototype.constructor = Phase;
Phase.prototype.initFromJSONstringObject = function (jasonStringObject) {
    if (jasonStringObject) {
        if (jasonStringObject.name) {
            this.name = jasonStringObject.name;
        }
        if (jasonStringObject.duration) {
            this.duration = jasonStringObject.duration;
        }
        if (jasonStringObject.drugsAcronym) {
            this.drugsAcronym = jasonStringObject.drugsAcronym;
        }
        //this.drugs is initialised in constructor
        if (jasonStringObject.drugs) {
            for (var i = 0; i < jasonStringObject.drugs.length; i++) {
                var newdrugOfType;
                switch (jasonStringObject.drugs[i].doseCalculationMethod) {
                    case Drug.doseCalculationMethodOptions_Name_Drug_Directed:
                        newdrugOfType = new Drug();
                        break;
                    case Drug.doseCalculationMethodOptions_Name_Drug_mgKg:
                        newdrugOfType = new Drug_mgKg();
                        break;
                    case Drug.doseCalculationMethodOptions_Name_Drug_threshold:
                        newdrugOfType = new Drug_threshold();
                        break;
                    default:
                        newdrugOfType = new Drug();
                        break;
                }
                newdrugOfType.initFromJSONstringObject(jasonStringObject.drugs[i]);
                this.drugs.push(newdrugOfType);
            }
        }
    }
};

// Create HTML
Phase.completeHTMLsetup = function () {
};
// Save
Phase.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Phase.ID_editor_text_phase_name).val() || '???';
    this.duration = jqo(Phase.ID_editor_text_phase_duration).val() || '???';
    this.drugsAcronym = jqo(Phase.ID_editor_text_phase_acronym).val() || '???';

};

// Display
Phase.prototype.displayPhase = function () {
    this.displayTextsForPhase();
    //cascade down
    this.initialiseDrugs();
};
Phase.prototype.initialiseDrugs = function () {
    this.populateDrugsSelect();
    this.displayDrugsEditor();
};
Phase.prototype.displayTextsForPhase = function () {
    jqo(Phase.ID_editor_text_phase_name).val(this.name);
    jqo(Phase.ID_editor_text_phase_duration).val(this.duration);
    jqo(Phase.ID_editor_text_phase_acronym).val(this.drugsAcronym);

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
Phase.prototype.displayDrugsEditor = function () {
    if (this.active_Drug_editor()) {
        this.active_Drug_editor().displayDrugsEditor();
    }
    else {
        emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
        jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
Phase.prototype.addDrug = function () {
    switch (Drug.selecteddoseCalculationMethodIndex()) {
        case Drug.doseCalculationMethodOptionsIndex_Drug_mgKg:
            this.drugs.push(new Drug_mgKg());
            break;
        case Drug.doseCalculationMethodOptionsIndex_Drug_threshold:
            this.drugs.push(new Drug_threshold());
            break;
        case Drug.doseCalculationMethodOptionsIndex_Drug:
            this.drugs.push(new Drug());
            break;
        default:
            console.log('no drug');
    }
    this.populateDrugsSelect();
    Phase.selectedDrugIndex(this.drugs.length - 1);
    this.active_Drug_editor().displayDrugsEditor();
};
Phase.prototype.deleteDrug = function () {
    if (this.drugs.length > Phase.selectedDrugIndex()) {
        this.drugs.splice(Phase.selectedDrugIndex(), 1);
        this.initialiseDrugs();
    }
};
