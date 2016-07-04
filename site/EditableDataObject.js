/**
 * Created by davidjmlewis on 04/07/2016.
 */
//global EditableDataObject
function EditableDataObject() {
    this.classSelectors = ["#EditableDataObject"];

}
EditableDataObject.prototype.constructor = EditableDataObject;
EditableDataObject.prototype.saveObjectSpecificData = function () {
    //console.log(JSON.stringify(this));
    var formdata = jqo('form_' + this.classSelectors).serializeArray();
    for (var i = 0; i < formdata.length; i++) {
        //console.log(formdata[i].name);
        if (this.hasOwnProperty(formdata[i].name)) {
            this[formdata[i].name] = formdata[i].value;
            //console.log('>>>'+formdata[i].name);
        }
    }
    window.gActiveGuideline.saveGuidelineInLocalStorage();
    //console.log(JSON.stringify(this));
    this.displayObjectSpecificData();
};
EditableDataObject.prototype.displayObjectSpecificData = function () {
    //var formelems = $(this.classSelectors+' :input');
    var formelems = $(this.classSelectors.join(",")).find(':input');

    var myself = this;
    formelems.each(function () {
        var elemName = $(this).attr('name');
        if (myself.hasOwnProperty(elemName)) {
            $(this).val(myself[elemName]);
        }
    });
    formelems.filter('select').each(function () {
        $(this).selectmenu('refresh');
    });
};
/*
 var propNames = Object.keys(this);
 for (var k=0;k<propNames.length;k++) {
 var elem = $(selectorForKeyAndObjectName(propNames[k],this.classSelectors));
 this[propNames[k]] = elem.val() ? elem.val() : this[propNames[k]];
 }

 */
