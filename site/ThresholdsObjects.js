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
Threshold.ID_editor_select_threshold_triggerWeight = "ID_editor_select_threshold_triggerWeight";
Threshold.ID_editor_select_threshold_comparator = "ID_editor_select_threshold_comparator";
Threshold.ID_editor_text_threshold_dose = "ID_editor_text_threshold_dose";
//Actives
Threshold.prototype.active_Indication_editor = function () {
    return window.gActiveGuideline.active_Indication_editor();
};
// INSTANCE
Threshold.prototype.constructor = Threshold;
Threshold.prototype.instructionString = function () {
    return [Threshold.comparatorStrings[this.comparator], this.triggerWeight, this.dose].join(" ");
};
// Display
Threshold.prototype.displayThresholdsTexts = function () {
    var hanger = jqo(Drug_threshold.ID_editor_texts_threshold_hanger);
    hanger.empty();
    // threshold TEXTS
    var selC = $(document.createElement("select"))
        .change(function () {
        })
        .attr({
            'id': Drug_threshold.ID_editor_select_threshold_comparator,
            'name': Drug_threshold.ID_editor_select_threshold_comparator,
            'data-mini': true
        });
    for (var i = 0; i < Threshold.comparatorStrings.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == this.comparator)
            .text(Threshold.comparatorStrings[i])
            .appendTo(selC);
    }

    var indication = this.active_Indication_editor();
    var selW = $(document.createElement("select"))
        .change(function () {
        })
        .attr({
            'id': Drug_threshold.ID_editor_select_threshold_triggerWeight,
            'name': Drug_threshold.ID_editor_select_threshold_triggerWeight,
            'data-mini': true
        });
    var weightsArray = indication.arrayOfAcceptableWeights();
    var correctedWeight = indication.weightCorrectedAsIndexForMenu(this.triggerWeight);
    for (var ii = 0; ii < weightsArray.length; ii++) {
        $(document.createElement("option"))
            .prop('value', ii)
            .prop('selected', ii == correctedWeight)
            .text([weightsArray[ii], indication.weightUnits].join(" "))
            .appendTo(selW);
    }

    var fc = $(document.createElement("div")).addClass("ui-field-contain");
    fc.append
    (
        $(document.createElement("label"))
            .attr('for', Drug_threshold.ID_editor_select_threshold_comparator)
            .text('Comparison')
    );
    fc.append(selC);
    fc.append
    (
        $(document.createElement("label"))
            .attr('for', Drug_threshold.ID_editor_select_threshold_triggerWeight)
            .text('Weight')
    );
    fc.append(selW);
    fc.appendTo(hanger);
    fc.trigger('create');
    appendLabelAndTextValueTo(hanger, Threshold.ID_editor_text_threshold_dose, "Dose", this.dose);

    //Refresh
    hanger.trigger('create');
};


// ********** DRUG Threshold  ************
function Drug_threshold(name, acronym, notes, units, frequency) {
    //super init
    Drug.call(this, name, acronym, Drug.howDoseCalculatedOptionsIndex_Drug_threshold, units, notes);
    // subclass init
    this.frequency = frequency || "OD";
    this.thresholds = [];
}

// STATICS
Drug_threshold.ID_editor_text_drug_threshold_frequency = "ID_editor_text_drug_threshold_frequency";
Drug_threshold.ID_editor_select_thresholds = "ID_editor_select_thresholds";
Drug_threshold.ID_editor_texts_threshold_hanger = "ID_editor_texts_threshold_hanger";

// INSTANCE
Drug_threshold.prototype = Object.create(Drug.prototype);
Drug_threshold.prototype.constructor = Drug_threshold;
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
Drug_threshold.prototype.displayDrugsEditor = function () {
    emptyThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
    //now call each generation
    this.displayDrugsEditor_As_Drug();
    this.displayDrugsEditor_As_Drug_threshold();
    //Refresh
    //triggerCreateElementsOnThisHangerWithID(Drug.ID_editor_hanger_drug_texts);
};
Drug_threshold.prototype.displayDrugsEditor_As_Drug_threshold = function () {
    var baseElement = jqo(Drug.ID_editor_hanger_drug_texts);
    // Drug TEXTS
    appendLabelAndTextValueTo(baseElement, Drug_mgKg.ID_editor_text_drug_frequency, "Frequency", this.frequency);
    this.createThresholdsSelectAndTextsHanger();
    this.displayThresholdsTexts();
};
Drug_threshold.prototype.createThresholdsSelectAndTextsHanger = function () {
    var myself = this;
    var baseElement = jqo(Drug.ID_editor_hanger_drug_texts);

    //Thresholds Select &  buttons group
    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .append//+ BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-plus ui-btn-icon-left")
            .text('Add Threshold')
            .click(function () {
                myself.addThreshold();
            }))
        .appendTo(baseElement);

    $(document.createElement("div"))
        .attr({'data-role': "controlgroup", 'data-type': "horizontal"})
        .append//- BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-minus ui-btn-icon-notext")
            .text('Delete')
            .click(function () {
                myself.deleteThreshold();
            }))
        .append//LABEL for Indications Select
        ($(document.createElement("label"))
            .attr('for', Drug_threshold.ID_editor_select_thresholds)
            .text('Thresholds'))
        .append// thresholds Select
        ($(document.createElement("select"))
            .change(function () {
                myself.selectThresholdsChanged()
            })
            .attr({
                'id': Drug_threshold.ID_editor_select_thresholds,
                'name': Drug_threshold.ID_editor_select_thresholds
            }))
        .append//SAVE BUTTON
        ($(document.createElement("button"))
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.saveThreshold();
            }))
        .appendTo(baseElement);

    //Thresholds texts hanger
    $(document.createElement("div"))
        .attr({'id': Drug_threshold.ID_editor_texts_threshold_hanger})
        .appendTo(baseElement);

    //Refresh
    baseElement.trigger('create');
};
Drug_threshold.prototype.populateThresholdsSelect = function () {
    var select = jqo(Drug_threshold.ID_editor_select_thresholds);
    populateSelectWithTheseOptions(select, this.instructionStringsArray(), "");
    select.selectmenu('refresh');
};
Drug_threshold.prototype.displayThresholdsTexts = function () {
    var hanger = jqo(Drug_threshold.ID_editor_texts_threshold_hanger);
    hanger.empty();
    if (this.activeThreshold()) {
        this.activeThreshold().displayThresholdsTexts();
    }
};
//Events
Drug_threshold.prototype.selectThresholdsChanged = function () {
    this.displayThresholdsTexts();
};
Drug_threshold.prototype.addThreshold = function () {
    this.thresholds.push(new Threshold(this.active_Indication_editor().maxWeight, Threshold.comparator_equalless, ""));
    this.populateThresholdsSelect();
    jqo(Drug_threshold.ID_editor_select_thresholds).val(this.thresholds.length - 1).selectmenu('refresh');
    this.displayThresholdsTexts();
};
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

