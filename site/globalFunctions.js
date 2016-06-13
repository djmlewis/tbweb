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
/*
function acronymSpanForString(acronym) {
    return $(document.createElement("span")).text(" acronym").addClass("phaseAcronym")
}
function uniqueIDforDrugHangerDivInPhase(phaseIndex) {
    return 'ph_' + phaseIndex;
}
 function emptyThisHangerWithID(id) {
 jqo(id).empty();
 }

 */
function jqo(id) {
    return $('#' + id);
}


function showTrueHideFalse(elementID, isTrue) {
    if (isTrue) {
        jqo(elementID).show();
    }
    else {
        jqo(elementID).hide();
    }
}

function populateValidSelectIDWithTheseOptions(selectID, options, suffix, initialIndex, initialValue) {
    var select = jqo(selectID);
    //select first if none specified
    initialIndex = initialIndex ? initialIndex : 0;
    select.empty();
    var suffixOK = (suffix ? suffix : "");
    for (var i = 0; i < options.length; i++) {
        var optionVal = options[i];
        $(document.createElement("option"))
            .prop('value', i)
            .attr('selected', initialIndex == i || initialValue == optionVal)
            .text([optionVal, suffixOK].join(" "))
            .data({option_index: i, option_value: optionVal})
            .appendTo(select);
    }
    select.selectmenu('refresh');
}

function selectedValueFromSelectWithID(id) {
    return parseInt($('#' + id + ' option:selected').data().option_value);
    //console.log(selval);
    //return selval;
}

function emptySelectArrayOfIDs(idArray) {
    idArray.forEach(function (itemID) {
        jqo(itemID).empty().selectmenu('refresh');
    })
}

function extractNamesFromArray(array) {
    return array.map(function (item) {
        return item.name;
    });
}
/*
 function selectedIndexFromSelectWithID(id) {
 return selval = parseInt($('#' + id + ' option:selected').data().option_index);
 //console.log(selval);
 //return selval;
}

 function selectOptionWithValueInSelectWithID(id, compareValue) {
 jqo(id)
 .find('option')
 .each(function (index,element){element.attr('selected',element.data().option_value==compareValue)})
 .selectmenu('refresh');

 }

 */
