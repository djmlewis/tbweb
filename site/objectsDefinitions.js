/**
 * Created by davidjmlewis on 22/04/2016.
 */
/* Objects for guidelines */
function Guideline(name)
{
    this.name = name || "Untitled";
    this.indications = [];

}
Guideline.prototype.initFromJSONstring = function (jasonString) {
    if (jasonString) {
        var g = JSON.parse(jasonString);
        this.name = (g.name ? g.name : "no name");
        //this.indications is initialised in constructor
        for (var i = 0; i < g.indications.length; i++) // wont run if no indics
        {
            var indic = new Indication(g.indications[i].name);
            for (var p = 0; p < g.indications[i].phases.length; p++) {
                var phse = new Phase(g.indications[i].phases[p].name);
                for (var d = 0; d < g.indications[i].phases[p].drugs.length; d++)
                {
                    var drug = new Drug_mgKg(
                        g.indications[i].phases[p].drugs[d].name,
                        g.indications[i].phases[p].drugs[d].maxDose,
                        g.indications[i].phases[p].drugs[d].mgkg_initial,
                        g.indications[i].phases[p].drugs[d].mgkg_min,
                        g.indications[i].phases[p].drugs[d].mgkg_max,
                        g.indications[i].phases[p].drugs[d].rounval,
                        g.indications[i].phases[p].drugs[d].roundirect
                    );
                    phse.drugs.push(drug);
                }
                indic.phases.push(phse);
            }
            this.indications.push(indic);
        }
    }
    else {
        this.name = 'undefined';
        this.indications = [];
    }
};


function Indication(name) {
    this.name = name || "Untitled";
    this.phases = [];
}

function Phase(name) {
    this.name = name || "Untitled";
    this.drugs = [];
}

function Drug_mgKg(name, maxDose, mgkg_initial, mgkg_min, mgkg_max,rounval,roundirect)
{
    this.name = name || "Untitled";
    this.how = "mg/Kg";
    this.units = "mg";
    this.maxDose = maxDose;
    this.mgkg_initial = mgkg_initial;
    this.mgkg_min = mgkg_min;
    this.mgkg_max = mgkg_max;
    this.rounval = rounval;
    this.roundirect = roundirect;
}
