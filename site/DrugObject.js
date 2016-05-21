/**
 * Created by davidlewis on 11/05/2016.
 */

// ********** DRUG ************
function Drug(name, acronym, howDoseCalc, units, notes) {
    this.name = name || "Untitled";
    this.acronym = acronym || "";
    this.howDoseCalc = howDoseCalc || 0;
    this.units = units || "Undefined";
    this.notes = notes || "No notes";

}
// STATICS 
Drug.ID_editor_hanger_drug = "8editor_hangerdrug";
Drug.ID_editor_hanger_drug_texts = "8editor_hangerdrugtexts";
Drug.ID_editor_text_drug_name = "8editor_textdrugname";
Drug.ID_editor_text_drug_acronym = "8editor_textdrugacronym";
Drug.ID_editor_text_drug_units = "8editor_textdrugunits";
Drug.ID_editor_text_drug_notes = "8editor_textdrugnotes";
Drug.ID_editor_select_drugHowDoseCalc = "8editor_selectdrugtype";
Drug.howDoseCalculatedOptions = ["mg/Kg", "Thresholds", "Directed"];
// STATIC FUNCTS 
Drug.addElementsToThisHangerForGuideline_editor = function (baseElement, guideline) {
    var drugsHanger = $(document.createElement("div"))
        .attr('id', Drug.ID_editor_hanger_drug)
        .appendTo(baseElement);

    //drugs Header
    $(document.createElement("h4")).addClass("ui-bar ui-bar-b ").text('Drugs').appendTo(drugsHanger);

    //drugs Select &  buttons group
    var labelAndSelectDrugs = createSelectLabelAndSelectMenuWithTheseOptions(Phase.ID_editor_select_drugs, [], "", "Drugs", false, guideline);
    var labelAndSelectDrugTypes = createSelectLabelAndSelectMenuWithTheseOptions(Drug.ID_editor_select_drugHowDoseCalc, Drug.howDoseCalculatedOptions, "", "Dose Calculation", false, guideline);

    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .append(labelAndSelectDrugs.label_)
        .append(labelAndSelectDrugs.select_)
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                guideline.saveSomething('d')
            }))
        .appendTo(drugsHanger);

    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                guideline.addSomething('d')
            }))
        .append(labelAndSelectDrugTypes.label_)
        .append(labelAndSelectDrugTypes.select_)
        .append//- BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-minus ui-btn-icon-notext")
            .text('Delete')
            .click(function () {
                guideline.confirmDelete('d')
            }))
        .appendTo(drugsHanger);

    /* Drugs Texts Hanger */
    $(document.createElement("div")).attr('id', Drug.ID_editor_hanger_drug_texts).appendTo(drugsHanger);

    //Refresh
    drugsHanger.trigger('create');
};
Drug.selectedHowDoseCalculatedString = function () {
    return Drug.howDoseCalculatedOptions[jqo(Drug.ID_editor_select_drugHowDoseCalc).val()];
};
Drug.addAlertsOrInfosToCollapsible = function (arrayToParse, addAlertIcon, collapsibleDiv) {
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numAlerts = arrayToParse.length;
    if (numAlerts > 0) {
        collapsibleDiv.attr('data-collapsed-icon', (collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));
        collapsibleDiv.attr('data-expanded-icon', (collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));

        for (var w = 0; w < numAlerts; w++) {
            collapsibleDiv.append($(document.createElement("p")).text((addAlertIcon ? '⚠ ' : '') + arrayToParse[w]))
        }
    }
};

// INSTANCE 
Drug.prototype.constructor = Drug;
Drug.prototype.displayDrugsEditor = function () {
    //over ridden in all subclasses that then call each parent _Drug version in turn
    emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
    this.displayDrugsEditor_As_Drug();
    //Refresh
    triggerCreateElementsOnThisHangerWithID(Drug.ID_editor_hanger_drug_texts);

};
Drug.prototype.displayDrugsEditor_As_Drug = function () {
    var baseElement = $('#' + Drug.ID_editor_hanger_drug_texts);
    // Drug TEXTS
    var fieldContain = $(document.createElement("div")).addClass("ui-field-contain");
    appendLabelAndTextValueTo(fieldContain, Drug.ID_editor_text_drug_name, "Name", this.name);
    appendLabelAndTextValueTo(fieldContain, Drug.ID_editor_text_drug_acronym, "Acronym", this.acronym);
    appendLabelAndTextValueTo(fieldContain, Drug.ID_editor_text_drug_units, "Units", this.units);
    appendLabelAndTextAreaValueTo(fieldContain, Drug.ID_editor_text_drug_notes, "Notes", this.notes);
    baseElement.append(fieldContain);
    $(document.createElement("h5")).addClass("ui-bar ui-bar-a").text("Calculation Method: " + this.howDoseCalc).appendTo(baseElement);
};
Drug.prototype.doseWarningsCommentsArrayForWeight = function (weight) {
    return {instructionsString: "Undefined for '+weight" + " Kg", warningArray: [], infoArray: []};
};
// Save
Drug.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Drug.ID_editor_text_drug_name).val() || '???';
    this.acronym = jqo(Drug.ID_editor_text_drug_acronym).val() || '???';
    this.units = jqo(Drug.ID_editor_text_drug_units).val() || '???';
    this.notes = jqo(Drug.ID_editor_text_drug_notes).val() || '???';
    this.howDoseCalc = jqo(Drug.ID_editor_select_drugHowDoseCalc).val() || '???';

};

// ********** DRUG MGKG  ************
function Drug_mgKg(name, acronym, maxDose, mgkg_initial, mgkg_min, mgkg_max, rounval, roundirect, notes, frequency) {
    //super init
    Drug.call(this, name, acronym, "mg/Kg", "mg", notes);
    // subclass init
    this.maxDose = maxDose;
    this.mgkg_initial = mgkg_initial;
    this.mgkg_min = mgkg_min;
    this.mgkg_max = mgkg_max;
    this.rounval = rounval;
    this.roundirect = roundirect;
    this.frequency = frequency || "OD";
}
// STATICS
Drug_mgKg.ID_editor_text_drug_frequency = "textdrugfrequency";
Drug_mgKg.ID_editor_text_drug_maxDose = "textdrugmaxDose";
Drug_mgKg.ID_editor_text_drug_mgkg_initial = "textdrugmgkg_initial";
Drug_mgKg.ID_editor_text_drug_mgkg_min = "textdrugmgkg_min";
Drug_mgKg.ID_editor_text_drug_mgkg_max = "textdrugmgkg_max";
Drug_mgKg.ID_editor_text_drug_rounval = "textdrugrounval";
Drug_mgKg.ID_editor_select_drug_roundirect = "selectdrugroundirect";
Drug_mgKg.options_rounding = ["None", "Up", "Down"];

// INSTANCE 
Drug_mgKg.prototype = Object.create(Drug.prototype);
Drug_mgKg.prototype.constructor = Drug_mgKg;
// Save
Drug_mgKg.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Drug.ID_editor_text_drug_name).val() || '???';
    this.acronym = jqo(Drug.ID_editor_text_drug_acronym).val() || '???';
    this.units = jqo(Drug.ID_editor_text_drug_units).val() || '???';
    this.notes = jqo(Drug.ID_editor_text_drug_notes).val() || '???';
    this.howDoseCalc = jqo(Drug.ID_editor_select_drugHowDoseCalc).val() || '???';
    this.maxDose = jqo(Drug_mgKg.ID_editor_text_drug_maxDose).val() || '???';
    this.mgkg_initial = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_initial).val() || '???';
    this.mgkg_min = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_min).val() || '???';
    this.mgkg_max = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_max).val() || '???';
    this.rounval = jqo(Drug_mgKg.ID_editor_text_drug_rounval).val() || '???';
    this.roundirect = jqo(Drug_mgKg.ID_editor_select_drug_roundirect).val() || '???';
    this.frequency = jqo(Drug_mgKg.ID_editor_text_drug_frequency).val() || '???';

};

Drug_mgKg.prototype.displayDrugsEditor = function () {
    emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
    //now call each generation
    this.displayDrugsEditor_As_Drug();
    this.displayDrugsEditor_As_Drug_mgKg();
    //Refresh
    triggerCreateElementsOnThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
};
Drug_mgKg.prototype.displayDrugsEditor_As_Drug_mgKg = function () {
    var baseElement = jqo(Drug.ID_editor_hanger_drug_texts);
    // Drug TEXTS
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_frequency, "Frequency", this.frequency);
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_maxDose, "Max Dose", this.maxDose, 'number');
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_mgkg_initial, "Preferred mg/Kg", this.mgkg_initial, 'number');
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_mgkg_min, "Min mg/Kg", this.mgkg_min, 'number');
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_mgkg_max, "Max mg/Kg", this.mgkg_max, 'number');
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_rounval, "Round dose by", this.rounval, 'number');
    appendSelectMenuWithTheseOptions(baseElement, Drug_mgKg.ID_editor_select_drug_roundirect, Drug_mgKg.options_rounding, "", "Rounding", true);

};

Drug_mgKg.prototype.doseWarningsCommentsArrayForWeight = function (weight) {
    var warningsarray = [];
    var infosarray = [];
    var calculatedDose = weight * this.mgkg_initial;

// dont use calculatedDose now, apply changes to correctedDose
    var correctedDose = calculatedDose;
// apply rounding if necessary
    if (correctedDose % this.rounval != 0) {
        switch (this.roundirect) {//-1 down 0 ignore +1 up
            case -1:
                correctedDose = Math.floor(correctedDose / this.rounval) * this.rounval;
                infosarray.push(["Dose rounded DOWN by", this.rounval.toString(), this.units].join(" "));
                break;
            case 1:
                correctedDose = (Math.floor(correctedDose / this.rounval) + 1) * this.rounval;
                infosarray.push(["Dose rounded UP by", this.rounval.toString(), this.units].join(" "));
                break;
        }
    }
//apply maximum, use >= so we add a warning when limit reached and when breached by max dose or corrected
    if (correctedDose >= this.maxDose) {
        correctedDose = this.maxDose;
        warningsarray.push("Maximum Dose is " + this.maxDose + " " + this.units);
    }
    else if ((weight * this.mgkg_max) >= this.maxDose) {
        warningsarray.push("Maximum Dose is " + this.maxDose + " " + this.units);
    }


//create the instruction
    var instructionsstring = [this.name, correctedDose.toString(), this.units, this.frequency].join(" ");

//add info on calculated,lower and higher doses
    var weightStrX = weight.toString() + " Kg @";
    infosarray.push(["℞", weightStrX, this.mgkg_initial.toString(), this.howDoseCalc, "=", calculatedDose.toString(), this.units].join(" "));
    if (this.mgkg_min) {
        infosarray.push(["↓", weightStrX, this.mgkg_min.toString(), this.howDoseCalc, "=", (weight * this.mgkg_min).toString(), this.units].join(" "));
    }
    if (this.mgkg_max) {
        infosarray.push(["↑", weightStrX, this.mgkg_max.toString(), this.howDoseCalc, "=", (weight * this.mgkg_max).toString(), this.units].join(" "));
    }
    return {instructionsString: instructionsstring, warningArray: warningsarray, infoArray: infosarray};
};
