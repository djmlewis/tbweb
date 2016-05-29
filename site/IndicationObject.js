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
Indication.changed = 'I';


Indication.ID_editor_hanger_indication_top = "editor_hanger_indication_top";
Indication.ID_editor_indication_button_add = "Ieditor_indication_button_add";
Indication.ID_editor_indication_button_delete = "Ieditor_indication_button_delete";
Indication.ID_editor_indication_button_save = "Ieditor_indication_button_save";
Indication.ID_editor_hanger_indication_top_texts = "editor_hanger_indication_top_texts";
Indication.ID_editor_text_indication_name = "Ieditor_text_indication_name";
Indication.ID_editor_select_phases = "editor_select_phases";

Indication.ID_prescribe_select_weight = "Iprescribe_select_weight";
Indication.ID_prescribe_drugs_hanger = "Iui-field-contain-drugs-prescribe";

// STATIC FUNCTS
Indication.selectedPhaseIndex = function (newIndex) {
    if (newIndex) {
        jqo(Indication.ID_editor_select_phases).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Indication.ID_editor_select_phases).val();
    }
};

// Create HTML
Indication.completeHTMLsetup = function () {
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
Indication.prototype.weightCorrectedAsIndexForMenu = function (weight) {
    if (weight) {
        return weight - this.minWeight;
    } else {
        return this.weight - this.minWeight;
    }
};

// Save
Indication.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Indication.ID_editor_text_indication_name).val() || '???';

};

//DISPLAY INDIC
Indication.prototype.initialisePhase = function () {
    this.populatePhasesSelect();
    this.displayPhase();
};
Indication.prototype.displayIndication = function () {
    this.displayTextsForIndication();
    //cascade down
    this.initialisePhase();
};
Indication.prototype.displayTextsForIndication = function () {
    jqo(Indication.ID_editor_text_indication_name).val(this.name);
    
};

// PHASE display
Indication.prototype.populatePhasesSelect = function () {
    var jqo_select_phases = jqo(Indication.ID_editor_select_phases);
    jqo_select_phases.empty();
    for (var i = 0; i < this.phases.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(this.phases[i].name)
            .appendTo(jqo_select_phases);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_phases.selectmenu('refresh');
    if (this.phases.length > 0) {
        jqo(Drug.ID_editor_hanger_drug_top).show();
    }
    else {
        jqo(Drug.ID_editor_hanger_drug_top).hide();
    }

};
Indication.prototype.displayPhase = function () {
    if (this.active_Phase_editor()) {
        this.active_Phase_editor().displayPhase();
    }
    else {
        emptyThisHangerWithID(Phase.ID_editor_hanger_phase_top_texts);
        emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
        jqo(Indication.ID_editor_select_phases).empty().selectmenu('refresh');
        jqo(Phase.ID_editor_select_drugs).empty().selectmenu('refresh');
    }

};
//Events
Indication.prototype.addPhase = function () {
    this.phases.push(new Phase());
    this.populatePhasesSelect();
    Indication.selectedPhaseIndex(this.phases.length - 1);
    this.active_Phase_editor().displayPhase();
};
Indication.prototype.deletePhase = function () {
    if (this.phases.length > Indication.selectedPhaseIndex()) {
        this.phases.splice(Indication.selectedPhaseIndex(), 1);
        this.initialisePhase();
    }
};
// PRESCRIBE
Indication.prototype.populateSelectMenuWeight = function () {
    populateSelectWithTheseOptions(jqo(Indication.ID_prescribe_select_weight), this.arrayOfAcceptableWeights(), this.weightUnits);
    jqo(Indication.ID_prescribe_select_weight).val(this.weightCorrectedAsIndexForMenu()).selectmenu('refresh');

    //var hanger = jqo(Indication.ID_prescribe_menus_weight_hanger);
    //hanger.empty();
    //appendSelectMenuWithTheseOptions(hanger, Indication.ID_prescribe_select_weight, integerArrayFromTo(this.minWeight, this.maxWeight), "", "Weight", false);
    //create the selectmenu as created already in markup
    //hanger.trigger('create');
};
Indication.prototype.displayWeightAndIndication = function () {
    this.populateSelectMenuWeight();
    this.buildDrugsListsScaffoldAndDrugsLists();
    this.buildDrugsListsForPhases();
};
Indication.prototype.buildDrugsListsScaffoldAndDrugsLists = function () {
    var jqo_fieldcontain_drugs = jqo(Indication.ID_prescribe_drugs_hanger);
    jqo_fieldcontain_drugs.empty();

    //make a collapsible set for phases to hang on to
    var phasesTopSet = $(document.createElement("div"))
        .attr('data-role', 'collapsible-set')
        .attr('data-inset', 'false')
        .attr('data-collapsed-icon', 'false')
        .attr('data-expanded-icon', 'false');
    //cycle thru the phases
    var numPhases = this.phases.length;
    for (var ph = 0; ph < numPhases; ph++) {
        var header = $(document.createElement("h3")).text(this.phases[ph].name);
        header.append(acronymSpanForString(this.phases[ph].drugsAcronym));
        //add a collapsible to hang the drugs set on
        $(document.createElement("div"))
            .attr('data-role', 'collapsible')
            .attr('data-inset', 'false')
            // .attr('data-theme',themeLetter)
            .attr('data-collapsed', (ph == 0 ? "false" : "true"))
            .append(header)
            //make and add collapsible set for drugs in the phase, mark with unique ID so we can find it later for the drugs themselves
            .append
            (
                $(document.createElement("div"))
                    .attr('id', uniqueIDforDrugHangerDivInPhase(ph))
                    .attr('data-role', 'collapsible-set')
                    .attr('data-inset', 'false')
                    .attr('data-collapsed-icon', 'false')
                    .attr('data-expanded-icon', 'false')
                // .attr('data-theme',themeLetter)
            )
            //add the drugs collapsible to the drugs top set
            .appendTo(phasesTopSet);
    }
    // add the top set to the container
    phasesTopSet.appendTo(jqo_fieldcontain_drugs);
    //activate the collapsible set components
    jqo_fieldcontain_drugs.trigger("create");
};
Indication.prototype.buildDrugsListsForPhases = function () {
    //cycle thru the phases
    var jqo_fieldcontain_drugs = jqo(Indication.ID_prescribe_drugs_hanger);
    var numPhases = this.phases.length;
    for (var ph = 0; ph < numPhases; ph++) {
        var phaseDrugsCollSet = jqo(uniqueIDforDrugHangerDivInPhase(ph));
        // var themeLetter =  GLOBALS.themesForIndex(ph);
        phaseDrugsCollSet.empty();
        var numDrugs = this.phases[ph].drugs.length;
        for (var drug = 0; drug < numDrugs; drug++) {
            var aDrugDiv = $(document.createElement("div"))
                .attr('data-inset', 'false')
                .attr('data-role', 'collapsible');
            var drugObj = this.phases[ph].drugs[drug];
            // Add warnings
            var drugsInstructionsWarningsInfos = drugObj.doseWarningsCommentsArrayForWeight(this.weight);
            var header = $(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString);
            //header.append(acronymSpanForString(drugObj.acronym));
            aDrugDiv.append(header);

            Drug.addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.warningArray, true, aDrugDiv);
            Drug.addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.infoArray, false, aDrugDiv);
            //Add drug notes
            aDrugDiv.append($(document.createElement("p")).text(drugObj.notes));
            //Append to drug hanger
            aDrugDiv.appendTo(phaseDrugsCollSet);
        }
    }
    jqo_fieldcontain_drugs.trigger("create");
    jqo_fieldcontain_drugs.fieldcontain("refresh");
};

Indication.prototype.selectWeightChanged = function () {
    this.weight = parseInt($('#' + Indication.ID_prescribe_select_weight + ' option:selected').text());
    this.buildDrugsListsForPhases();
};
