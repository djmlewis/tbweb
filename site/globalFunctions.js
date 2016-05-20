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
function addAlertsOrInfosToCollapsible(arrayToParse, addAlertIcon, collapsibleDiv) {
    //Objects are Passed by Reference, so aDiv passed in gets updated. Arguments by Value
    var numAlerts = arrayToParse.length;
    if (numAlerts > 0) {
        collapsibleDiv.attr('data-collapsed-icon', (collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));
        collapsibleDiv.attr('data-expanded-icon', (collapsibleDiv.attr('data-collapsed-icon') == 'alert' || addAlertIcon ? 'alert' : 'false'));

        for (var w = 0; w < numAlerts; w++) {
            collapsibleDiv.append($(document.createElement("p")).text((addAlertIcon ? '⚠ ' : '') + arrayToParse[w]))
        }
    }
}
function uniqueIDforDrugHangerDivInPhase(phaseIndex) {
    return 'ph_' + phaseIndex;
}

function appendSelectMenuWithTheseOptions(fieldContain, id, options, labeltext, mini) {
    var labelAndSelect = createSelectLabelAndSelectMenuWithTheseOptions(id, options, labeltext, mini);
    $(document.createElement("div")).addClass("ui-field-contain")
        .append(labelAndSelect.label_)
        .append(labelAndSelect.select_)
        .appendTo(fieldContain);
}
function createSelectLabelAndSelectMenuWithTheseOptions(id, options, labeltext, mini) {
    var guideline = window.gActiveGuideline;
    var select = $(document.createElement("select"))
        .attr({'id': id, 'name': id, 'data-mini': mini})
        .attr({'id': id, 'name': id})
        .change(function () {
            guideline.selectmenuChanged(id);
        });

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
    $('#' + id).empty();
}
function triggerCreateElementsOnThisHangerWithID(id) {
    $('#' + id).trigger("create");
}
function jqo(id) {
    return $('#' + id);
}