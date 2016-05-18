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
    themesLetters: ['a', 'a']
};

var OBJECT_IDs = {
    page: "#page_prescribe",
    weight: "#select_weight",
    fieldsetIndications: '#fieldset_indications',
    selectIndications: "#select_indications",
    fieldsetDrugs: "#ui-field-contain-drugs",
    storageTag_guideline: "guideline"
};

/* GLOBAL STARTUPS */
jQuery(document).on("pagecreate", OBJECT_IDs.page, setupPageForIndication);

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
        var header = $(document.createElement("h3")).text(GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].name);
        header.append(acronymSpanForString(GLOBALS.guideline.indications[GLOBALS.indicationIndex].phases[ph].drugsAcronym));

        $(document.createElement("div"))//add a collapsible to hang the drugs set on
            .attr('data-role','collapsible')
            // .attr('data-theme',themeLetter)
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
                // .attr('data-theme',themeLetter)
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
