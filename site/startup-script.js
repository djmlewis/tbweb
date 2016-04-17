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
                    {d_name: "Isoniazid", d_how: "mgkg",
                        d_mgkg_initial: 5, d_mgkg_min: 4,d_mgkg_max: 6,
                        d_round_val:50, d_round_direct:"up",
                        d_max: 300, d_units:"mg"},
                    {d_name: "Rifampicin", d_how: "mgkg",
                        d_mgkg_initial: 10, d_mgkg_min: 8,d_mgkg_max: 12,
                        d_round_val:150, d_round_direct:"up",
                        d_max: 600, d_units:"mg"},
                    {d_name: "Pyrazinamide", d_how: "mgkg",
                        d_mgkg_initial: 25, d_mgkg_min: 20,d_mgkg_max: 30,
                        d_round_val:100, d_round_direct:"up",
                        d_max: 2000, d_units:"mg"},
                    {d_name: "Ethambutol", d_how: "mgkg",
                        d_mgkg_initial: 15, d_mgkg_min: 15,d_mgkg_max: 20,
                        d_round_val:100, d_round_direct:"up",
                        d_max: 1600, d_units:"mg"}
                ]
        },
        continuation_drugs:
        {//induction drug list
            phase_name:"Continuation Phase",
            drug_list:
                [
                    {d_name: "Isoniazid", d_how: "mgkg",
                        d_mgkg_initial: 5, d_mgkg_min: 4,d_mgkg_max: 6,
                        d_round_val:50, d_round_direct:"up",
                        d_max: 300, d_units:"mg"},
                    {d_name: "Rifampicin", d_how: "mgkg",
                        d_mgkg_initial: 10, d_mgkg_min: 8,d_mgkg_max: 12,
                        d_round_val:150, d_round_direct:"up",
                        d_max: 600, d_units:"mg"}
                ]
        }

    }
};


jQuery(document).on( "pagecreate", "#page_1", setupPage_1);

function drugDoseString(drugInfo)
{
    var warningsArray = [];
    var calculatedDose = currentweight*drugInfo.d_mgkg_initial;
    if (calculatedDose>=drugInfo.d_max)
    {
        calculatedDose = drugInfo.d_max;
        warningsArray.push("⚠️ Maximum Dose Reached");
    }

    var drugDoseString = calculatedDose.toString();
    var instructionsstring = [drugInfo.d_name,drugDoseString,drugInfo.d_units].join(" ");
    return {instructionsString:instructionsstring, warningsArray:warningsArray};
}

function addParagraphsFromArrayToCollapsible(arrayToParse, collapsibleDiv)
{
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numAlerts = arrayToParse.length;
    if (numAlerts > 0)
    {
        for (var w=0; w<numAlerts; w++)
        {
            collapsibleDiv.append($(document.createElement("p")).text(arrayToParse[w]))
        }
        collapsibleDiv.attr('data-collapsed-icon','alert');
        collapsibleDiv.attr('data-expanded-icon','arrow-u');
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
        var drugsInstructionsAndWarnings = drugDoseString(list_of_drugs.adultDaily.induction_drugs.drug_list[counter]);
        var aDiv = $(document.createElement("div"));
            aDiv.attr('data-role','collapsible');
        aDiv.append($(document.createElement("h3")).text(drugsInstructionsAndWarnings.instructionsString));
            addParagraphsFromArrayToCollapsible(drugsInstructionsAndWarnings.warningsArray,aDiv);
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
