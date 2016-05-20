/**
 * Created by davidlewis on 19/05/2016.
 */
/* CONSTANTS */

/* GLOBALS_EDITOR */
$(document).ready(function () {
    window.gActiveGuideline = new Guideline("Untitled");
    window.gActiveGuideline.loadSettingsAndGlobals();
});


jQuery(document).on("pagecreate", "#page_prescribe", setupPageForPrescribing);
jQuery(document).on("pagecreate", "#page_editor", setupPageForEditing);


/* FUNCTIONS */

function setupPageForPrescribing() {
    console.log("setupPageForPrescribing");

    window.gActiveGuideline.createPage_Prescribe();
}

function setupPageForEditing() {
    console.log("setupPageForEditing globals");
    window.gActiveGuideline.createPagesAndDisplay_editing();
}

