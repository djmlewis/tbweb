/**
 * Created by davidjmlewis on 22/04/2016.
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
    this.ID_h3_name = "nameh3"+uniqueystring;
    this.ID_text_name = "nametext"+uniqueystring;
    this.ID_button_save = "savebutton"+uniqueystring;
    this.ID_button_export = "exportbutton"+uniqueystring;

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

Guideline.prototype.exportGuideline= function(myself)
{
    var guidelineString = JSON.stringify(myself);
    var newwindow=window.open();
    var newdocument=newwindow.document;
    var HTMLstring ='<HTML><HEAD><TITLE>';
    HTMLstring +=myself.name;
    HTMLstring +='</TITLE></HEAD><BODY>';
    HTMLstring +=guidelineString;
    HTMLstring +='</BODY></HTML>';
    newdocument.write(HTMLstring);
};

Guideline.prototype.addElementsToThis = function(baseElement){
    baseElement.empty();

    //GUIDELINE elements
    $(document.createElement("h3"))
        .attr('id',this.ID_h3_name)
        .addClass("ui-bar ui-bar-b")
        .text('Guideline')
        .appendTo(baseElement);

    $(document.createElement("div"))
        .addClass("ui-field-contain")
        .appendTo(baseElement)
        .append(
            $(document.createElement("label"))
                .attr('for',this.ID_text_name)
                .text('Name'))
        .append(
            $(document.createElement("input"))
                .attr('type',"text")
                .attr('id',this.ID_text_name)
                .attr('name',this.ID_text_name)
                .attr('placeholder',"Placeholding text")
                .prop('value', ""));

    //buttons group
    // closure over this via myself to give access to self when called, as this->element_calling
    var myself = this;
    $(document.createElement("div"))
        .attr('data-role',"controlgroup")
        .attr('data-type',"horizontal")
        .appendTo(baseElement)
        .append
        ($(document.createElement("button"))
            .attr('id',this.ID_button_save)
            .addClass("ui-btn ui-icon-check ui-btn-icon-notext")
            .text('Save')
            .click(function () {myself.updateGuidelineSpecificData(myself)}))
        .append
        ($(document.createElement("button"))
            .attr('id',this.ID_button_export)
            .addClass("ui-btn ui-icon-action ui-btn-icon-notext")
            .text('Export')
            .click(function () {myself.exportGuideline(myself)}));

    //Refresh
    baseElement.trigger("create");
};

Guideline.prototype.displayTextsForGuideLine = function()
{
    $("#"+this.ID_h3_name).text(this.name);
    $("#"+this.ID_text_name).val(this.name);
};


Guideline.prototype.updateGuidelineSpecificData = function(myself)
{
    myself.name = $("#"+myself.ID_text_name).val();
    $("#"+myself.ID_h3_name).text(myself.name);
    myself.exportGuideline(myself);
};

Guideline.prototype.active_Indication = function(){
    return this.indications[this.selectedIndex_indication];
};
Guideline.prototype.active_Phase = function(){
    return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase];
};
Guideline.prototype.active_Drug= function(){
    return this.indications[this.selectedIndex_indication].phases[this.selectedIndex_phase].drugs[this.selectedIndex_drug];
};

Guideline.prototype.addIndication = function(){
    this.indications.push(new Indication());
};
/*
 Guideline.prototype.addPhaseToIndication = function(indicationIndex)
 {
 if (this.indications[indicationIndex])
 {this.indications[indicationIndex].push(new Phase())}
 };
 */
Guideline.prototype.addPhaseToActiveIndication = function()
{
    if (this.active_Indication())
    {this.active_Indication().push(new Phase())}
};

function Indication(name) {
    this.name = name || "Untitled";
    this.phases = [];
}

function Phase(name, duration, drugsAcronym) {
    this.name = name || "Untitled";
    this.duration = duration || "";
    this.drugsAcronym = drugsAcronym || "";
    this.drugs = [];
}

function Drug(name, acronym, howDoseCalc, units, notes) {
    this.name = name || "Untitled";
    this.acronym = acronym || "";
    this.howDoseCalc = howDoseCalc || "Undefined";
    this.units = units || "Undefined";
    this.notes = notes || "No notes";

}
Drug.prototype.constructor = Drug;
Drug.prototype.doseWarningsCommentsArrayForWeight = function (weight) {
    return {instructionsString: "Undefined for '+weight"+" Kg", warningArray: [], infoArray: []};
};

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
Drug_mgKg.prototype = Object.create(Drug.prototype);
Drug_mgKg.prototype.constructor = Drug_mgKg;
Drug_mgKg.prototype.doseWarningsCommentsArrayForWeight = function (weight)
{
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
    if (correctedDose >= this.maxDose)
    {correctedDose = this.maxDose;
        warningsarray.push("Maximum Dose is " + this.maxDose + " " + this.units);
    }
    else if ((weight * this.mgkg_max)>=this.maxDose)
    {warningsarray.push("Maximum Dose is " + this.maxDose + " " + this.units);}


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
