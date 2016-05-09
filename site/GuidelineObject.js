/**
 * Created by davidlewis on 09/05/2016.
 */
/* Objects for guidelines */
function Guideline(name) {
    this.name = name || "Untitled";
    this.indications = [];
    this.selectedIndex_indication = -1;
    this.selectedIndex_phase = -1;
    this.selectedIndex_drug = -1;

    var uniqueystring = new Date().getTime();
    /*IDs */
    this.ID_h3_name = "nameh3" + uniqueystring;
    this.ID_text_name = "nametext" + uniqueystring;
    this.ID_button_save = "savebutton" + uniqueystring;
    this.ID_button_export = "exportbutton" + uniqueystring;

}
Guideline.prototype.initFromJSONstring = function (jasonString) {
    if (jasonString) {
        var g = JSON.parse(jasonString);
        this.name = (g.name ? g.name : "no name");
        //this.indications is initialised in constructor
        for (var i = 0; i < g.indications.length; i++) // wont run if no indics
        {
            var indic = new Indication(g.indications[i].name);
            for (var p = 0; p < g.indications[i].phases.length; p++) {
                var phse = new Phase(g.indications[i].phases[p].name);
                for (var d = 0; d < g.indications[i].phases[p].drugs.length; d++) {
                    var drug = new Drug_mgKg(
                        g.indications[i].phases[p].drugs[d].name,
                        g.indications[i].phases[p].drugs[d].acronym,
                        g.indications[i].phases[p].drugs[d].maxDose,
                        g.indications[i].phases[p].drugs[d].mgkg_initial,
                        g.indications[i].phases[p].drugs[d].mgkg_min,
                        g.indications[i].phases[p].drugs[d].mgkg_max,
                        g.indications[i].phases[p].drugs[d].rounval,
                        g.indications[i].phases[p].drugs[d].roundirect,
                        "Notes"
                    );
                    phse.drugs.push(drug);
                }
                indic.phases.push(phse);
            }
            this.indications.push(indic);
        }
    }
    else {
        this.name = 'undefined';
        this.indications = [];
    }
};

Guideline.prototype.exportGuideline = function (myself) {
    var guidelineString = JSON.stringify(myself);
    var newwindow = window.open();
    var newdocument = newwindow.document;
    var HTMLstring = '<HTML><HEAD><TITLE>';
    HTMLstring += myself.name;
    HTMLstring += '</TITLE></HEAD><BODY>';
    HTMLstring += guidelineString;
    HTMLstring += '</BODY></HTML>';
    newdocument.write(HTMLstring);
};

Guideline.prototype.addElementsToThis = function (baseElement) {
    baseElement.empty();

    //GUIDELINE elements
    $(document.createElement("h3"))
        .attr('id', this.ID_h3_name)
        .addClass("ui-bar ui-bar-b")
        .text('Guideline')
        .appendTo(baseElement);

    $(document.createElement("div"))
        .addClass("ui-field-contain")
        .appendTo(baseElement)
        .append(
            $(document.createElement("label"))
                .attr('for', this.ID_text_name)
                .text('Name'))
        .append(
            $(document.createElement("input"))
                .attr('type', "text")
                .attr('id', this.ID_text_name)
                .attr('name', this.ID_text_name)
                .attr('placeholder', "Placeholding text")
                .prop('value', ""));

    //buttons group
    // closure over this via myself to give access to self when called, as this->element_calling
    var myself = this;
    $(document.createElement("div"))
        .attr('data-role', "controlgroup")
        .attr('data-type', "horizontal")
        .appendTo(baseElement)
        .append
        ($(document.createElement("button"))
            .attr('id', this.ID_button_save)
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {
                myself.updateGuidelineSpecificData(myself)
            }))
        .append
        ($(document.createElement("button"))
            .attr('id', this.ID_button_export)
            .addClass("ui-btn ui-icon-action ui-btn-icon-notext")
            .text('Export')
            .click(function () {
                myself.exportGuideline(myself)
            }));

    //Refresh
    baseElement.trigger("create");
};

Guideline.prototype.displayTextsForGuideLine = function () {
    $("#" + this.ID_h3_name).text(this.name);
    $("#" + this.ID_text_name).val(this.name);
};


Guideline.prototype.updateGuidelineSpecificData = function (myself) {
    myself.name = $("#" + myself.ID_text_name).val();
    $("#" + myself.ID_h3_name).text(myself.name);
    myself.exportGuideline(myself);
};

Guideline.prototype.active_Indication = function () {
    return this.indications[this.selectedIndex_indication];
};
Guideline.prototype.active_Phase = function () {
    return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase];
};
Guideline.prototype.active_Drug = function () {
    return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase].drugs[this.selectedIndex_drug];
};

Guideline.prototype.addIndication = function () {
    this.indications.push(new Indication());
};
/*
 Guideline.prototype.addPhaseToIndication = function(indicationIndex)
 {
 if (this.indications[indicationIndex])
 {this.indications[indicationIndex].push(new Phase())}
 };
 */
Guideline.prototype.addPhaseToActiveIndication = function () {
    if (this.active_Indication()) {
        this.active_Indication().push(new Phase())
    }
};
