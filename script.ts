
function stahniJSON(apiUrl: string, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        callback(JSON.parse(xhr.response));
    }
    xhr.open("GET", apiUrl);
    xhr.send();
}

function vypisJmena() {
    let dnyVTydnu = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne'];
    let dnyVTydnuVypis = document.getElementsByClassName("den");
    let svatkyVypis = document.getElementsByClassName("svatek");
    let aktualniDen: Date = new Date(); // dnesni den

    dnyVTydnuVypis[aktualniDen.getDay() - 1].className += " text-primary";
    svatkyVypis[aktualniDen.getDay() - 1].className += " text-primary";


    for (let i = 0; i < 7; i++) {
        aktualniDen.setDate(aktualniDen.getDate() - aktualniDen.getDay() + 1 + i); // dny  v aktualnim tydnu po-ne
        let denVTydnu = aktualniDen.getDay();
        denVTydnu = denVTydnu == 0 ? 7 : denVTydnu; // pro nedeli zmeni z 0 na 7

        dnyVTydnuVypis[i].innerHTML = `${dnyVTydnu[denVTydnu - 1]} ${aktualniDen.getDate()}.${aktualniDen.getMonth()}.  `
    }

    let pondeli: Date = new Date();
    pondeli.setDate(pondeli.getDate() - pondeli.getDay() + 1);
    let url = `https://svatkyapi.cz/api/week/${pondeli.toJSON().substring(0,10)}`

    stahniJSON(url, (mid) => {
        for (let j = 0; j < 7; j++) {
            svatkyVypis[j].innerHTML = mid[j].name;

        }
    });
}

function vypisKurzyNBP() {
    let kurzyCode = ["EUR", "USD", "CZK"];
    for (let i = 0; i < 3; i++) {
        let url = `https://api.nbp.pl/api/exchangerates/rates/A/${kurzyCode[i]}?format=json`
        stahniJSON(url, (mid) => {
            document.querySelector(`.${kurzyCode[i]}`).innerHTML +=
                ` ${((mid.rates[0].mid).toString()).replace(".", ",")}`;
        });
    }
}


function vypisPocasi(lat: number, lon: number, lokalita: string) {
    let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?altitude=400&lat=${lat}&lon=${lon}`;
    stahniJSON(url, (predpoved) => {

        for (let i = 1; i < 13; i++) {
            let cas = (predpoved.properties.timeseries[i].time).substr(11,2);
            let teplota = Math.round(Number(predpoved.properties.timeseries[i - 1].data.instant.details.air_temperature));

            let srazky = predpoved.properties.timeseries[i - 1].data.next_1_hours.details.precipitation_amount;
            srazky = (srazky.toString().includes('.') ? srazky : srazky + '.0');
            srazky = srazky == "0.0" ? "" : srazky;

            let vitr = Math.round(Number(predpoved.properties.timeseries[i - 1].data.instant.details.wind_speed));

            let containerPocasi = document.querySelector(`.${lokalita}`);
            let radek = document.createElement("div");
            radek.className = "row";
            let sloupecHodiny = document.createElement("div");
            sloupecHodiny.className = "col";
            sloupecHodiny.innerHTML = `${cas}`;
            let sloupecTeplota = document.createElement("div");
            sloupecTeplota.innerHTML = `${teplota}`;
            sloupecTeplota.className = teplota >= 0 ? "col text-danger" : "col text-primary";
            let sloupecSrazky = document.createElement("div");
            sloupecSrazky.innerHTML = `${srazky}`;
            sloupecSrazky.className = "col";
            let sloupecVitr = document.createElement("div");
            sloupecVitr.innerHTML = `${vitr}`;
            sloupecVitr.className = "col";

            radek.appendChild(sloupecHodiny);
            radek.appendChild(sloupecTeplota);
            radek.appendChild(sloupecSrazky);
            radek.appendChild(sloupecVitr);
            containerPocasi.appendChild(radek);
        }
    });
}


vypisJmena();
vypisKurzyNBP();
vypisPocasi(49.6336822, 18.6824547, "pocasi-karpentna");
vypisPocasi(51.0717922, 19.4338617, "pocasi-radomsko");








