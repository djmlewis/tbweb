/**
 * Created by davidjmlewis on 22/04/2016.
 */
/* Objects for guidelines */
function Guideline(name)
{
    this.name = name;
    this.indications = [];

}

function Indication(name) {
    this.name = name;
    this.phases = [];
}

function Phase(name) {
    this.name = name;
    this.drugs = [];
}

function Drug_mgKg(name)
{
    this.name = name;
    this.how = "mg/Kg";
    this.units = "mg";
    this.max = 0;
    this.mgkg_initial = 0;
    this.mgkg_min = 0;
    this.mgkg_max = 0;
    this.rounval = 0;
    this.roundirect = 0;
}