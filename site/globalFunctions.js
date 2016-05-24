/**
 * Created by davidjmlewis on 22/04/2016.
 */
function integerArrayFromTo(from, to) {
    if (from <= to) {
        var array = [];
        for (var i = from; i <= to; i++) {
            array.push(i);
        }
        return array;
    }
    else {
        return [];
    }
}
function acronymSpanForString(acronym) {
    return $(document.createElement("span")).text(" acronym").addClass("phaseAcronym")
}
function uniqueIDforDrugHangerDivInPhase(phaseIndex) {
    return 'ph_' + phaseIndex;
}

function appendSelectMenuWithTheseOptions(fieldContain, id, options, optionsSuffix, labeltext, mini) {
    var labelAndSelect = createSelectLabelAndSelectMenuWithTheseOptions(id, options, optionsSuffix, labeltext, mini);
    $(document.createElement("div")).addClass("ui-field-contain")
        .append(labelAndSelect.label_)
        .append(labelAndSelect.select_)
        .appendTo(fieldContain);
}
function createSelectLabelAndSelectMenuWithTheseOptions(id, options, optionsSuffix, labeltext, mini) {
    var guideline = window.gActiveGuideline;
    var select = $(document.createElement("select"))
        .attr({'id': id, 'name': id, 'data-mini': mini})
        .attr({'id': id, 'name': id})
        .change(function () {
            guideline.selectmenuChanged(id);
        })
        .trigger('create');
    populateSelectWithTheseOptions(select, options, optionsSuffix);

    var label = $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext);
    return {label_: label, select_: select};
}
function populateSelectWithTheseOptions(select, options, suffix) {
    select.empty();
    for (var i = 0; i < options.length; i++) {
        $(document.createElement("option"))
            .prop('value', i)
            .text([options[i], (suffix || "")].join(" "))
            .appendTo(select);
    }
}

function appendLabelAndTextValueTo(fieldContain, id, labeltext, texttext, inputType) {
    var localFC = $(document.createElement("div")).addClass("ui-field-contain").appendTo(fieldContain);

    $(document.createElement("label"))
        .attr('for', id)
        .text(labeltext)
        .appendTo(localFC);
    $(document.createElement("input"))
        .attr({
            'type': inputType || "text",
            'id': id,
            'name': id,
            'placeholder': labeltext
        })
        .prop('value', texttext)
        .on('input propertychange paste', function () {
            window.gActiveGuideline.someTextChanged(id.charAt(0))
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
            window.gActiveGuideline.someTextChanged(id.charAt(0))
        })
        .appendTo(localFC);
}
function emptyThisHangerWithID(id) {
    jqo(id).empty();
}
function triggerCreateElementsOnThisHangerWithID(id) {
    $('#' + id).trigger("create");
}
function jqo(id) {
    return $('#' + id);
}

function addChangeEventToThisID(id, objectcode) {
    jqo(id).on('input propertychange paste', function () {
        window.gActiveGuideline.someTextChanged(objectcode)
    });
}