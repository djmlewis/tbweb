/**
 * Created by davidjmlewis on 22/04/2016.
 */
function appendSelectMenuWithTheseOptions(fieldContain, id, options, labeltext) {
    var localFC = $(document.createElement("div")).addClass("ui-field-contain").appendTo(fieldContain);

    var select = $(document.createElement("select"))
        .attr({'id': id, 'name': id, 'data-mini': true})
        .attr({'id': id, 'name': id});

    for (var i = 0; i < options.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(options[i])
            .appendTo(select);
    }
    var labelForSelect = $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext);
    localFC.append(labelForSelect);
    localFC.append(select);
}
function appendLabelAndTextValueTo(fieldContain, id, labeltext, texttext) {
    var localFC = $(document.createElement("div")).addClass("ui-field-contain").appendTo(fieldContain);

    $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext)
        .appendTo(localFC);
    $(document.createElement("input"))
        .attr({
            'type': "text",
            'id': id,
            'name': id,
            'placeholder': labeltext
        })
        .prop('value', texttext)
        .appendTo(localFC);
}
function emptyThisHanger(id) {
    $('#' + id).empty();
}
function triggerCreateElementsOnThisHanger(id) {
    $('#' + id).trigger("create");
}

function Indication(name) {
    this.name = name || "Untitled";
    this.phases = [];
}
/* STATICS */
Indication.ID_hanger_indication_texts = "hangerIndication";
/* INSTANCE */
Indication.prototype.constructor = Indication;
Indication.prototype.addElementsToThisForGuideline = function (guideline) {
    emptyThisHanger(Indication.ID_hanger_indication_texts);

    //Refresh
    $('#' + Drug.ID_hanger_drug_texts).trigger("create");

};

function Phase(name, duration, drugsAcronym) {
    this.name = name || "Untitled";
    this.duration = duration || "";
    this.drugsAcronym = drugsAcronym || "";
    this.drugs = [];
}

