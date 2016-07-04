/**
 * Created by davidlewis on 23/05/2016.
 */
// **********  Threshold  ************
function Threshold(thresholdTriggerWeight, thresholdComparator, thresholdDose) {
    this.classSelectors = ["#Threshold"];
    this.thresholdTriggerWeight = thresholdTriggerWeight;
    this.thresholdComparator = thresholdComparator;
    this.thresholdDose = thresholdDose;
}

//Statics
Threshold.comparatorStrings = ['<', '<=', '=', '>=', '>'];
Threshold.comparator_less = 0;
Threshold.comparator_equalless = 1;
Threshold.comparator_equal = 2;
Threshold.comparator_equalgreater = 3;
Threshold.comparator_greater = 4;
// IDs

// Static Fiuncts
Threshold.compareDescending = function (a, b) {
    return (a.thresholdTriggerWeight == b.thresholdTriggerWeight ? a.thresholdComparator - b.thresholdComparator : a.thresholdTriggerWeight - b.thresholdTriggerWeight)
};
Threshold.compareAscending = function (b, a) {
    return (a.thresholdTriggerWeight == b.thresholdTriggerWeight ? a.thresholdComparator - b.thresholdComparator : a.thresholdTriggerWeight - b.thresholdTriggerWeight)
};
// INSTANCE
Threshold.prototype.constructor = Threshold;
Threshold.prototype.initFromJSONstringObject = function (jasonStringObject) {
    Drug.prototype.initFromJSONstringObject.call(this, jasonStringObject);
    if (jasonStringObject) {
        if (jasonStringObject.thresholdTriggerWeight) {
            this.thresholdTriggerWeight = jasonStringObject.thresholdTriggerWeight;
        }
        if (jasonStringObject.thresholdComparator) {
            this.thresholdComparator = jasonStringObject.thresholdComparator;
        }
        if (jasonStringObject.thresholdDose) {
            this.thresholdDose = jasonStringObject.thresholdDose;
        }
    }

};
Threshold.prototype.instructionString = function () {
    var units = Guideline.global_active_Indication_editor().weightUnits || "";
    return [Threshold.comparatorStrings[this.thresholdComparator], this.thresholdTriggerWeight, units, ":", this.thresholdDose].join(" ");
};
// Display
Threshold.prototype.displayThresholdsTexts_editor = function () {
    // show threshold data

    if (Guideline.global_active_Indication_editor()) {
        jqo(Drug_threshold.ID_editor_select_threshold_comparator).val(this.thresholdComparator).selectmenu('refresh');
        populateValidSelectIDWithTheseOptions(
            Drug_threshold.ID_editor_select_threshold_thresholdTriggerWeight,
            Guideline.global_active_Indication_editor().arrayOfAcceptableWeights(),
            Guideline.global_active_Indication_editor().weightUnits,
            undefined,//index
            this.thresholdTriggerWeight);
        jqo(Drug_threshold.ID_editor_text_threshold_dose).val(this.thresholdDose);
    }
};


// ********** DRUG Threshold  ************
function Drug_threshold(name, acronym, notes, units) {
    //super init
    Drug.call(this, name, acronym, Drug.doseCalculationMethodOptionsIndex_Drug_threshold, units, notes);
    // subclass init
    this.classSelectors = ["#Drug", "#Drug_threshold"];
    this.thresholds = [];
}

// STATICS
Drug_threshold.ID_editor_drugthresholds_hanger_texts = "editor_drugthresholds_hanger_texts";//℞
Drug_threshold.ID_editor_select_thresholds = "editor_select_thresholds";
Drug_threshold.ID_editor_texts_threshold_hanger = "editor_texts_threshold_hanger";
Drug_threshold.ID_editor_drugthreshold_button_add = "Teditordrugthreshold_button_add";
Drug_threshold.ID_editor_drugthreshold_button_delete = "Teditordrugthreshold_button_delete";
Drug_threshold.ID_editor_drugthreshold_button_save = "Teditordrugthreshold_button_save";

// threshold
Drug_threshold.ID_editor_select_threshold_thresholdTriggerWeight = "editor_select_threshold_thresholdTriggerWeight";
Drug_threshold.ID_editor_select_threshold_comparator = "editor_select_threshold_comparator";
Drug_threshold.ID_editor_text_threshold_dose = "Deditor_text_threshold_dose";
//Weight
Drug_threshold.selectedthresholdTriggerWeight_editor = function () {
    return selectedValueFromSelectWithID(Drug_threshold.ID_editor_select_threshold_thresholdTriggerWeight);
};

// INSTANCE
Drug_threshold.prototype = Object.create(Drug.prototype);
Drug_threshold.prototype.constructor = Drug_threshold;
Drug_threshold.prototype.initFromJSONstringObject = function (jasonStringObject) {
    Drug.prototype.initFromJSONstringObject.call(this, jasonStringObject);
    if (jasonStringObject) {
        //this.thresholds is initialised in constructor
        if (jasonStringObject.thresholds) {
            for (var i = 0; i < jasonStringObject.thresholds.length; i++) {
                var thresh = new Threshold();
                thresh.initFromJSONstringObject(jasonStringObject.thresholds[i]);
                this.thresholds.push(thresh);
            }
        }
    }
};
// Actives
Drug_threshold.selectedThresholdIndex_editor = function (newIndex) {
    if (newIndex) {
        jqo(Drug_threshold.ID_editor_select_thresholds).val(newIndex).selectmenu('refresh');
    } else {
        return jqo(Drug_threshold.ID_editor_select_thresholds).val();
    }
};
Drug_threshold.prototype.activeThreshold_editor = function () {
    return this.thresholds[Drug_threshold.selectedThresholdIndex_editor()];
};

// Save
Drug_threshold.prototype.saveObjectSpecificData = function () {
    Drug.prototype.saveObjectSpecificData.call(this);
    window.gActiveGuideline.saveGuidelineInLocalStorage();

};
//display
Drug_threshold.completeHTMLsetup_Editor = function () {
    //populate the threshold <> select
    populateValidSelectIDWithTheseOptions(Drug_threshold.ID_editor_select_threshold_comparator, Threshold.comparatorStrings, "");
};
Drug_threshold.prototype.displayDrugs_editor = function () {
    //now call super
    Drug.prototype.displayDrugs_editor.call(this);
    // do anything special here
    jqo(Drug_threshold.ID_editor_drugthresholds_hanger_texts).show();


    //show texts values
    //call super
    this.displayObjectSpecificData();
    this.populateThresholdsSelect(0);
    this.displayThresholdsTexts_editor();

};

Drug_threshold.prototype.displayThresholdsTexts_editor = function () {
    // show threshold data
    showTrueHideFalse(Drug_threshold.ID_editor_texts_threshold_hanger, this.activeThreshold_editor());
    if (this.activeThreshold_editor()) {
        this.activeThreshold_editor().displayThresholdsTexts_editor();
    }
};
//Events

Drug_threshold.prototype.selectThresholdsChanged = function () {
    this.displayThresholdsTexts_editor();
};
Drug_threshold.prototype.addThreshold = function () {
    this.thresholds.push(
        new Threshold(Guideline.global_active_Indication_editor().maxWeight, Threshold.comparator_equalless, ""));
    this.populateThresholdsSelect(this.thresholds.length - 1);
    this.displayThresholdsTexts_editor();
};
Drug_threshold.prototype.deleteThreshold = function () {
    if (this.thresholds.length > Drug_threshold.selectedThresholdIndex_editor()) {
        this.thresholds.splice(Drug_threshold.selectedThresholdIndex_editor(), 1);
        this.populateThresholdsSelect(0);
        this.displayThresholdsTexts_editor();
    }
};
Drug_threshold.prototype.saveThreshold = function () {
    if (this.activeThreshold_editor()) {
        this.activeThreshold_editor().thresholdComparator = jqo(Drug_threshold.ID_editor_select_threshold_comparator).val();
        this.activeThreshold_editor().thresholdTriggerWeight = Drug_threshold.selectedthresholdTriggerWeight_editor();
        this.activeThreshold_editor().thresholdDose = jqo(Drug_threshold.ID_editor_text_threshold_dose).val() || "";
        this.thresholds.sort(Threshold.compareDescending);
        window.gActiveGuideline.saveGuidelineInLocalStorage();

        this.populateThresholdsSelect(0);
        this.displayThresholdsTexts_editor();
    }
};

//Display thresholds
Drug_threshold.prototype.instructionStringsArray = function () {
    var isa = [];
    for (var i = 0; i < this.thresholds.length; i++) {
        isa.push(this.thresholds[i].instructionString());
    }
    return isa;
};
Drug_threshold.prototype.populateThresholdsSelect = function (initialIndex) {
    populateValidSelectIDWithTheseOptions(
        Drug_threshold.ID_editor_select_thresholds,
        this.instructionStringsArray(),
        "",
        initialIndex);
};

