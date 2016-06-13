/**
 * Created by davidlewis on 11/05/2016.
 */
function Indication(name, wtUnits, minWt, maxWt, startWeight) {
    this.name = name || "Untitled";
    this.weightUnits = wtUnits || 'Kg';
    this.minWeight = minWt || 30;
    this.maxWeight = maxWt || 100;
    this.startWeight = startWeight || 60;
    this.weight = this.startWeight;
    this.phases = [];
}

Indication.prototype.constructor = Indication;

// STATICS */
// Dirty texts


Indication.ID_editor_hanger_indication_top = "editor_hanger_indication_top";
Indication.ID_editor_indication_button_add = "Ieditor_indication_button_add";
Indication.ID_editor_indication_button_delete = "Ieditor_indication_button_delete";
Indication.ID_editor_indication_button_save = "Ieditor_indication_button_save";
Indication.ID_editor_hanger_indication_top_texts = "editor_hanger_indication_top_texts";
Indication.ID_editor_text_indication_name = "Ieditor_text_indication_name";
Indication.ID_editor_select_phases = "editor_select_phases";

Indication.ID_prescribe_select_weight = "Iprescribe_select_weight";
Indication.ID_prescribe_drugs_hanger = "Iprescribe_drugs_hanger";
Indication.ID_prescribe_drugs_list = "Iprescribe_drugs_list";

Indication.KEY_Data_PhaseDrug = 'diwi';

// STATIC FUNCTS
Indication.selectedPhaseIndex = function (newIndex) {
    if (newIndex) {
        jqo(Indication.ID_editor_select_phases).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Indication.ID_editor_select_phases).val();
    }
};

// Create HTML
Indication.completeHTMLsetup_Editor = function () {
};


// INSTANCE
Indication.prototype.constructor = Indication;
Indication.prototype.initFromJSONstringObject = function (jasonStringObject) {
    if (jasonStringObject) {
        if (jasonStringObject.name) {
            this.name = jasonStringObject.name;
        }
        if (jasonStringObject.weightUnits) {
            this.weightUnits = jasonStringObject.weightUnits;
        }
        if (jasonStringObject.minWeight) {
            this.minWeight = jasonStringObject.minWeight;
        }
        if (jasonStringObject.startWeight) {
            this.name = jasonStringObject.startWeight;
        }
        if (jasonStringObject.maxWeight) {
            this.name = jasonStringObject.maxWeight;
        }
        this.weight = this.startWeight;
        //this.phases is initialised in constructor
        if (jasonStringObject.phases) {
            for (var i = 0; i < jasonStringObject.phases.length; i++) {
                var phse = new Phase();
                phse.initFromJSONstringObject(jasonStringObject.phases[i]);
                this.phases.push(phse);
            }
        }
    }
};
//ACTIVES
Indication.prototype.active_Phase_editor = function () {
    return this.phases[jqo(Indication.ID_editor_select_phases).val()];
};
Indication.prototype.active_Drug_editor = function () {
    return this.active_Phase_editor() ? this.active_Phase_editor().active_Drug_editor() : false;
};
//Acceptable weight ranges
Indication.prototype.arrayOfAcceptableWeights = function () {
    return integerArrayFromTo(this.minWeight, this.maxWeight);
};

// Save
Indication.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Indication.ID_editor_text_indication_name).val() || '';
    window.gActiveGuideline.saveGuidelineInLocalStorage();
};

//DISPLAY INDIC
Indication.prototype.initialisePhase_editor = function () {
    this.populatePhasesSelectAndShowHideDrugsHanger_editor();
    this.displayPhase_editor();
};
Indication.prototype.displayIndication_editor = function () {
    this.displayTextsForIndication_editor();
    //cascade down
    this.initialisePhase_editor();
};
Indication.prototype.displayTextsForIndication_editor = function () {
    jqo(Indication.ID_editor_text_indication_name).val(this.name);
    
};

// PHASE display
Indication.prototype.phasesNames = function () {
    return extractNamesFromArray(this.phases)
};
Indication.prototype.populatePhasesSelectAndShowHideDrugsHanger_editor = function (initialIndex) {
    populateValidSelectIDWithTheseOptions(Indication.ID_editor_select_phases, this.phasesNames(), "", initialIndex);
    showTrueHideFalse(Drug.ID_editor_hanger_drug_top, this.phases.length > 0);

};
Indication.prototype.displayPhase_editor = function () {
    if (this.active_Phase_editor()) {
        this.active_Phase_editor().displayPhase_editor();
    }
    else {
        jqo(Phase.ID_editor_hanger_phase_top_texts).hide();
        jqo(Drug.ID_editor_hanger_drug_texts).hide();
        emptySelectArrayOfIDs([Indication.ID_editor_select_phases, Phase.ID_editor_select_drugs]);
        // jqo(Indication.ID_editor_select_phases).empty().selectmenu('refresh');
        // jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
//Events
Indication.prototype.addPhase = function () {
    this.phases.push(new Phase());
    this.populatePhasesSelectAndShowHideDrugsHanger_editor(this.phasesNames().length - 1);
    this.displayPhase_editor();
};
Indication.prototype.deletePhase = function () {
    if (this.phases.length > Indication.selectedPhaseIndex()) {
        this.phases.splice(Indication.selectedPhaseIndex(), 1);
        this.initialisePhase_editor();
    }
};
// PRESCRIBE
Indication.prototype.populateSelectMenuWeight_prescribe = function () {
    populateValidSelectIDWithTheseOptions(Indication.ID_prescribe_select_weight, this.arrayOfAcceptableWeights(), this.weightUnits, undefined, this.weight);
};
Indication.prototype.displayWeightAndIndication_prescribe = function () {
    this.populateSelectMenuWeight_prescribe();
    this.buildDrugsListsForPhases_prescribe();
};

Indication.prototype.buildDrugsListsForPhases_prescribe = function () {
    var jqo_drugs_list = jqo(Indication.ID_prescribe_drugs_list);
    jqo_drugs_list.empty();
    var myself = this;
    //cycle thru the phases
    var numPhases = this.phases.length;
    for (var ph = 0; ph < numPhases; ph++) {
        $(document.createElement("li"))
            .attr('data-role', "list-divider")
            .text(this.phases[ph].name)
            .appendTo(jqo_drugs_list);
        for (var drug = 0; drug < this.phases[ph].drugs.length; drug++) {
            var drugObj = this.phases[ph].drugs[drug];
            // Add instructions
            var drugsInstructionsWarningsInfos = drugObj.drugInstructionsInfosAlertsForWeight(this.weight);
            var iconName = (drugsInstructionsWarningsInfos.alerts.length > 0 ? "alert" : (drugsInstructionsWarningsInfos.infos.length > 0 ? "info" : "false"));
            $(document.createElement("li"))
                .attr('data-icon', iconName)
                .data('diwi', drugsInstructionsWarningsInfos)
                .click(function () {
                    myself.showInfosAlertsForDrugInPhase($(this).data('diwi'));
                })
                .append($(document.createElement("a"))
                    .attr('href', "#")
                    .text(drugsInstructionsWarningsInfos.instructions))
                .appendTo(jqo_drugs_list);
        }

    }
    jqo_drugs_list.listview('refresh');
};

Indication.prototype.showInfosAlertsForDrugInPhase = function (drugsInstructionsWarningsInfos) {

    var infopopup = jqo("infosPanel");//.panel();//jqo("page_popupdruginfos").popup();
    var content = jqo("druginstructionswarningsinfos_infos_panel").empty();
    var contentStrong = jqo("druginstructionswarningsinfos_alerts_panel").empty();
    jqo("druginstructionswarningsinfos_drugName_panel").text(drugsInstructionsWarningsInfos.drugName);
    //alerts
    for (var a = 0; a < drugsInstructionsWarningsInfos.alerts.length; a++) {
        contentStrong.append($(document.createElement("p")).text('⚠ ' + drugsInstructionsWarningsInfos.alerts[a]))
    }
    // infos
    for (var i = 0; i < drugsInstructionsWarningsInfos.infos.length; i++) {
        content.append($(document.createElement("p")).text(drugsInstructionsWarningsInfos.infos[i]))
    }

    infopopup.trigger("updatelayout");

    infopopup.panel("open");

    //infopopup.popup('open');
};

Indication.selectedWeight_Prescribe = function () {
    return selectedValueFromSelectWithID(Indication.ID_prescribe_select_weight);
};
Indication.prototype.selectWeightChanged_prescribe = function () {
    this.weight = Indication.selectedWeight_Prescribe();
    this.buildDrugsListsForPhases_prescribe();
};
