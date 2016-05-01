/**
 * Created by davidjmlewis on 14/04/2016.
 */



/* CONSTANTS */

/* GLOBALS */

var GLOBALS =
{
    guideline: new Guideline("Untitled")
};

var OBJECT_IDs = {
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
jQuery(document).one("pagecreate", OBJECT_IDs.page, setupPageForEditing);


/* FUNCTIONS */
function setupPageForEditing() {

    loadSettingsAndGlobals();

    //now safe to do stuff

    /*create structure*/
    buildBasicStructs();
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

function buildBasicStructs()
{
    buildguidelineStructs();
    buildSelectMenuIndications()

}

function buildguidelineStructs()
{
    $(OBJECT_IDs.button_guideline_name).click(enterGuidelineName);
}

function updateGuideline()
{
    $(OBJECT_IDs.display_guideline_name).text(GLOBALS.guideline.name);
    $(OBJECT_IDs.text_guideline_name).val(GLOBALS.guideline.name);
    
    populateIndicationsSelect();

}

function enterGuidelineName() {
    GLOBALS.guideline.name = $(OBJECT_IDs.text_guideline_name).val();
    $(OBJECT_IDs.display_guideline_name).text(GLOBALS.guideline.name);
}

function buildSelectMenuIndications()
{
    $(OBJECT_IDs.select_indications).change(selectIndicationsChanged);
    $(OBJECT_IDs.button_indication_new).click(newIndicationTapped);
}

function populateIndicationsSelect()
{
    var jqo_select_indications = $(OBJECT_IDs.select_indications);
    jqo_select_indications.empty();
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
function selectIndicationsChanged()
{
    //GLOBALS.indicationIndex = ($(this).val());
    //buildDrugsListsScaffoldAndDrugsLists();
}

function newIndicationTapped()
{
    GLOBALS.guideline.addIndication('unknown');
    updateGuideline();
}