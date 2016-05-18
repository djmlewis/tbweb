/**
 * Created by davidlewis on 11/05/2016.
 */
function Indication(name, guideline) {
    this.name = name || "Untitled";
    this.minWeight = 30;
    this.startWeight = 60;
    this.maxWeight = 100;
    this.weight = this.startWeight;
    this.phases = [];
    this.guideline = guideline;
}

Indication.prototype.constructor = Indication;

// STATICS */
Indication.ID_editor_hanger_indication = "2editor_hangerIndication";
Indication.ID_editor_hanger_indication_texts = "2editor_hangerIndicationtexts";
Indication.ID_editor_text_indication_name = "2editor_textindicationname";
Indication.ID_editor_select_phases = "2editor_selectphases";
Indication.ID_prescribe_menus_weight_hanger = "2prescribe_menus_weight_hanger";
Indication.ID_prescribe_select_weight = "2prescribe_select_weight";
Indication.ID_prescribe_drugs_hanger = "2ui-field-contain-drugs-prescribe";

// STATIC FUNCTS
Indication.selectedPhaseIndex = function (newIndex) {
    if (newIndex) {
        jqo(Indication.ID_editor_select_phases).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Indication.ID_editor_select_phases).val();
    }
};

// Create HTML
Indication.addElementsToThisHangerForGuideline_editor = function (baseElement, guideline) {
    var indicationHanger = $(document.createElement("div"))
        .attr('id', Indication.ID_editor_hanger_indication)
        .appendTo(baseElement);


    $(document.createElement("h4")).addClass("ui-bar ui-bar-b ").text('Indications').appendTo(indicationHanger);

    //Indications Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(indicationHanger)
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Guideline.ID_editor_select_indications)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectmenuChanged(Guideline.ID_editor_select_indications)
            })
            .attr({'id': Guideline.ID_editor_select_indications, 'name': Guideline.ID_editor_select_indications}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                guideline.addSomething('i')
            }))
        .append//- BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-minus ui-btn-icon-notext")
            .text('Delete')
            .click(function () {
                guideline.deleteSomething('i')
            }));

    //Texts Hanger
    $(document.createElement("div")).attr('id', Indication.ID_editor_hanger_indication_texts).appendTo(indicationHanger);


    //Refresh
    indicationHanger.trigger('create');
};

// INSTANCE
Indication.prototype.constructor = Indication;
//ACTIVES
Indication.prototype.active_Phase_editor = function () {
    return this.phases[jqo(Indication.ID_editor_select_phases).val()];
};
Indication.prototype.active_Drug_editor = function () {
    return this.active_Phase_editor() ? this.active_Phase_editor().active_Drug_editor() : false;
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
    var baseElement = jqo(Indication.ID_editor_hanger_indication_texts);
    emptyThisHangerWithID(Indication.ID_editor_hanger_indication_texts);
//Indications Texts
    appendLabelAndTextValueTo(baseElement, Indication.ID_editor_text_indication_name, "Name", this.name);

    //Refresh
    triggerCreateElementsOnThisHangerWithID(Indication.ID_editor_hanger_indication_texts);

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
        jqo(Drug.ID_editor_hanger_drug).show();
    }
    else {
        jqo(Drug.ID_editor_hanger_drug).hide();
    }

};
Indication.prototype.displayPhase = function () {
    if (this.active_Phase_editor()) {
        this.active_Phase_editor().displayPhase();
    }
    else {
        emptyThisHangerWithID(Phase.ID_editor_hanger_phase_texts);
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
Indication.prototype.createSelectMenuWeight = function () {
    var hanger = jqo(Indication.ID_prescribe_menus_weight_hanger);
    hanger.empty();
    appendSelectMenuWithTheseOptions(hanger, Indication.ID_prescribe_select_weight, integerArrayFromTo(this.minWeight, this.maxWeight), "Weight", false, this.guideline);

    //create the selectmenu as created already in markup
    hanger.trigger('create');
    jqo(Indication.ID_prescribe_select_weight).val(this.weight - this.minWeight).selectmenu('refresh');
};
Indication.prototype.displayWeightAndIndication = function () {
    this.createSelectMenuWeight();
    this.buildDrugsListsScaffoldAndDrugsLists();
    this.buildDrugsListsForPhases();
};
Indication.prototype.buildDrugsListsScaffoldAndDrugsLists = function () {
    var jqo_fieldcontain_drugs = jqo(Indication.ID_prescribe_drugs_hanger);
    jqo_fieldcontain_drugs.empty();

    //make a collapsible set for phases to hang on to
    var phasesTopSet = $(document.createElement("div"))
        .attr('data-role', 'collapsible-set')
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
            // .attr('data-theme',themeLetter)
            .attr('data-collapsed', (ph == 0 ? "false" : "true"))
            .append(header)
            //make and add collapsible set for drugs in the phase, mark with unique ID so we can find it later for the drugs themselves
            .append
            (
                $(document.createElement("div"))
                    .attr('id', uniqueIDforDrugHangerDivInPhase(ph))
                    .attr('data-role', 'collapsible-set')
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
                .attr('data-role', 'collapsible');
            var drugObj = this.phases[ph].drugs[drug];
            // Add warnings
            var drugsInstructionsWarningsInfos = drugObj.doseWarningsCommentsArrayForWeight(this.weight);
            var header = $(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString);
            header.append(acronymSpanForString(drugObj.acronym));

            aDrugDiv.append(header);

            addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.warningArray, true, aDrugDiv);
            addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.infoArray, false, aDrugDiv);
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
