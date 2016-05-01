/**
 * Created by davidjmlewis on 14/04/2016.
 */



/* CONSTANTS */
var kPhaseDiv_Stem = 'ph_';



/* GLOBALS */
var jstring = '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"Induction Phase","drugs":[{"name":"Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"Pyrazinamide","how":"mg/Kg","units":"mg","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"Continuation Phase","drugs":[{"name":"Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"Induction Phase","drugs":[{"name":"Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"Continuation Phase","drugs":[{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';
var GLOBALS =
{
    weight: 60,
    indicationIndex: 0,
    themesLetters: ['b','c'],
    themesForIndex: function(index){ return this.themesLetters[index % this.themesLetters.length]}
};

var OBJECT_IDs = {
    page: "#page_1",
    weight: "#select_weight",
    fieldsetIndications: '#fieldset_indications',
    selectIndications: "#select_indications",
    fieldsetDrugs: "#ui-field-contain-drugs",
    storageTag_guideline: "guideline"
};

/* GLOBAL STARTUPS */
jQuery(document).one( "pagecreate", OBJECT_IDs.page, setupPageForIndication);

function loadSettingsAndGlobals()
{
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        GLOBALS.guideline = new Guideline();
        GLOBALS.guideline.initFromJSONstring(jstring);
        localStorage.setItem(OBJECT_IDs.storageTag_guideline,JSON.stringify(GLOBALS.guideline));
        console.log(localStorage.getItem(OBJECT_IDs.storageTag_guideline));

    } else {
        // Sorry! No Web Storage support..
        console.log("Sorry! No Web Storage support");
    }

}

function selectWeightChanged()
{
    GLOBALS.weight = $(this).val();
    buildDrugsListsForPhases();
}

function buildSelectMenuWeight()
{
    var jqo_select_weight = $(OBJECT_IDs.weight);
    jqo_select_weight.change(selectWeightChanged);
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

function selectIndicationsChanged()
{
    GLOBALS.indicationIndex = ($(this).val());
    buildDrugsListsScaffoldAndDrugsLists();
}

function buildSelectMenuIndications()
{
    var jqo_select_indications = $(OBJECT_IDs.selectIndications);
    jqo_select_indications.change(selectIndicationsChanged);
    for (var i = 0; i < GLOBALS.guideline.indications.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == GLOBALS.indicationIndex)
            .text(GLOBALS.guideline.indications[i].name)
            .appendTo(jqo_select_indications);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_indications.selectmenu('refresh');
}

function acronymSpanForString(acronym)
{
    return $(document.createElement("span")).text(" acronym").addClass("phaseAcronym")
}

function addAlertsOrInfosToCollapsible(arrayToParse, addAlertIcon, collapsibleDiv)
{
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numAlerts = arrayToParse.length;
    if (numAlerts > 0)
    {
        collapsibleDiv.attr('data-collapsed-icon',(collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));
        collapsibleDiv.attr('data-expanded-icon', (collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));

        for (var w=0; w<numAlerts; w++)
        {
            collapsibleDiv.append($(document.createElement("p")).text((addAlertIcon ? '⚠ ' : '')+arrayToParse[w]))
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
    var numPhases = GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        var phaseDrugsCollSet = $('#'+uniqueIDforDrugHangerDivInPhase(ph));
        // var themeLetter =  GLOBALS.themesForIndex(ph);
        phaseDrugsCollSet.empty();
        var numDrugs = GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].drugs.length;
        for(var drug=0; drug<numDrugs; drug++)
        {
            var aDrugDiv = $(document.createElement("div"))
                .attr('data-role','collapsible');
            var drugObj = GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].drugs[drug];
            // Add warnings
            var drugsInstructionsWarningsInfos = drugObj.doseWarningsCommentsArrayForWeight(GLOBALS.weight);
            var header = $(document.createElement("h3")).text(drugsInstructionsWarningsInfos.instructionsString);
            header.append(acronymSpanForString(drugObj.acronym));

            aDrugDiv.append(header);

            addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.warningArray,true, aDrugDiv);
            addAlertsOrInfosToCollapsible(drugsInstructionsWarningsInfos.infoArray,false, aDrugDiv);
            //Add drug notes
            aDrugDiv.append($(document.createElement("p")).text(drugObj.notes));
            //Append to drug hanger
            aDrugDiv.appendTo(phaseDrugsCollSet);
        }
    }
    $(OBJECT_IDs.fieldsetDrugs).trigger("create");
    $(OBJECT_IDs.fieldsetDrugs).fieldcontain("refresh");
}

function buildDrugsListsScaffoldAndDrugsLists()
{
    var jqo_fieldcontain_drugs = $(OBJECT_IDs.fieldsetDrugs);
    jqo_fieldcontain_drugs.empty();

    //make a collapsible set for phases to hang on to
    var phasesTopSet = $(document.createElement("div"))
        .attr('data-role','collapsible-set')
        .attr('data-collapsed-icon','false')
        .attr('data-expanded-icon','false');
    //cycle thru the phases
    var numPhases = GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases.length;
    for (var ph=0;ph<numPhases;ph++)
    {
        var themeLetter =  GLOBALS.themesForIndex(ph);

        var header = $(document.createElement("h3")).text(GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].name);
        header.append(acronymSpanForString(GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].drugsAcronym));

        $(document.createElement("div"))//add a collapsible to hang the drugs set on
            .attr('data-role','collapsible')
            .attr('data-theme',themeLetter)
            .attr('data-collapsed', (ph==0 ? "false" : "true"))
            .append(header)
            //make and add collapsible set for drugs in the phase, mark with unique ID so we can find it later for the drugs themselves
            .append
            (
                $(document.createElement("div"))
                    .attr('id',uniqueIDforDrugHangerDivInPhase(ph))
                    .attr('data-role','collapsible-set')
                    .attr('data-collapsed-icon','false')
                    .attr('data-expanded-icon','false')
                    .attr('data-theme',themeLetter)
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

    //now safe to do stuff
    buildSelectMenuWeight();
    buildSelectMenuIndications();
    buildDrugsListsScaffoldAndDrugsLists();




}
