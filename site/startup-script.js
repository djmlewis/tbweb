/**
 * Created by davidjmlewis on 14/04/2016.
 */
/* CO NSTANTS */
var kPhaseDiv_Stem = 'ph_';

/* GLOBALS */
var GLOBALS = {
    weight: 60,
    indicationIndex: 0,
    indicationsList:
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

        ]
};

var OBJECT_IDs = {
    page: "#page_1",
    weight: "#select_weight",
    indications: '#fieldset_indications',
    drugs: "#ui-field-contain-drugs"
};

/* GLOBAL STARTUPS */
jQuery(document).one( "pagecreate", OBJECT_IDs.page, setupPageForIndication);

function loadSettingsAndGlobals()
{

}

function selectMenuChanged()
{
    GLOBALS.weight = $(this).val();
    buildDrugsListsForPhases();
}

function buildSelectMenuWeight()
{
    var jqo_select_weight = $(OBJECT_IDs.weight);
    jqo_select_weight.on("change",selectMenuChanged);
    var curweight = GLOBALS.weight;
    for (var i = 30; i < 101; i++) {
        //var opt =
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == curweight)
            .text(i.toString())
            .appendTo(jqo_select_weight);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_weight.selectmenu('refresh');
}

function phaseButtonClicked()
{
    GLOBALS.indicationIndex = ($(this).val());
    buildDrugsListsScaffoldAndDrugsLists();
}

function buildIndicationsRadio() {
    var jqo_radiofieldsetcontainer = $(OBJECT_IDs.indications).controlgroup("container");//.find('.ui-controlgroup-controls');

    // build radio button list GLOBALS.indicationsList.length
    for (var i = 0; i < GLOBALS.indicationsList.length; i++) {
        var id = GLOBALS.indicationsList[i].d_indication_name;
        var label = GLOBALS.indicationsList[i].d_indication_name;

        //var rad =
        $(document.createElement("input"))
            .attr('id', id)
            .attr('type', 'radio')
            .attr('name', 'indications')
            .attr('value', i)
            .prop('checked', i == GLOBALS.indicationIndex)
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
    var calculatedDose = GLOBALS.weight*drugInfo.d_mgkg_initial;

    // dont use calculatedDose now, apply changes to correctedDose
    var correctedDose = calculatedDose;
    // apply rounding if necessary
    if (correctedDose % drugInfo.d_round_val != 0)
    {
        switch (drugInfo.d_round_direct) {//-1 down 0 ignore +1 up
            case -1:
                correctedDose = Math.floor(correctedDose / drugInfo.d_round_val) * drugInfo.d_round_val;
                infosarray.push(["Dose rounded DOWN by", drugInfo.d_round_val.toString(), drugInfo.d_units].join(" "));
                break;
            case 1:
                correctedDose = (Math.floor(correctedDose / drugInfo.d_round_val)+1) * drugInfo.d_round_val;
                infosarray.push(["Dose rounded UP by", drugInfo.d_round_val.toString(), drugInfo.d_units].join(" "));
                break;
        }
    }
    //apply maximum, use >= so we add a warning when limit reached and when breached
    if (correctedDose>=drugInfo.d_max)
    {
        correctedDose = drugInfo.d_max;
        warningsarray.push("Maximum Dose is "+drugInfo.d_max+" "+drugInfo.d_units);
    }

    //create the instruction
    var instructionsstring = [drugInfo.d_name,correctedDose.toString(),drugInfo.d_units].join(" ");

    //add info on calculated,lower and higher doses
    var weightStrX = GLOBALS.weight.toString()+" Kg @";
    infosarray.push(["Dose:",weightStrX,drugInfo.d_mgkg_initial.toString(),drugInfo.d_how,"=",calculatedDose.toString(),drugInfo.d_units].join(" "));
    if (drugInfo.d_mgkg_min)
    {
        infosarray.push(["Lower:", weightStrX, drugInfo.d_mgkg_min.toString(), drugInfo.d_how, "=", (GLOBALS.weight*drugInfo.d_mgkg_min).toString(), drugInfo.d_units].join(" "));
    }
    if (drugInfo.d_mgkg_max)
    {
        infosarray.push(["Higher:", weightStrX, drugInfo.d_mgkg_max.toString(), drugInfo.d_how, "=", (GLOBALS.weight*drugInfo.d_mgkg_max).toString(), drugInfo.d_units].join(" "));
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

function uniqueIDforDrugHangerDivInPhase(phaseIndex)
{
    return kPhaseDiv_Stem+phaseIndex;
}

function buildDrugsListsForPhases()
{
    //cycle thru the phases
    var numPhases = GLOBALS.indicationsList[GLOBALS.indicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        var phaseDrugsCollSet = $('#'+uniqueIDforDrugHangerDivInPhase(ph));
        phaseDrugsCollSet.empty();
        var numDrugs = GLOBALS.indicationsList[GLOBALS.indicationIndex].phases[ph].drug_list.length;
        for(var drug=0; drug<numDrugs; drug++)
        {
            var aDrugDiv = $(document.createElement("div"))
                .attr('data-role','collapsible');

            var drugsInstructionsWarningsInfos = drugDoseString(GLOBALS.indicationsList[GLOBALS.indicationIndex].phases[ph].drug_list[drug]);
            aDrugDiv.append($(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString));
            addAlertsToCollapsible(drugsInstructionsWarningsInfos.warningArray,aDrugDiv);
            addInfoToCollapsible(drugsInstructionsWarningsInfos.infoArray,aDrugDiv);
            aDrugDiv.appendTo(phaseDrugsCollSet);
        }
    }
    $(OBJECT_IDs.drugs).trigger("create");
    $(OBJECT_IDs.drugs).fieldcontain("refresh");
}

function buildDrugsListsScaffoldAndDrugsLists()
{
    var jqo_fieldcontain_drugs = $(OBJECT_IDs.drugs);
    jqo_fieldcontain_drugs.empty();

    //make a collapsible set for phases to hang on to
    var phasesTopSet = $(document.createElement("div"))
        .attr('data-role','collapsible-set')
        .attr('data-collapsed-icon','false')
        .attr('data-expanded-icon','false');
    //cycle thru the phases
    var numPhases = GLOBALS.indicationsList[GLOBALS.indicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        $(document.createElement("div"))//add a collapsible to hang the drugs set on
            .attr('data-role','collapsible')
            .attr('data-collapsed', (ph==0 ? "false" : "true"))
            .append($(document.createElement("h3")).text(GLOBALS.indicationsList[GLOBALS.indicationIndex].phases[ph].phase_name))
            //make and add collapsible set for drugs in the phase, mark with unique ID so we can find it later for the drugs themselves
            .append
            (
                $(document.createElement("div"))
                    .attr('id',uniqueIDforDrugHangerDivInPhase(ph))
                    .attr('data-role','collapsible-set')
                    .attr('data-collapsed-icon','false')
                    .attr('data-expanded-icon','false')
            )
            //add the drugs collapsible to the drugs top set
            .appendTo(phasesTopSet);
    }
    // add the top set to the container
    phasesTopSet.appendTo(jqo_fieldcontain_drugs);

    //activate the collapsible set components
    jqo_fieldcontain_drugs.trigger("create");
    buildDrugsListsForPhases();

}

function setupPageForIndication()
{
    loadSettingsAndGlobals();

    buildSelectMenuWeight();
    buildIndicationsRadio();
    buildDrugsListsScaffoldAndDrugsLists();




}
