/**
 * Created by davidjmlewis on 14/04/2016.
 */

/* GLOBALS */
var currentweight;
var list_of_drugs =
{
    adultDaily:
    {//Adultdaily drug list
        d_indication: "Adult Daily",
        induction_drugs:
        {//induction drug list
            phase_name:"Induction Phase",
            drug_list:
                [
                    {d_name: "Isoniazid", d_how: "mg/Kg",
                        d_mgkg_initial: 5, d_mgkg_min: 4,d_mgkg_max: 6,
                        d_round_val:50, d_round_direct:1,
                        d_max: 300, d_units:"mg"},
                    {d_name: "Rifampicin", d_how: "mg/Kg",
                        d_mgkg_initial: 10, d_mgkg_min: 8,d_mgkg_max: 12,
                        d_round_val:150, d_round_direct:1,
                        d_max: 600, d_units:"mg"},
                    {d_name: "Pyrazinamide", d_how: "mg/Kg",
                        d_mgkg_initial: 25, d_mgkg_min: 20,d_mgkg_max: 30,
                        d_round_val:100, d_round_direct:1,
                        d_max: 2000, d_units:"mg"},
                    {d_name: "Ethambutol", d_how: "mg/Kg",
                        d_mgkg_initial: 15, d_mgkg_min: 15,d_mgkg_max: 20,
                        d_round_val:100, d_round_direct:-1,
                        d_max: 1600, d_units:"mg"}
                ]
        },
        continuation_drugs:
        {//induction drug list
            phase_name:"Continuation Phase",
            drug_list:
                [
                    {d_name: "Isoniazid", d_how: "mg/Kg",
                        d_mgkg_initial: 5, d_mgkg_min: 4,d_mgkg_max: 6,
                        d_round_val:50, d_round_direct:1,
                        d_max: 300, d_units:"mg"},
                    {d_name: "Rifampicin", d_how: "mg/Kg",
                        d_mgkg_initial: 10, d_mgkg_min: 8,d_mgkg_max: 12,
                        d_round_val:150, d_round_direct:1,
                        d_max: 600, d_units:"mg"}
                ]
        }

    }
};


jQuery(document).on( "pagecreate", "#page_1", setupPage_1);

function drugDoseString(drugInfo)
{
    var warningsarray = [];
    var infosarray = [];
    var calculatedDose = currentweight*drugInfo.d_mgkg_initial;

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
    var weightStrX = currentweight.toString()+" Kg x";
    infosarray.push(["Calculated dose:",weightStrX,drugInfo.d_mgkg_initial.toString(),drugInfo.d_how,"=",calculatedDose.toString(),drugInfo.d_units].join(" "));
    if (drugInfo.d_mgkg_min)
    {
        infosarray.push(["Lower dose:", weightStrX, drugInfo.d_mgkg_min.toString(), drugInfo.d_how, "=", (currentweight*drugInfo.d_mgkg_min).toString(), drugInfo.d_units].join(" "));
    }
    if (drugInfo.d_mgkg_max)
    {
        infosarray.push(["Higher dose:", weightStrX, drugInfo.d_mgkg_max.toString(), drugInfo.d_how, "=", (currentweight*drugInfo.d_mgkg_max).toString(), drugInfo.d_units].join(" "));
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
        collapsibleDiv.attr('data-expanded-icon','arrow-u');
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

function rebuildDrugsList_induction()
{
    var numDrugs;
    var jqo_slider_weight = $("#slider_weight");
    var jqo_drugsList_induction = $("#list_drugs_induction");
    currentweight = jqo_slider_weight.val();

    jqo_drugsList_induction.empty();
    numDrugs = list_of_drugs.adultDaily.induction_drugs.drug_list.length;
    console.log(numDrugs);
    for(var counter=0; counter<numDrugs; counter++)
    {
        var drugsInstructionsWarningsInfos = drugDoseString(list_of_drugs.adultDaily.induction_drugs.drug_list[counter]);
        var aDiv = $(document.createElement("div"));
            aDiv.attr('data-role','collapsible');
        aDiv.append($(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString));
        addAlertsToCollapsible(drugsInstructionsWarningsInfos.warningArray,aDiv);
        addInfoToCollapsible(drugsInstructionsWarningsInfos.infoArray,aDiv);
            aDiv.appendTo(jqo_drugsList_induction);
    }
    jqo_drugsList_induction.collapsibleset('refresh');

}

function setupPage_1()
{
    var jqo_slider_weight = $("#slider_weight");
    jqo_slider_weight.on("slidestop change",rebuildDrugsList_induction);
    rebuildDrugsList_induction();
}
