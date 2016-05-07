/**
 * Created by davidjmlewis on 14/04/2016.
 */

/* CONSTANTS */

/* GLOBALS_EDITOR */
var jstring =
'{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADI_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADC_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';
    
    
    //'{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","drugs":[{"name":"ADI_Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","how":"mg/Kg","units":"mg","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","drugs":[{"name":"ADC_Isoniazid","how":"mg/Kg","units":"mg","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","drugs":[{"name":"DI_Ethambutol","how":"mg/Kg","units":"mg","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","drugs":[{"name":"DC_Rifampicin","how":"mg/Kg","units":"mg","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';

var GLOBALS_EDITOR =
{
    guideline: new Guideline("Untitled")
};

var OBJECT_IDs_EDITOR = {
    page: "#page_editor",
    formEditor: "#form-editor",
// Guideline
    display_guideline_name: "#editor-display_guideline_name",
    text_guideline_name: "#editor-text_guideline_name",
    button_guideline_save: "#editor-button_guideline_save",
    //Indications
    select_indications: "#editor-select_indications",
    text_indication_name: "#editor-text_indication_name",
    button_indication_new: "#editor-button_indication_new",
    button_indication_save: "#editor-button_indication_save",
    //Phases
    select_phases: "#editor-select_phases",
    text_phase_name: "#editor-text_phase_name",
    text_phase_duration: "#editor-text_phase_duration",
    text_phase_acronym: "#editor-text_phase_acronym",
    button_phase_new: "#editor-button_phase_new",
    button_phase_save: "#editor-button_phase_save",
    //drugs
    select_drugs: "#editor-select_drugs",
    text_drug_name: "#editor-text_drug_name",
    button_drug_new: "#editor-button_drug_new",
    button_drug_save: "#editor-button_drug_save"

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
    $(OBJECT_IDs_EDITOR.button_guideline_save).click(updateGuidelineSpecificData);
    //INDICATIONS
    $(OBJECT_IDs_EDITOR.select_indications).change(selectIndicationsChanged);
    $(OBJECT_IDs_EDITOR.button_indication_new).click(addIndication);
    $(OBJECT_IDs_EDITOR.button_indication_save).click(updateIndicationSpecificData);
    //PHASES
    $(OBJECT_IDs_EDITOR.select_phases).change(selectPhasesChanged);
    $(OBJECT_IDs_EDITOR.button_phase_new).click(newPhaseTapped);
    $(OBJECT_IDs_EDITOR.button_phase_save).click(updatePhaseSpecificData);

    //DRUGS
    $(OBJECT_IDs_EDITOR.select_drugs).change(selectDrugsChanged);

}

/* GUIDELINES */
function saveGuideline()
{
    var guidelineString = JSON.stringify(GLOBALS_EDITOR.guideline);
    console.log(guidelineString);
    var newwindow=window.open();
    var newdocument=newwindow.document;
    var HTMLstring ='<HTML><HEAD><TITLE>';
    HTMLstring +=GLOBALS_EDITOR.guideline.name;
    HTMLstring +='</TITLE></HEAD><BODY>';
    HTMLstring +=guidelineString;
    HTMLstring +='</BODY></HTML>';

    newdocument.write(HTMLstring);

}

function updateGuidelineSpecificData()
{
    GLOBALS_EDITOR.guideline.name = $(OBJECT_IDs_EDITOR.text_guideline_name).val();
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);

    //SAVE
    saveGuideline();
}

function displayGuideline()
{
    displayTextsForGuideLine();

    //reset Indication to zero , validity will be checked
    GLOBALS_EDITOR.guideline.selectedIndex_indication = 0;

    //cascade down
    displayIndications();

}
function displayTextsForGuideLine()
{
    $(OBJECT_IDs_EDITOR.display_guideline_name).text(GLOBALS_EDITOR.guideline.name);
    $(OBJECT_IDs_EDITOR.text_guideline_name).val(GLOBALS_EDITOR.guideline.name);
}

/*INDICATIONS */
function displayIndications()
{
    populateIndicationsSelect();
    displayTextsForIndication();
    //reset phase to zero , validity will be checked
    GLOBALS_EDITOR.guideline.selectedIndex_phase = 0;

    //cascade down
    displayPhases();
}
function displayTextsForIndication()
{
    var activindic = GLOBALS_EDITOR.guideline.active_Indication();
    $(OBJECT_IDs_EDITOR.text_indication_name).val(activindic ? activindic.name : "?");

}

function populateIndicationsSelect()
{
    var jqo_select_indications = $(OBJECT_IDs_EDITOR.select_indications);
    jqo_select_indications.empty();
    var selectedIndication = GLOBALS_EDITOR.guideline.selectedIndex_indication;
    for (var i = 0; i < GLOBALS_EDITOR.guideline.indications.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .prop('selected', i == selectedIndication)
            .text(GLOBALS_EDITOR.guideline.indications[i].name)
            .appendTo(jqo_select_indications);
    }
    //refresh the selectmenu as created already in markup
    jqo_select_indications.selectmenu('refresh');
}

function selectIndicationsChanged()
{
    GLOBALS_EDITOR.guideline.selectedIndex_indication = ($(this).val());
    //update self and cascade down
    displayTextsForIndication();
    //reset phase to zero , validity will be checked
    GLOBALS_EDITOR.guideline.selectedIndex_phase = 0;
    displayPhases();
}

function updateIndicationSpecificData()
{
    if (GLOBALS_EDITOR.guideline.active_Indication())
    {
        GLOBALS_EDITOR.guideline.active_Indication().name = $(OBJECT_IDs_EDITOR.text_indication_name).val();
    }

    //Update menu
    populateIndicationsSelect();

    //SAVE
    saveGuideline();

}


function addIndication()
{
    GLOBALS_EDITOR.guideline.addIndication();
    displayGuideline();
}


/* PHASES */
function displayPhases()
{
    displayTextsForPhase();
    populatePhasesSelect();
    //reset drug to zero , validity will be checked
    GLOBALS_EDITOR.guideline.selectedIndex_drug = 0;
    displayDrugs();
}

function displayTextsForPhase()
{
    var activePhase = GLOBALS_EDITOR.guideline.active_Phase();
    $(OBJECT_IDs_EDITOR.text_phase_name).val(activePhase ? activePhase.name : "?");
    $(OBJECT_IDs_EDITOR.text_phase_duration).val(activePhase ? activePhase.duration : "?");
    $(OBJECT_IDs_EDITOR.text_phase_acronym).val(activePhase ? activePhase.acronym : "?");

}

function selectPhasesChanged()
{
    GLOBALS_EDITOR.guideline.selectedIndex_phase = ($(this).val());
    //update self and cascade down
    displayTextsForPhase();
    displayDrugs();
}

function populatePhasesSelect()
{
    var jqo_select_phases = $(OBJECT_IDs_EDITOR.select_phases);
    jqo_select_phases.empty();
    var selectedPhase= GLOBALS_EDITOR.guideline.selectedIndex_phase;
    var activeIndication = GLOBALS_EDITOR.guideline.active_Indication();
    if (activeIndication)
    {
        for (var i = 0; i < activeIndication.phases.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == selectedPhase)
                .text(activeIndication.phases[i].name)
                .appendTo(jqo_select_phases);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_phases.selectmenu('refresh');

}

function updatePhaseSpecificData()
{
    var activeIPhase = GLOBALS_EDITOR.guideline.active_Phase();
    if (activeIPhase)
    {
        activeIPhase.name = $(OBJECT_IDs_EDITOR.text_phase_name).val();
        activeIPhase.acronym = $(OBJECT_IDs_EDITOR.text_phase_acronym).val();
        activeIPhase.duration = $(OBJECT_IDs_EDITOR.text_phase_duration).val();
    }
    //Update menu
    populatePhasesSelect();

    //SAVE
    saveGuideline();

}

function newPhaseTapped()
{
    GLOBALS_EDITOR.guideline.addPhaseToActiveIndication();
    displayPhases();
}

/* DRUGS*/
function displayDrugs()
{
    displayTextsForDrug();
    populateDrugsSelect();

}

function displayTextsForDrug()
{
    var activeDrug = GLOBALS_EDITOR.guideline.active_Drug();

    $(OBJECT_IDs_EDITOR.text_drug_name).val(activeDrug ? activeDrug.name : "?");

}

function populateDrugsSelect()
{
    var jqo_select_drugs = $(OBJECT_IDs_EDITOR.select_drugs);
    jqo_select_drugs.empty();
    var selectedDrug= GLOBALS_EDITOR.guideline.selectedIndex_drug;
    var activePhase =  GLOBALS_EDITOR.guideline.active_Phase();
    if (activePhase)
    {
        for (var i = 0; i < activePhase.drugs.length; i++) {
            $(document.createElement("option"))
                .prop('value', i)
                .prop('selected', i == selectedDrug)
                .text(activePhase.drugs[i].name)
                .appendTo(jqo_select_drugs);
        }
    }
    //refresh the selectmenu as created already in markup
    jqo_select_drugs.selectmenu('refresh');

}

function selectDrugsChanged()
{
    GLOBALS_EDITOR.guideline.selectedIndex_drug = ($(this).val());
    //update self
    displayTextsForDrug();
}
