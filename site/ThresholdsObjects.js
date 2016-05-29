/**
 * Created by davidlewis on 23/05/2016.
 */
// **********  Threshold  ************
function Threshold(triggerWeight, comparator, dose) {
    this.triggerWeight = triggerWeight;
    this.comparator = comparator;
    this.dose = dose;
}

//Statics
Threshold.comparatorStrings = ['<', '<=', '=', '>=', '>'];
Threshold.comparator_less = 0;
Threshold.comparator_equalless = 1;
Threshold.comparator_equal = 2;
Threshold.comparator_equalgreater = 3;
Threshold.comparator_greater = 4;
// IDs
// INSTANCE
Threshold.prototype.constructor = Threshold;
Threshold.prototype.initFromJSONstringObject = function (jasonStringObject) {
    Drug.prototype.initFromJSONstringObject.call(this, jasonStringObject);
    if (jasonStringObject) {
        if (jasonStringObject.triggerWeight) {
            this.triggerWeight = jasonStringObject.triggerWeight;
        }
        if (jasonStringObject.comparator) {
            this.comparator = jasonStringObject.comparator;
        }
        if (jasonStringObject.dose) {
            this.dose = jasonStringObject.dose;
        }
    }

};

Threshold.prototype.instructionString = function () {
    return [Threshold.comparatorStrings[this.comparator], this.triggerWeight, this.dose].join(" ");
};
// Display


// ********** DRUG Threshold  ************
function Drug_threshold(name, acronym, notes, units, frequency) {
    //super init
    Drug.call(this, name, acronym, Drug.doseCalculationMethodOptionsIndex_Drug_threshold, units, notes);
    // subclass init
    this.frequency = frequency || "";
    this.thresholds = [];
}

// STATICS
Drug_threshold.ID_editor_drugthresholds_hanger_texts = "editor_drugthresholds_hanger_texts";
Drug_threshold.ID_editor_text_drug_threshold_frequency = "Deditor_text_drug_threshold_frequency";
Drug_threshold.ID_editor_select_thresholds = "editor_select_thresholds";
Drug_threshold.ID_editor_texts_threshold_hanger = "editor_texts_threshold_hanger";
Drug_threshold.ID_editor_drugthreshold_button_add = "Deditordrugthreshold_button_add";
Drug_threshold.ID_editor_drugthreshold_button_delete = "Deditordrugthreshold_button_delete";
Drug_threshold.ID_editor_drugthreshold_button_save = "Deditordrugthreshold_button_save";

// threshold
Drug_threshold.ID_editor_select_threshold_triggerWeight = "editor_select_threshold_triggerWeight";
Drug_threshold.ID_editor_select_threshold_comparator = "editor_select_threshold_comparator";
Drug_threshold.ID_editor_text_threshold_dose = "Deditor_text_threshold_dose";

// INSTANCE
Drug_threshold.prototype = Object.create(Drug.prototype);
Drug_threshold.prototype.constructor = Drug_threshold;
Drug_threshold.prototype.initFromJSONstringObject = function (jasonStringObject) {
    Drug.prototype.initFromJSONstringObject.call(this, jasonStringObject);
    if (jasonStringObject) {
        if (jasonStringObject.frequency) {
            this.frequency = jasonStringObject.frequency;
        }
        //this.thresholds is initialised in constructor
        if (jasonStringObject.thresholds) {
            for (var i = 0; i < jasonStringObject.thresholds.length; i++) {
                this.thresholds.push(new Threshold().initFromJSONstringObject(jasonStringObject.thresholds[i]));
            }
        }
    }
};
// Actives
Drug_threshold.prototype.active_Indication_editor = function () {
    return window.gActiveGuideline.active_Indication_editor();
};
Drug_threshold.selectedThresholdIndex_editor = function (newIndex) {
    if (newIndex) {
        jqo(Drug_threshold.ID_editor_select_thresholds).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Drug_threshold.ID_editor_select_thresholds).val();
    }
};
Drug_threshold.prototype.activeThreshold = function () {
    return this.thresholds[Drug_threshold.selectedThresholdIndex_editor()];
};

// Save
Drug_threshold.prototype.saveObjectSpecificData = function () {

};
//display
Drug_threshold.completeHTMLsetup = function () {
    //populate the drug types select

};
Drug_threshold.prototype.displayDrugsEditor = function () {
    //now call super
    Drug.prototype.displayDrugsEditor.call(this);
    // do anything special here


    //show texts values
    //call super
    Drug.prototype.displayTexts.call(this);

    this.displayThresholdsTexts();

};

Drug_threshold.prototype.populateThresholdsSelect = function () {
    var select = jqo(Drug_threshold.ID_editor_select_thresholds);
    populateSelectWithTheseOptions(select, this.instructionStringsArray(), "");
    select.selectmenu('refresh');
};
Drug_threshold.prototype.displayThresholdsTexts = function () {
    if (this.activeThreshold()) {

    }
};
//Events
/*
Drug_threshold.prototype.selectThresholdsChanged = function () {
    this.displayThresholdsTexts();
};
Drug_threshold.prototype.addThreshold = function () {
    this.thresholds.push(new Threshold(this.active_Indication_editor().maxWeight, Threshold.comparator_equalless, ""));
    this.populateThresholdsSelect();
    jqo(Drug_threshold.ID_editor_select_thresholds).val(this.thresholds.length - 1).selectmenu('refresh');
    this.displayThresholdsTexts();
};
 */
Drug_threshold.prototype.deleteThreshold = function () {
    console.log("deleteThreshold")
};
Drug_threshold.prototype.saveThreshold = function () {
    console.log("saveThreshold")
};

//Display thresholds
Drug_threshold.prototype.instructionStringsArray = function () {
    var isa = [];
    for (var i = 0; i < this.thresholds.length; i++) {
        isa.push(this.thresholds[i].instructionString());
    }
    return isa;
};

