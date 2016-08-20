/**
 * Created by davidlewis on 11/05/2016.
 */

function Phase(name, duration, drugsAcronym) {
    this.classSelectors = ["#Phase"];
    this.name = name || "Untitled";
    this.duration = duration || "";
    this.drugsAcronym = drugsAcronym || "";
    this.drugs = [];

}
// STATICS
// Dirty texts

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
                    case Drug.doseCalculationMethodOptionsIndex_Drug:
                        newdrugOfType = new Drug();
                        break;
                    case Drug.doseCalculationMethodOptionsIndex_Drug_mgKg:
                        newdrugOfType = new Drug_mgKg();
                        break;
                    case Drug.doseCalculationMethodOptionsIndex_Drug_threshold:
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
Phase.completeHTMLsetup_Editor = function () {
};
// Save
Phase.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Phase.ID_editor_text_phase_name).val() || '';
    this.duration = jqo(Phase.ID_editor_text_phase_duration).val() || '';
    this.drugsAcronym = jqo(Phase.ID_editor_text_phase_acronym).val() || '';
    window.gActiveGuideline.saveGuidelineInLocalStorage();
};

// Display
Phase.prototype.displayPhase_editor = function () {
    this.displayTextsForPhase_editor();
    //cascade down
    this.initialiseDrugs_editor();
};
Phase.prototype.initialiseDrugs_editor = function () {
    this.populateDrugsSelect_editor();
    this.displayDrugs_editor();
};
Phase.prototype.displayTextsForPhase_editor = function () {
    jqo(Phase.ID_editor_text_phase_name).val(this.name);
    jqo(Phase.ID_editor_text_phase_duration).val(this.duration);
    jqo(Phase.ID_editor_text_phase_acronym).val(this.drugsAcronym);

};
// Drugs
Phase.prototype.drugsNames = function () {
    return extractNamesFromArray(this.drugs);
};
Phase.prototype.populateDrugsSelect_editor = function (initialIndex) {
    populateValidSelectIDWithTheseOptions(Phase.ID_editor_select_drugs, this.drugsNames(), "", initialIndex);
};
Phase.prototype.displayDrugs_editor = function () {
    if (this.active_Drug_editor()) {
        this.active_Drug_editor().displayDrugs_editor();
    }
    else {
        jqo(Drug.ID_editor_hanger_drug_texts).hide();
        emptySelectArrayOfIDs([Phase.ID_editor_select_drugs]);
        //jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
Phase.prototype.addDrug = function () {
    switch (Drug.selectedDoseCalculationMethodIndex()) {
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
    this.populateDrugsSelect_editor(this.drugsNames().length - 1);
    this.active_Drug_editor().displayDrugs_editor();
};
Phase.prototype.deleteDrug = function () {
    if (this.drugs.length > Phase.selectedDrugIndex()) {
        this.drugs.splice(Phase.selectedDrugIndex(), 1);
        this.initialiseDrugs_editor();
    }
};
Phase.prototype.deleteThreshold = function () {
    console.log('delete thereshold');
};
