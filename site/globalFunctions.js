/**
 * Created by davidjmlewis on 22/04/2016.
 */

function appendSelectMenuWithTheseOptions(fieldContain, id, options, labeltext, mini) {
    var labelAndSelect = createSelectLabelAndSelectMenuWithTheseOptions(id, options, labeltext, mini);
    $(document.createElement("div")).addClass("ui-field-contain")
        .append(labelAndSelect.label_)
        .append(labelAndSelect.select_)
        .appendTo(fieldContain);
}
function createSelectLabelAndSelectMenuWithTheseOptions(id, options, labeltext, mini) {

    var select = $(document.createElement("select"))
        .attr({'id': id, 'name': id, 'data-mini': mini})
        .attr({'id': id, 'name': id});

    for (var i = 0; i < options.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text(options[i])
            .appendTo(select);
    }
    var label = $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext);
    return {label_: label, select_: select};
}

function appendLabelAndTextValueTo(fieldContain, id, labeltext, texttext) {
    var localFC = $(document.createElement("div")).addClass("ui-field-contain").appendTo(fieldContain);

    /*
     jQuery('#some_text_box').on('input propertychange paste', function() {
     // do your stuff
     });
     */


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
        .on('input propertychange paste', function () {
            gActiveGuideline.someTextChanged(id.charAt(0))
        })
        .appendTo(localFC);
}
function appendLabelAndTextAreaValueTo(fieldContain, id, labeltext, texttext) {
    var localFC = $(document.createElement("div")).addClass("ui-field-contain").appendTo(fieldContain);

    $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext)
        .appendTo(localFC);
    $(document.createElement("textarea"))
        .attr({
            'id': id,
            'name': id,
            'placeholder': labeltext
        })
        .prop('value', texttext)
        .on('input propertychange paste', function () {
            gActiveGuideline.someTextChanged(id.charAt(0))
        })
        .appendTo(localFC);
}
function emptyThisHangerWithID(id) {
    $('#' + id).empty();
}
function triggerCreateElementsOnThisHangerWithID(id) {
    $('#' + id).trigger("create");
}
function jqo(id) {
    return $('#' + id);
}