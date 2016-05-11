/**
 * Created by davidlewis on 11/05/2016.
 */
function Drug(name, acronym, howDoseCalc, units, notes) {
    this.name = name || "Untitled";
    this.acronym = acronym || "";
    this.howDoseCalc = howDoseCalc || "Undefined";
    this.units = units || "Undefined";
    this.notes = notes || "No notes";

}

/* STATICS */
Drug.ID_hanger_drug_texts = "hangerdrugtexts";
Drug.ID_select_drugs = "selectdrugs";
Drug.ID_text_drug_name = "textdrugname";
Drug.ID_text_drug_acronym = "textdrugacronym";
Drug.ID_text_drug_howDoseCalc = "textdrughowDoseCalc";
Drug.ID_text_drug_units = "textdrugunits";
Drug.ID_text_drug_notes = "textdrugnotes";
Drug.addElementsToThisHangerForGuideline = function (baseElement, guideline) {
    //drugs Header
    $(document.createElement("h4"))
        .addClass("ui-bar ui-bar-b")
        .text('drugs')
        .appendTo(baseElement);

    //drugs Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .appendTo(baseElement)
        .append//LABEL for drug Select
        ($(document.createElement("label"))
            .attr('for', Drug.ID_select_drugs)
            .text('Indications'))
        .append// Indications Select
        ($(document.createElement("select"))
            .change(function () {
                guideline.selectDrugsChanged($(this).val())
            })
            .attr({'id': Drug.ID_select_drugs, 'name': Drug.ID_select_drugs}))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                guideline.updateDrugSpecificData()
            }))
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-notext")
            .text('Add')
            .click(function () {
                guideline.addDrugToActivePhase()
            }));

    /* Drugs Texts Hanger */
    $(document.createElement("div"))
        .attr('id', Drug.ID_hanger_drug_texts)
        .appendTo(baseElement);

    //Refresh
    baseElement.trigger('create');
};


/* INSTANCE */
Drug.prototype.constructor = Drug;
Drug.prototype.addElementsToThisForGuideline = function (guideline) {
    emptyThisHanger(Drug.ID_hanger_drug_texts);

    //Refresh
    triggerCreateElementsOnThisHanger(Drug.ID_hanger_drug_texts);

};
Drug.prototype.displayDrugsForGuideline = function (guideline) {
    //over ridden in all subclasses that then call each parent _Drug version in turn
};
Drug.prototype.displayDrugsForGuideline_Drug = function (guideline) {
    var baseElement = $('#' + Drug.ID_hanger_drug_texts);
    // Drug TEXTS
    var fieldContain = $(document.createElement("div")).addClass("ui-field-contain");
    appendLabelAndTextValueTo(fieldContain, Drug.ID_text_drug_name, "Name", this.name);
    appendLabelAndTextValueTo(fieldContain, Drug.ID_text_drug_acronym, "Acronym", this.acronym);
    appendLabelAndTextValueTo(fieldContain, Drug.ID_text_drug_units, "Units", this.units);
    appendLabelAndTextValueTo(fieldContain, Drug.ID_text_drug_notes, "Notes", this.notes);
    baseElement.append(fieldContain);
    $(document.createElement("h5")).addClass("ui-bar ui-bar-a").text("Calculation Method: " + this.howDoseCalc).appendTo(baseElement);

};
Drug.prototype.doseWarningsCommentsArrayForWeight = function (weight) {
    return {instructionsString: "Undefined for '+weight" + " Kg", warningArray: [], infoArray: []};
};

/* MG/KG */
function Drug_mgKg(name, acronym, maxDose, mgkg_initial, mgkg_min, mgkg_max, rounval, roundirect, notes) {
    //super init
    Drug.call(this, name, acronym, "mg/Kg", "mg", notes);
    // subclass init
    this.maxDose = maxDose;
    this.mgkg_initial = mgkg_initial;
    this.mgkg_min = mgkg_min;
    this.mgkg_max = mgkg_max;
    this.rounval = rounval;
    this.roundirect = roundirect;
}
/* STATICS */
Drug_mgKg.ID_text_drug_maxDose = "textdrugmaxDose";
Drug_mgKg.ID_text_drug_mgkg_initial = "textdrugmgkg_initial";
Drug_mgKg.ID_text_drug_mgkg_min = "textdrugmgkg_min";
Drug_mgKg.ID_text_drug_mgkg_max = "textdrugmgkg_max";
Drug_mgKg.ID_text_drug_rounval = "textdrugrounval";
Drug_mgKg.ID_select_drug_roundirect = "selectdrugroundirect";

/* INSTANCE */
Drug_mgKg.prototype = Object.create(Drug.prototype);
Drug_mgKg.prototype.constructor = Drug_mgKg;

Drug_mgKg.prototype.displayDrugsForGuideline = function (guideline) {
    emptyThisHanger(Drug.ID_hanger_drug_texts);
    //now call each generation
    this.displayDrugsForGuideline_Drug(guideline);
    this.displayDrugsForGuideline_Drug_mgKg(guideline);
    //Refresh
    triggerCreateElementsOnThisHanger(Drug.ID_hanger_drug_texts);
};
Drug_mgKg.prototype.displayDrugsForGuideline_Drug_mgKg = function (guideline) {
    var baseElement = $('#' + Drug.ID_hanger_drug_texts);
    // Drug TEXTS
    appendLabelAndTextValueTo(baseElement, Drug.ID_text_drug_maxDose, "Max Dose", this.maxDose);
    appendLabelAndTextValueTo(baseElement, Drug.ID_text_drug_mgkg_initial, "Preferred mg/Kg", this.mgkg_initial);
    appendLabelAndTextValueTo(baseElement, Drug.ID_text_drug_mgkg_min, "Min mg/Kg", this.mgkg_min);
    appendLabelAndTextValueTo(baseElement, Drug.ID_text_drug_mgkg_max, "Max mg/Kg", this.mgkg_max);
    appendLabelAndTextValueTo(baseElement, Drug.ID_text_drug_rounval, "Round dose by", this.rounval);

    appendSelectMenuWithTheseOptions(baseElement, Drug_mgKg.ID_select_drug_roundirect, ["Up", "Down", "None"], "Rounding");

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
    var instructionsstring = [this.name, correctedDose.toString(), this.units].join(" ");

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
