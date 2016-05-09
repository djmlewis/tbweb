/**
 * Created by davidjmlewis on 14/04/2016.
 */

/* CONSTANTS */

/* GLOBALS_EDITOR */
var jstring =
'{"name":"WHO","indications":[{"name":"Adults Daily","phases":[{"name":"ADInduction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADI_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADI_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1},{"name":"ADI_Pyrazinamide","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":2000,"mgkg_initial":25,"mgkg_min":20,"mgkg_max":30,"rounval":100,"roundirect":1},{"name":"ADI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"ADContinuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"ADC_Isoniazid","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":300,"mgkg_initial":5,"mgkg_min":4,"mgkg_max":6,"rounval":50,"roundirect":1},{"name":"ADC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]},{"name":"DOTs","phases":[{"name":"D_Induction Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DI_Ethambutol","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":1600,"mgkg_initial":15,"mgkg_min":15,"mgkg_max":20,"rounval":100,"roundirect":1}]},{"name":"D_Continuation Phase","duration":"","drugsAcronym":"","drugs":[{"name":"DC_Rifampicin","acronym":"","howDoseCalc":"mg/Kg","units":"mg","notes":"Notes","maxDose":600,"mgkg_initial":10,"mgkg_min":8,"mgkg_max":12,"rounval":150,"roundirect":1}]}]}]}';

var gActiveGuideline = new Guideline("Untitled", "editor");

/*
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
 */

/* GLOBAL STARTUPS */
jQuery(document).one("pagecreate", "#page_editor", setupPageForEditing);


/* FUNCTIONS */
function setupPageForEditing() {
    loadSettingsAndGlobals();

    //now safe to do stuff
    gActiveGuideline.initFromJSONstring(jstring);
    /*create structure*/
    gActiveGuideline.addElementsToThis($('#editor-guideline-hanger'));
    /*update display*/
    gActiveGuideline.displayGuideline();

    /* Bind events */
    setupEvents();
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
    //INDICATIONS
    //PHASES
    // $(OBJECT_IDs_EDITOR.select_phases).change(selectPhasesChanged);
    // $(OBJECT_IDs_EDITOR.button_phase_new).click(newPhaseTapped);
    // $(OBJECT_IDs_EDITOR.button_phase_save).click(updatePhaseSpecificData);
    //
    // //DRUGS
    // $(OBJECT_IDs_EDITOR.select_drugs).change(selectDrugsChanged);

}

/* GUIDELINES */


/*INDICATIONS */

/* PHASES */
