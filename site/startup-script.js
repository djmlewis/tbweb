/**
 * Created by davidjmlewis on 14/04/2016.
 */
/* CONSTANTS */
var kPhaseDiv_Stem = 'ph_';
var kPhaseDrugsDiv_Stem = '_dr_';

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

/* GLOBAL STARTUPS */
jQuery(document).one( "pagecreate", "#page_1", setupPageForIndication);


function buildSelectMenuWeight()
{
    var jqo_select_weight = $("#select_weight");
    jqo_select_weight.on("change", buildDrugsLists);
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

function phaseButtonClicked()
{
    gCurrentIndicationIndex = ($(this).val());
    buildDrugsLists();
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
            .bind( "click", phaseButtonClicked)
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

function uniqueIDforDrugInPhase(phaseIndex, drugIndex)
{
    return kPhaseDiv_Stem+phaseIndex+kPhaseDrugsDiv_Stem+drugIndex;
}

function buildDrugsLists()
{
    var numDrugs;
    // var jqo_select_weight = $("#select_weight");
    gCurrentWeight = $("#select_weight").val();

    var jqo_fieldcontain_drugs = $("#ui-field-contain-drugs");
    jqo_fieldcontain_drugs.empty();

    //add collapsible set for phases to hang on to
    var phasesCollSet = $(document.createElement("div"))
        .attr('data-role','collapsible-set')
        .attr('data-collapsed-icon','false')
        .attr('data-expanded-icon','false');


    //cycle thru the phases
    var numPhases = gIndicationsList[gCurrentIndicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        //add a collapsible to hang the next set on
        var phaseCollapsibleFor_PhaseDrugsCollSet = $(document.createElement("div"))
            .attr('data-role','collapsible')
            .attr('data-collapsed', (ph==0 ? "false" : "true"))
            .append($(document.createElement("h3")).text(gIndicationsList[gCurrentIndicationIndex].phases[ph].phase_name));

        //add collapsible set for drugs in the phase
        var phaseDrugsCollSet = $(document.createElement("div"))
            .attr('data-role','collapsible-set')
            .attr('data-collapsed-icon','false')
            .attr('data-expanded-icon','false');


        numDrugs = gIndicationsList[gCurrentIndicationIndex].phases[ph].drug_list.length;
        for(var drug=0; drug<numDrugs; drug++)
        {
            var aDrugDiv = $(document.createElement("div"))
                .attr('data-role','collapsible')
                .attr('id',uniqueIDforDrugInPhase(ph,drug));

            var drugsInstructionsWarningsInfos = drugDoseString(gIndicationsList[gCurrentIndicationIndex].phases[ph].drug_list[drug]);
            aDrugDiv.append($(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString));
            addAlertsToCollapsible(drugsInstructionsWarningsInfos.warningArray,aDrugDiv);
            addInfoToCollapsible(drugsInstructionsWarningsInfos.infoArray,aDrugDiv);
            aDrugDiv.appendTo(phaseDrugsCollSet);

        }
        phaseDrugsCollSet.appendTo(phaseCollapsibleFor_PhaseDrugsCollSet);
        phaseCollapsibleFor_PhaseDrugsCollSet.appendTo(phasesCollSet);

    }

    phasesCollSet.appendTo(jqo_fieldcontain_drugs);

    //activate the collapsible set components
    jqo_fieldcontain_drugs.trigger("create");
}

function setupPageForIndication()
{


    buildSelectMenuWeight();
    buildIndicationsRadio();
    buildDrugsLists();




}
