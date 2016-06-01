/**
 * Created by davidlewis on 11/05/2016.
 */

// ********** DRUG ************
function Drug(name, acronym, doseCalculationMethod, units, notes) {
    this.name = name || "Untitled";
    this.acronym = acronym || "";
    this.doseCalculationMethod = doseCalculationMethod || Drug.doseCalculationMethodOptionsIndex_Drug;
    this.units = units || "Undefined";
    this.notes = notes || "No notes";
}

// STATICS
// Dirty texts

Drug.ID_editor_hanger_drug_top = "editor_hanger_drug_top";
Drug.ID_editor_drug_button_add = "Deditordrug_button_add";
Drug.ID_editor_drug_button_delete = "Deditordrug_button_delete";
Drug.ID_editor_drug_button_save = "Deditordrug_button_save";

Drug.ID_editor_hanger_drug_texts = "℞editor_hanger_drug_texts";
Drug.ID_editor_text_drug_name = "Deditor_text_drug_name";
Drug.ID_editor_text_drug_acronym = "Deditor_text_drug_acronym";
Drug.ID_editor_text_drug_units = "Deditor_text_drug_units";
Drug.ID_editor_text_drug_notes = "Deditor_text_drug_notes";
Drug.ID_editor_select_drugHowDoseCalc = "editor_select_drugHowDoseCalc";
Drug.ID_editor_heading_drugHowDoseCalc = "editor_heading_drugHowDoseCalc";
Drug.doseCalculationMethodOptionsIndex_Drug = 0;
Drug.doseCalculationMethodOptionsIndex_Drug_mgKg = 1;
Drug.doseCalculationMethodOptionsIndex_Drug_threshold = 2;
Drug.doseCalculationMethodOptions = ["Directed", "mg/Kg", "Thresholds"];

// STATIC FUNCTS
Drug.completeHTMLsetup_Editor = function () {
    populateValidSelectIDWithTheseOptions(Drug.ID_editor_select_drugHowDoseCalc, Drug.doseCalculationMethodOptions);
};
Drug.selecteddoseCalculationMethodIndex = function () {
    return parseInt(jqo(Drug.ID_editor_select_drugHowDoseCalc).val());
};
Drug.doseCalculationMethodString = function (index) {
    return Drug.doseCalculationMethodOptions[index];
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
Drug.prototype.initFromJSONstringObject = function (jasonStringObject) {
    if (jasonStringObject) {
        if (jasonStringObject.name) {
            this.name = jasonStringObject.name;
        }
        if (jasonStringObject.acronym) {
            this.acronym = jasonStringObject.acronym;
        }
        if (jasonStringObject.doseCalculationMethod) {
            this.doseCalculationMethod = jasonStringObject.doseCalculationMethod;
        }
        if (jasonStringObject.units) {
            this.units = jasonStringObject.units;
        }
        if (jasonStringObject.notes) {
            this.notes = jasonStringObject.notes;
        }
    }
};

Drug.prototype.displayDrugsEditor = function () {
    //over ridden in all subclasses that then called by each _Drug version in turn
    // hide all the hangers first then show ours
    $('[id *= "℞"]').hide();
    jqo(Drug.ID_editor_hanger_drug_texts).show();
    jqo(Drug.ID_editor_heading_drugHowDoseCalc).text("Calculation Method: " + Drug.doseCalculationMethodString(this.doseCalculationMethod));


};
Drug.prototype.displayTexts = function () {
    jqo(Drug.ID_editor_text_drug_name).val(this.name);
    jqo(Drug.ID_editor_text_drug_acronym).val(this.acronym);
    jqo(Drug.ID_editor_text_drug_units).val(this.units);
    jqo(Drug.ID_editor_text_drug_notes).val(this.notes);
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

};

// ********** DRUG MGKG  ************
function Drug_mgKg(name, acronym, maxDose, mgkg_initial, mgkg_min, mgkg_max, rounval, roundirect, notes, frequency) {
    //super init
    Drug.call(this, name, acronym, Drug.doseCalculationMethodOptionsIndex_Drug_mgKg, "mg", notes);
    // subclass init
    this.maxDose = maxDose;
    this.mgkg_initial = mgkg_initial;
    this.mgkg_min = mgkg_min;
    this.mgkg_max = mgkg_max;
    this.rounval = rounval;
    this.roundirect = roundirect || 0;
    this.frequency = frequency;
}
// STATICS
Drug_mgKg.ID_editor_drugmgkg_hanger_texts = "℞editor_drugmgkg_hanger_texts";
Drug_mgKg.ID_editor_text_drug_frequency = "Deditor_text_drug_frequency";
Drug_mgKg.ID_editor_text_drug_maxDose = "Deditor_text_drug_maxDose";
Drug_mgKg.ID_editor_text_drug_mgkg_initial = "Deditor_text_drug_mgkg_initial";
Drug_mgKg.ID_editor_text_drug_mgkg_min = "Deditor_text_drug_mgkg_min";
Drug_mgKg.ID_editor_text_drug_mgkg_max = "Deditor_text_drug_mgkg_max";
Drug_mgKg.ID_editor_text_drug_rounval = "Deditor_text_drug_rounval";
Drug_mgKg.ID_editor_select_drug_roundirect = "editor_select_drug_roundirect";
Drug_mgKg.options_rounding = ["None", "Up", "Down"];
//  Static Functs
Drug_mgKg.completeHTMLsetup_Editor = function () {
    populateValidSelectIDWithTheseOptions(Drug_mgKg.ID_editor_select_drug_roundirect, Drug_mgKg.options_rounding, "");
};

// INSTANCE 
Drug_mgKg.prototype = Object.create(Drug.prototype);
Drug_mgKg.prototype.constructor = Drug_mgKg;
Drug_mgKg.prototype.initFromJSONstringObject = function (jasonStringObject) {
    Drug.prototype.initFromJSONstringObject.call(this, jasonStringObject);
    if (jasonStringObject) {
        if (jasonStringObject.maxDose) {
            this.maxDose = jasonStringObject.maxDose;
        }
        if (jasonStringObject.mgkg_initial) {
            this.mgkg_initial = jasonStringObject.mgkg_initial;
        }
        if (jasonStringObject.mgkg_min) {
            this.mgkg_min = jasonStringObject.mgkg_min;
        }
        if (jasonStringObject.mgkg_max) {
            this.mgkg_max = jasonStringObject.mgkg_max;
        }
        if (jasonStringObject.rounval) {
            this.rounval = jasonStringObject.rounval;
        }
        if (jasonStringObject.roundirect) {
            this.roundirect = jasonStringObject.roundirect;
        }
        if (jasonStringObject.frequency) {
            this.frequency = jasonStringObject.frequency;
        }
    }
};

// Save
Drug_mgKg.prototype.saveObjectSpecificData = function () {
    this.name = jqo(Drug.ID_editor_text_drug_name).val() || '???';
    this.acronym = jqo(Drug.ID_editor_text_drug_acronym).val() || '???';
    this.units = jqo(Drug.ID_editor_text_drug_units).val() || '???';
    this.notes = jqo(Drug.ID_editor_text_drug_notes).val() || '???';
    // should be fixed at init>>>> this.doseCalculationMethod = jqo(Drug.ID_editor_select_drugHowDoseCalc).val() || '???';
    this.maxDose = jqo(Drug_mgKg.ID_editor_text_drug_maxDose).val() || '???';
    this.mgkg_initial = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_initial).val() || '???';
    this.mgkg_min = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_min).val() || '???';
    this.mgkg_max = jqo(Drug_mgKg.ID_editor_text_drug_mgkg_max).val() || '???';
    this.rounval = jqo(Drug_mgKg.ID_editor_text_drug_rounval).val() || '???';
    this.roundirect = jqo(Drug_mgKg.ID_editor_select_drug_roundirect).val() || '???';
    this.frequency = jqo(Drug_mgKg.ID_editor_text_drug_frequency).val() || '???';

};

Drug_mgKg.prototype.displayDrugsEditor = function () {
    //now call super
    Drug.prototype.displayDrugsEditor.call(this);
    // do anything special here
    jqo(Drug_mgKg.ID_editor_drugmgkg_hanger_texts).show();

    //show texts values
    //call super
    Drug.prototype.displayTexts.call(this);
    this.displayTexts();
};

Drug_mgKg.prototype.displayTexts = function () {
    jqo(Drug_mgKg.ID_editor_text_drug_frequency).val(this.frequency);
    jqo(Drug_mgKg.ID_editor_text_drug_maxDose).val(this.maxDose);
    jqo(Drug_mgKg.ID_editor_text_drug_mgkg_initial).val(this.mgkg_initial);
    jqo(Drug_mgKg.ID_editor_text_drug_mgkg_min).val(this.mgkg_min);
    jqo(Drug_mgKg.ID_editor_text_drug_mgkg_max).val(this.mgkg_max);
    jqo(Drug_mgKg.ID_editor_text_drug_rounval).val(this.rounval);
    jqo(Drug_mgKg.ID_editor_select_drug_roundirect).val(this.roundirect);

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
    infosarray.push(["℞", weightStrX, this.mgkg_initial.toString(), Drug.doseCalculationMethodString(this.doseCalculationMethod), "=", calculatedDose.toString(), this.units].join(" "));
    if (this.mgkg_min) {
        infosarray.push(["↓", weightStrX, this.mgkg_min.toString(), Drug.doseCalculationMethodString(this.doseCalculationMethod), "=", (weight * this.mgkg_min).toString(), this.units].join(" "));
    }
    if (this.mgkg_max) {
        infosarray.push(["↑", weightStrX, this.mgkg_max.toString(), Drug.doseCalculationMethodString(this.doseCalculationMethod), "=", (weight * this.mgkg_max).toString(), this.units].join(" "));
    }
    return {instructionsString: instructionsstring, warningArray: warningsarray, infoArray: infosarray};
};


