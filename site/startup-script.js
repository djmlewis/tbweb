/**
 * Created by davidjmlewis on 14/04/2016.
 */

jQuery(document).on( "pagecreate", "#page_1", setupPage_1);

function rebuildDrugsList()
{
    var jqo_slider_weight = $("#slider_weight");
    var jqo_drugsList = $("#list_drugs");
    
    var currentweight = jqo_slider_weight.val();

    var list_of_drugs = [
        {drugname:"Isoniazid", dose_method:"mgkg", dose_multiplier:30},
        {drugname:"Ethambutol", dose_method:"mgkg", dose_multiplier:5},
        {drugname:"Rifampicin", dose_method:"mgkg", dose_multiplier:100},
        {drugname:"Pyrazinamide", dose_method:"mgkg", dose_multiplier:10}];

    jqo_drugsList.empty();
    for(var counter=0; counter<list_of_drugs.length; counter++)
    {
        $(document.createElement("div"))
            .attr('data-role','collapsible')
            .append($(document.createElement("h3")).text(list_of_drugs[counter].drugname+" "+(currentweight*list_of_drugs[counter].dose_multiplier)+" mg"))
            .append($(document.createElement("p")).text(list_of_drugs[counter].dose))
            .appendTo("#list_drugs");

    }
    jqo_drugsList.collapsibleset('refresh');

}

function setupPage_1()
{
    var jqo_slider_weight = $("#slider_weight");
    jqo_slider_weight.on("slidestop change",rebuildDrugsList);
    rebuildDrugsList();
}
