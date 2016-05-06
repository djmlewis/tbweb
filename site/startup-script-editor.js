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
var jstring = '{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","drugs":[{"name":"ADI_Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","how":"mg/Kg","units":"mg","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","drugs":[{"name":"ADC_Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","drugs":[{"name":"DI_Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","drugs":[{"name":"DC_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';

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
    text_phase_duration: "#editor-text_phase_duration",
    text_phase_acronym: "#editor-text_phase_acronym",
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
    displayGuideline();

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
    //DRUGS
    $(OBJECT_IDs_EDITOR.select_drugs).change(selectDrugsChanged);

}


function enterGuidelineName() {
    GLOBALS_EDITOR.guideline.name = $(OBJECT_IDs_EDITOR.text_guideline_name).val();
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);
}

function displayGuideline()
{
    displayTextsForGuideLine();

    //reset Indication to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.i = 0;

    //cascade down
    displayIndications();

}
function displayTextsForGuideLine()
{
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);
    $(OBJECT_IDs_EDITOR.text_guideline_name).val(GLOBALS_EDITOR.guideline.name);
}

function displayIndications()
{
    populateIndicationsSelect();
    displayTextsForIndication();
    //reset phase to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.p = 0;

    //cascade down
    displayPhases();
}
function displayTextsForIndication()
{
    $(OBJECT_IDs_EDITOR.text_indication_name).val(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].name);

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
    //update self and cascade down
    displayTextsForIndication();
    displayPhases();
}

function newIndicationTapped()
{
    GLOBALS_EDITOR.guideline.addIndication('unknown');
    displayGuideline();
}

function displayPhases()
{
    displayTextsForPhase();
    populatePhasesSelect();
    //reset drug to zero , validity will be checked
    GLOBALS_EDITOR.GIPD.d = 0;
    displayDrugs();
}

function displayTextsForPhase()
{
    $(OBJECT_IDs_EDITOR.text_phase_name).val(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases[GLOBALS_EDITOR.GIPD.p].name);
    $(OBJECT_IDs_EDITOR.text_phase_duration).val(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases[GLOBALS_EDITOR.GIPD.p].duration);
    $(OBJECT_IDs_EDITOR.text_phase_acronym).val(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases[GLOBALS_EDITOR.GIPD.p].acronym);

}

function selectPhasesChanged()
{
    GLOBALS_EDITOR.GIPD.p = ($(this).val());
    //update self and cascade down
    displayTextsForPhase();
    displayDrugs();
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

function displayDrugs()
{
    displayTextsForDrug();
    populateDrugsSelect();

}

function displayTextsForDrug()
{
    $(OBJECT_IDs_EDITOR.text_drug_name).val(GLOBALS_EDITOR.guideline.indications[GLOBALS_EDITOR.GIPD.i].phases[GLOBALS_EDITOR.GIPD.p].drugs[GLOBALS_EDITOR.GIPD.d].name);

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

function selectDrugsChanged()
{
    GLOBALS_EDITOR.GIPD.d = ($(this).val());
    //update self
    displayTextsForDrug();
}
