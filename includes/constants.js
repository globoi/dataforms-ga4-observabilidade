function datasufixo() {
    let data = new Date();
    let dia = String(data.getDate() - 1).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    let dataAtual = ano + mes + dia;
    return dataAtual;
}

const DATASET_PARTE1 = [
    "analytics_352986422",
    "analytics_322937800",
    "analytics_329294835",
    "analytics_151009531",
    "analytics_397956492",
    "analytics_356237641",
    "analytics_383548010",
    "analytics_435739525",
    "analytics_449480563",


]

const DATASET_PARTE2 = [
    "analytics_395203655",
    "analytics_160218179",
    "analytics_290405147",
    "analytics_395223521",
    "analytics_329311935",
    "analytics_329322709",
    "analytics_417377425",
    "analytics_395197934",
    "analytics_416907581",
   
]

const DATASET_PARTE3 = [
    "analytics_318839139",
    "analytics_290399157",
    "analytics_348326943",
    "analytics_153398069",
    "analytics_338129881",
    "analytics_153404207",
    "analytics_309670617",
    "analytics_344497594",
    "analytics_153734558",
    "analytics_290417375",
    "analytics_153402505",
    "analytics_355873186",
    "analytics_390197405"


]

const DATASET_PARTE4 = [
    "analytics_153317366",

]

const DATASET_PARTE5 = [
    "analytics_347935910",
    "analytics_415790446"

]

const DATASET_PARTE6 = [
"analytics_441405932",
"analytics_329300185",
"analytics_447247160",
"analytics_368298620",
"analytics_447255447",
"analytics_347088051",
"analytics_334902667",
"analytics_448065469",
"analytics_259332918",
"analytics_442570380",
"analytics_413639017",
"analytics_331135368",
"analytics_445980610",
"analytics_422034959",
"analytics_334918402",
"analytics_334876335"
]

const DATASET_PARTE7 = [
    "analytics_318935925", 
    "analytics_316894734",        
    "analytics_316972299",
    "analytics_316902964",
    "analytics_316918432",
    "analytics_316973402",
    "analytics_447094779",
    "analytics_426317459",
    "analytics_318939862",
    "analytics_318922708",
    "analytics_316944710",
    "analytics_316963900",
    "analytics_316884252",
    "analytics_316921260",
    "analytics_316934460",
    "analytics_419235081",
    "analytics_426335133",
    "analytics_316960860",
    "analytics_316932832",
    "analytics_316977696",
    "analytics_316929216",
    "analytics_318917248",
    "analytics_438247379",
    "analytics_316942377",
    "analytics_318878504",
    "analytics_425698160",
    "analytics_318896987",
    "analytics_316933072",
    "analytics_316962392",



]

const DATASUFIXO = datasufixo()

module.exports = {
    DATASET_PARTE1,
    DATASET_PARTE2,
    DATASET_PARTE3,
    DATASET_PARTE4,
    DATASET_PARTE5,
    DATASET_PARTE6,
    DATASET_PARTE7,
    DATASUFIXO
};
