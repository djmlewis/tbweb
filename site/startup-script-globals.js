/**
 * Created by davidlewis on 19/05/2016.
 */
/* CONSTANTS */

/* GLOBALS */


jQuery(document).one("pagecreate", "#page_prescribe", completeHTMLForPrescribing);
jQuery(document).one("pagebeforeshow", "#page_prescribe", displayGuidelineForPrescribing);
jQuery(document).one("pagecreate", "#page_editor", completeHTMLForEditing);
jQuery(document).one("pagebeforeshow", "#page_editor", displayGuidelineForEditing);


/* FUNCTIONS */

function completeHTMLForPrescribing() {
    Guideline.createGlobalIfRequired();
    window.gActiveGuideline.completeHTMLsetup_Prescribe();
}

function displayGuidelineForPrescribing() {
    window.gActiveGuideline.displayGuideline_prescribe();
}

function completeHTMLForEditing() {
    Guideline.createGlobalIfRequired();
    window.gActiveGuideline.completeHTMLsetup_Editor();
}

function displayGuidelineForEditing() {
    window.gActiveGuideline.displayGuideline_editing();
}

