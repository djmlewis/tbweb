/**
 * Created by davidlewis on 19/05/2016.
 */
/* CONSTANTS */

/* GLOBALS */


jQuery(document).on("pagecreate", "#page_prescribe", setupPageForPrescribing);
jQuery(document).on("pagecreate", "#page_editor", setupPageForEditing);


/* FUNCTIONS */

function setupPageForPrescribing() {
    Guideline.createGlobalIfRequired();
    window.gActiveGuideline.createPage_Prescribe();
}

function setupPageForEditing() {
    Guideline.createGlobalIfRequired();
    window.gActiveGuideline.createPagesAndDisplay_editing();
}

