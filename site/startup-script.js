/**
 * Created by davidjmlewis on 14/04/2016.
 */
/* CONSTANTS */
var kPhaseDrugsDiv_Stem = 'list_drugs_phase_';

/* GLOBALS */
var gCurrentWeight;
var gCurrentIndicationIndex = 0;
var gIndicationsList =
    [
        {//Adult daily drug list object
            d_indication_name: "Adult Daily",
            phases: [
                {//induction drug list
                    phase_name: "Induction Phase",
                    drug_list: [
                        {
                            d_name: "Isoniazid", d_how: "mg/Kg",
                            d_mgkg_initial: 5, d_mgkg_min: 4, d_mgkg_max: 6,
                            d_round_val: 50, d_round_direct: 1,
                            d_max: 300, d_units: "mg"
                        },
                        {
                            d_name: "Rifampicin", d_how: "mg/Kg",
                            d_mgkg_initial: 10, d_mgkg_min: 8, d_mgkg_max: 12,
                            d_round_val: 150, d_round_direct: 1,
                            d_max: 600, d_units: "mg"
                        },
                        {
                            d_name: "Pyrazinamide", d_how: "mg/Kg",
                            d_mgkg_initial: 25, d_mgkg_min: 20, d_mgkg_max: 30,
                            d_round_val: 100, d_round_direct: 1,
                            d_max: 2000, d_units: "mg"
                        },
                        {
                            d_name: "Ethambutol", d_how: "mg/Kg",
                            d_mgkg_initial: 15, d_mgkg_min: 15, d_mgkg_max: 20,
                            d_round_val: 100, d_round_direct: -1,
                            d_max: 1600, d_units: "mg"
                        }
                    ]
                },
                {//Continuation drug list
                    phase_name: "Continuation Phase",
                    drug_list: [
                        {
                            d_name: "Isoniazid", d_how: "mg/Kg",
                            d_mgkg_initial: 5, d_mgkg_min: 4, d_mgkg_max: 6,
                            d_round_val: 50, d_round_direct: 1,
                            d_max: 300, d_units: "mg"
                        },
                        {
                            d_name: "Rifampicin", d_how: "mg/Kg",
                            d_mgkg_initial: 10, d_mgkg_min: 8, d_mgkg_max: 12,
                            d_round_val: 150, d_round_direct: 1,
                            d_max: 600, d_units: "mg"
                        }
                    ]
                }
            ]
        },
        {//Adult daily drug list object
            d_indication_name: "DOTS",
            phases: [
                {//induction drug list
                    phase_name: "Induction Phase",
                    drug_list: [
                        {
                            d_name: "Isoniazid", d_how: "mg/Kg",
                            d_mgkg_initial: 5, d_mgkg_min: 4, d_mgkg_max: 6,
                            d_round_val: 50, d_round_direct: 1,
                            d_max: 300, d_units: "mg"
                        },
                        {
                            d_name: "Rifampicin", d_how: "mg/Kg",
                            d_mgkg_initial: 10, d_mgkg_min: 8, d_mgkg_max: 12,
                            d_round_val: 150, d_round_direct: 1,
                            d_max: 600, d_units: "mg"
                        },
                        {
                            d_name: "Pyrazinamide", d_how: "mg/Kg",
                            d_mgkg_initial: 25, d_mgkg_min: 20, d_mgkg_max: 30,
                            d_round_val: 100, d_round_direct: 1,
                            d_max: 2000, d_units: "mg"
                        },
                        {
                            d_name: "Ethambutol", d_how: "mg/Kg",
                            d_mgkg_initial: 15, d_mgkg_min: 15, d_mgkg_max: 20,
                            d_round_val: 100, d_round_direct: -1,
                            d_max: 1600, d_units: "mg"
                        }
                    ]
                },
                {//Continuation drug list
                    phase_name: "Continuation Phase",
                    drug_list: [
                        {
                            d_name: "Isoniazid", d_how: "mg/Kg",
                            d_mgkg_initial: 5, d_mgkg_min: 4, d_mgkg_max: 6,
                            d_round_val: 50, d_round_direct: 1,
                            d_max: 300, d_units: "mg"
                        },
                        {
                            d_name: "Rifampicin", d_how: "mg/Kg",
                            d_mgkg_initial: 10, d_mgkg_min: 8, d_mgkg_max: 12,
                            d_round_val: 150, d_round_direct: 1,
                            d_max: 600, d_units: "mg"
                        }
                    ]
                }
            ]
        }

    ];


jQuery(document).on( "pagecreate", "#page_1", setupPageForIndication);

function drugDoseString(drugInfo)
{
    var warningsarray = [];
    var infosarray = [];
    var calculatedDose = gCurrentWeight*drugInfo.d_mgkg_initial;

    // dont use calculatedDose now, apply changes to correctedDose
    var correctedDose = calculatedDose;
    // apply rounding if necessary
    if (correctedDose % drugInfo.d_round_val != 0)
    {
        switch (drugInfo.d_round_direct) {//-1 down 0 ignore +1 up
            case -1:
                correctedDose = Math.floor(correctedDose / drugInfo.d_round_val) * drugInfo.d_round_val;
                infosarray.push(["The calculated dose was rounded DOWN to nearest", drugInfo.d_round_val.toString(), drugInfo.d_units].join(" "));
                break;
            case 1:
                correctedDose = (Math.floor(correctedDose / drugInfo.d_round_val)+1) * drugInfo.d_round_val;
                infosarray.push(["The calculated dose was rounded UP to nearest", drugInfo.d_round_val.toString(), drugInfo.d_units].join(" "));
                break;
        }
    }
    //apply maximum, use >= so we add a warning when limit reached and when breached
    if (correctedDose>=drugInfo.d_max)
    {
        correctedDose = drugInfo.d_max;
        warningsarray.push("Maximum Dose Reached");
    }

    //create the instruction
    var instructionsstring = [drugInfo.d_name,correctedDose.toString(),drugInfo.d_units].join(" ");

    //add info on calculated,lower and higher doses
    var weightStrX = gCurrentWeight.toString()+" Kg x";
    infosarray.push(["Calculated dose:",weightStrX,drugInfo.d_mgkg_initial.toString(),drugInfo.d_how,"=",calculatedDose.toString(),drugInfo.d_units].join(" "));
    if (drugInfo.d_mgkg_min)
    {
        infosarray.push(["Lower dose:", weightStrX, drugInfo.d_mgkg_min.toString(), drugInfo.d_how, "=", (gCurrentWeight*drugInfo.d_mgkg_min).toString(), drugInfo.d_units].join(" "));
    }
    if (drugInfo.d_mgkg_max)
    {
        infosarray.push(["Higher dose:", weightStrX, drugInfo.d_mgkg_max.toString(), drugInfo.d_how, "=", (gCurrentWeight*drugInfo.d_mgkg_max).toString(), drugInfo.d_units].join(" "));
    }
    return {instructionsString:instructionsstring, warningArray:warningsarray, infoArray:infosarray};
}

function addAlertsToCollapsible(arrayToParse, collapsibleDiv)
{
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numAlerts = arrayToParse.length;
    if (numAlerts > 0)
    {
        for (var w=0; w<numAlerts; w++)
        {
            collapsibleDiv.append($(document.createElement("p")).text('⚠ '+arrayToParse[w]))
        }
        collapsibleDiv.attr('data-collapsed-icon','alert');
        collapsibleDiv.attr('data-expanded-icon','alert');
    }
}

function addInfoToCollapsible(arrayToParse, collapsibleDiv)
{
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numInfos = arrayToParse.length;
    if (numInfos > 0)
    {
        for (var w=0; w<numInfos; w++)
        {
            collapsibleDiv.append($(document.createElement("p")).text(arrayToParse[w]))
        }
    }

}

function rebuildDrugsLists()
{
    var numDrugs;
    var jqo_select_weight = $("#select_weight");
    gCurrentWeight = jqo_select_weight.val();
    //cycle thru the phases
    var numPhases = gIndicationsList[gCurrentIndicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        var phaseDivName = "#"+kPhaseDrugsDiv_Stem+ph.toString();
        var jqo_CollapsibleSetForPhase = $(phaseDivName);
        jqo_CollapsibleSetForPhase.empty();

        numDrugs = gIndicationsList[gCurrentIndicationIndex].phases[ph].drug_list.length;
        for(var drug=0; drug<numDrugs; drug++)
        {
            var drugsInstructionsWarningsInfos = drugDoseString(gIndicationsList[gCurrentIndicationIndex].phases[ph].drug_list[drug]);
            var aDiv = $(document.createElement("div"));
            aDiv.attr('data-role','collapsible');
            aDiv.append($(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString));
            addAlertsToCollapsible(drugsInstructionsWarningsInfos.warningArray,aDiv);
            addInfoToCollapsible(drugsInstructionsWarningsInfos.infoArray,aDiv);
            aDiv.appendTo(jqo_CollapsibleSetForPhase);
        }
        //activate the collapsible
        jqo_CollapsibleSetForPhase.trigger("create");
    }
}

function buildSelectMenuWeight() 
{
    var jqo_select_weight = $("#select_weight");
    jqo_select_weight.on("change", rebuildDrugsLists);
    for (var i = 30; i < 101; i++) {
        //var opt = 
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == 60)
            .text(i.toString())
            .appendTo(jqo_select_weight);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_weight.selectmenu('refresh');
}

function buildIndicationsRadio() {
    var jqo_radiofieldsetcontainer = $('#fieldset_indications').controlgroup("container");//.find('.ui-controlgroup-controls');

    // build radio button list gIndicationsList.length
    for (var i = 0; i < gIndicationsList.length; i++) {
        var id = gIndicationsList[i].d_indication_name;
        var label = gIndicationsList[i].d_indication_name;

        //var rad = 
        $(document.createElement("input"))
            .attr('id', id)
            .attr('type', 'radio')
            .attr('name', 'indications')
            .attr('value', i)
            .prop('checked', i == gCurrentIndicationIndex)
            .appendTo(jqo_radiofieldsetcontainer);
    
        //var lab = 
        $(document.createElement("label"))
            .attr('for', id)
            .text(label)
            .appendTo(jqo_radiofieldsetcontainer);
    }
    // activate control group
    jqo_radiofieldsetcontainer.trigger("create");
}

function buildDrugsListScaffold()
{
    var jqo_fieldcontain_drugs = $("#ui-field-contain-drugs");
    jqo_fieldcontain_drugs.empty();
    /*add indication name
    $(document.createElement("h3"))
        .text(gIndicationsList[gCurrentIndicationIndex].d_indication_name)
        .addClass("ui-bar ui-bar-a ui-corner-all")
        .appendTo(jqo_fieldcontain_drugs);
    */
    // for each phase add the phase name and a collapsible set hanger
    for (var ph=0;ph<gIndicationsList[gCurrentIndicationIndex].phases.length;ph++)
    {
        $(document.createElement("p"))
            .text(gIndicationsList[gCurrentIndicationIndex].phases[ph].phase_name)
            .addClass("ui-bar ui-bar-a ui-corner-all")
            .appendTo(jqo_fieldcontain_drugs);
        var phaseDivName = kPhaseDrugsDiv_Stem+ph.toString();
        var newColSet = $(document.createElement("div"))
            .attr('id',phaseDivName)
            .attr('data-role','collapsible-set')
            .attr('data-collapsed-icon','false')
            .attr('data-expanded-icon','false');
        newColSet.appendTo(jqo_fieldcontain_drugs);
    }
    //activate the collapsible set components
    jqo_fieldcontain_drugs.trigger("create");

}

function setupPageForIndication()
{
    var jqo_slider_weight = $("#slider_weight");
    jqo_slider_weight.on("slidestop change",rebuildDrugsLists);

    buildSelectMenuWeight();
    buildIndicationsRadio();
    buildDrugsListScaffold();
    rebuildDrugsLists();

    

}
