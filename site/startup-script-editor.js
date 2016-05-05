/**
 * Created by davidjmlewis on 14/04/2016.
 */
/*OBJECTS*/
function SelectedGIPD()
{
    this.i = -1;
    this.p = -1;
    this.d = -1;
}


/* CONSTANTS */

/* GLOBALS_EDITOR */
var jstring = '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"Induction Phase","drugs":[{"name":"Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"Pyrazinamide","how":"mg/Kg","units":"mg","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"Continuation Phase","drugs":[{"name":"Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"Induction Phase","drugs":[{"name":"Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"Continuation Phase","drugs":[{"name":"Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';

var GLOBALS_EDITOR =
{
    guideline: new Guideline("Untitled"),
    GIPD: new SelectedGIPD()
};

var OBJECT_IDs_EDITOR = {
    page: "#page_editor",
    formEditor: "#form-editor",
// Guideline
    display_guideline_name: "#editor-display_guideline_name",
    text_guideline_name: "#editor-text_guideline_name",
    button_guideline_name: "#editor-button_guideline_name",
    //Indications
    select_indications: "#editor-select_indications",
    text_indication_name: "#editor-text_indication_name",
    button_indication_new: "#editor-button_indication_new",
    button_indication_name: "#editor-button_indication_name",
    //Phases
    select_phases: "#editor-select_phases",
    text_phase_name: "#editor-text_phase_name",
    button_phase_new: "#editor-button_phase_new",
    button_phase_name: "#editor-button_phase_name",
    //drugs
    select_drugs: "#editor-select_drugs",
    text_drug_name: "#editor-text_drug_name",
    button_drug_new: "#editor-button_drug_new",
    button_drug_name: "#editor-button_drug_name"

};

/* GLOBAL STARTUPS */
jQuery(document).one("pagecreate", OBJECT_IDs_EDITOR.page, setupPageForEditing);


/* FUNCTIONS */
function setupPageForEditing() {

    loadSettingsAndGlobals();

    //now safe to do stuff
    GLOBALS_EDITOR.guideline.initFromJSONstring(jstring);
    /*create structure*/
    setupEvents();
    /*update display*/
    updateGuideline();

    //refresh
}

function loadSettingsAndGlobals() {
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.


    } else {
        // Sorry! No Web Storage support..
        console.log("Sorry! No Web Storage support");
    }

}

function setupEvents()
{
    //GUIDELINE
    $(OBJECT_IDs_EDITOR.button_guideline_name).click(enterGuidelineName);
    //INDICATIONS
    $(OBJECT_IDs_EDITOR.select_indications).change(selectIndicationsChanged);
    $(OBJECT_IDs_EDITOR.button_indication_new).click(newIndicationTapped);
    //PHASES
    $(OBJECT_IDs_EDITOR.select_phases).change(selectPhasesChanged);

}


function enterGuidelineName() {
    GLOBALS_EDITOR.guideline.name = $(OBJECT_IDs_EDITOR.text_guideline_name).val();
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);
}

function updateGuideline()
{
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);
    $(OBJECT_IDs_EDITOR.text_guideline_name).val(GLOBALS_EDITOR.guideline.name);
    //reset Indication to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.i = 0;//(GLOBALS_EDITOR.guideline.indications.length > 0) ? 0 : -1;

    //cascade down
    updateIndications();

}


function updateIndications()
{
    populateIndicationsSelect();
    //reset phase to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.p = 0;//(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases.length > 0) ? 0 : -1;//reset to first

    //cascade down
    updatePhases();
}

function populateIndicationsSelect()
{
    var jqo_select_indications = $(OBJECT_IDs_EDITOR.select_indications);
    jqo_select_indications.empty();
    for (var i = 0; i < GLOBALS_EDITOR.guideline.indications.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == GLOBALS_EDITOR.indicationIndex)
            .text(GLOBALS_EDITOR.guideline.indications[i].name)
            .appendTo(jqo_select_indications);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_indications.selectmenu('refresh');
}

function selectIndicationsChanged()
{
    GLOBALS_EDITOR.GIPD.i = ($(this).val());
    updatePhases();
}

function newIndicationTapped()
{
    GLOBALS_EDITOR.guideline.addIndication('unknown');
    updateGuideline();
}

function updatePhases()
{
    populatePhasesSelect();
    //reset drug to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.d = 0;//(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases.length > 0) ? 0 : -1;//reset to first
    updateDrugs();
}
function selectPhasesChanged()
{
    GLOBALS_EDITOR.GIPD.p = ($(this).val());
    updateDrugs();
}

function populatePhasesSelect()
{
    var jqo_select_phases = $(OBJECT_IDs_EDITOR.select_phases);
    jqo_select_phases.empty();
    var selectedIndication = GLOBALS_EDITOR.GIPD.i;
    if (GLOBALS_EDITOR.guideline.indications[selectedIndication])
    {
        for (var i = 0; i < GLOBALS_EDITOR.guideline.indications[selectedIndication].phases.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == GLOBALS_EDITOR.phaseIndex)
                .text(GLOBALS_EDITOR.guideline.indications[selectedIndication].phases[i].name)
                .appendTo(jqo_select_phases);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_phases.selectmenu('refresh');

}

function updateDrugs()
{

    populateDrugsSelect();

}

function populateDrugsSelect()
{
    var jqo_select_drugs = $(OBJECT_IDs_EDITOR.select_drugs);
    jqo_select_drugs.empty();
    var selectedIndication = GLOBALS_EDITOR.GIPD.i;
    var selectedPhase= GLOBALS_EDITOR.GIPD.p;
    var selectedDrug= GLOBALS_EDITOR.GIPD.d;
    if (GLOBALS_EDITOR.guideline.indications[selectedIndication].phases[selectedPhase])
    {
        for (var i = 0; i < GLOBALS_EDITOR.guideline.indications[selectedIndication].phases[selectedPhase].drugs.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == selectedDrug)
                .text(GLOBALS_EDITOR.guideline.indications[selectedIndication].phases[selectedPhase].drugs[i].name)
                .appendTo(jqo_select_drugs);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_drugs.selectmenu('refresh');

}