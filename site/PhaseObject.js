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
Phase.ID_editor_hanger_phase_top = "editor_hanger_phase_top";
Phase.ID_editor_phase_button_add = "editor_phase_button_add";
Phase.ID_editor_phase_button_delete = "editor_phase_button_delete";
Phase.ID_editor_phase_button_save = "editor_phase_button_save";

Phase.ID_editor_hanger_phase_top_texts = "editor_hanger_phase_top_texts";
Phase.ID_editor_text_phase_name = "4editor_textphasename";
Phase.ID_editor_text_phase_duration = "4editor_textphaseduration";
Phase.ID_editor_text_phase_acronym = "4editor_textphaseacronym";
Phase.ID_editor_select_drugs = "4editor_selectdrugs";
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
// Create HTML
Phase.addEvents_ForGuideline_editor = function (baseElement, guideline) {

    //Indications Select &  buttons group
    jqo(Phase.ID_editor_phase_button_add).click(function () {
        guideline.addSomething('p')
    });
    jqo(Phase.ID_editor_phase_button_delete).click(function () {
        guideline.confirmDelete('p')
    });
    jqo(Indication.ID_editor_select_phases).change(function () {
        guideline.selectmenuChanged(Indication.ID_editor_select_phases)
    });
    jqo(Phase.ID_editor_phase_button_save).click(function () {
        guideline.saveObjectSpecificData('p')
    });

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
    var baseElement = jqo(Phase.ID_editor_hanger_phase_top_texts);
    emptyThisHangerWithID(Phase.ID_editor_hanger_phase_top_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_name, "Name", this.name);
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_duration, "Duration", this.duration);
    appendLabelAndTextValueTo(baseElement, Phase.ID_editor_text_phase_acronym, "Drugs Acronym", this.drugsAcronym);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Phase.ID_editor_hanger_phase_top_texts);

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
    switch (Drug.selectedHowDoseCalculatedIndex()) {
        case Drug.howDoseCalculatedOptionsIndex_Drug_mgKg:
            this.drugs.push(new Drug_mgKg());
            break;
        case Drug.howDoseCalculatedOptionsIndex_Drug_threshold:
            this.drugs.push(new Drug_threshold());
            break;
        case Drug.howDoseCalculatedOptionsIndex_Drug:
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
