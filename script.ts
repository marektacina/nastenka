
function stahniJSON(apiUrl: string, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        callback(JSON.parse(xhr.response));
    }
    xhr.open("GET", apiUrl);
    xhr.send();
}

function vypisJmena() {
    let dnyVTydnu = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
    let dnyVTydnuVypis = document.getElementsByClassName("den");
    let svatkyVypis = document.getElementsByClassName("svatek");
    let aktualniDen: Date = new Date(); // dnesni den

    dnyVTydnuVypis[(aktualniDen.getDay() == 0 ? 7 : aktualniDen.getDay()) - 1].className += " text-primary";
    svatkyVypis[(aktualniDen.getDay() == 0 ? 7 : aktualniDen.getDay()) - 1].className += " text-primary";

    let denVTydnu;
    for (let i = 0; i < 7; i++) {
        denVTydnu = aktualniDen.getDay() - 1;
        denVTydnu = (denVTydnu == -1 ? 6 : denVTydnu); // pro nedeli zmeni z 0 na 6
        aktualniDen.setDate(aktualniDen.getDate() - denVTydnu + i); // dny  v aktualnim tydnu po-ne
        dnyVTydnuVypis[i].innerHTML = `${dnyVTydnu[aktualniDen.getDay()]} ${aktualniDen.getDate()}.${aktualniDen.getMonth()}.  `
    }

    let pondeli: Date = new Date();
    let posun = pondeli.getDay() == 0? 6 : pondeli.getDay() - 1;
    pondeli.setDate(pondeli.getDate() - posun);
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
        let symboly = {'cloudy': '04', 'rain': '09', 'lightrain': '46', 'partlycloudy_night': '03n', 'heavyrain': '10',
        'heavysleet': '48', 'sleet': '12', 'lightsleet': '47', 'lightsnow': '49', 'fair_night': '01n', 'clearsky_day': '01d',
        'clearsky_night': '01n', 'partlycloudy_day': '03d', 'fair_day': '02d', 'snow': '13', 'fog': '15'};

        let containerPocasi = document.querySelector(`.${lokalita}`);

        for (let i = 1; i < 25; i++) {
            let radekPredpovedi = containerPocasi.getElementsByClassName(`radek${i}`);

            let sloupcePredpovedi = radekPredpovedi[0].getElementsByClassName("col");
            let cas = (predpoved.properties.timeseries[i].time).substr(11,2);

            let teplota = Math.round(Number(predpoved.properties.timeseries[i - 1].data.instant.details.air_temperature));

            let srazky = predpoved.properties.timeseries[i - 1].data.next_1_hours.details.precipitation_amount;
            srazky = (srazky.toString().includes('.') ? srazky : srazky + '.0');
            srazky = srazky == "0.0" ? "" : srazky;
            let vitr = Math.round(Number(predpoved.properties.timeseries[i - 1].data.instant.details.wind_speed));

            sloupcePredpovedi[0].innerHTML = `${cas}`;
            console.log(predpoved.properties.timeseries[i - 1].data.next_1_hours.summary.symbol_code);
            let urlObrazku = `https://www.yr.no/assets/images/weather-symbols/light-mode/default/svg/${symboly[predpoved.properties.timeseries[i - 1].data.next_1_hours.summary.symbol_code]}.svg`
            sloupcePredpovedi[1].innerHTML = `<img src="${urlObrazku}" style="width: 60%">`;
            sloupcePredpovedi[2].innerHTML = `${teplota}`;
            sloupcePredpovedi[2].className = teplota >= 0 ? "col text-danger" : "col text-primary";
            sloupcePredpovedi[3].innerHTML = `${srazky}`;
            sloupcePredpovedi[4].innerHTML = `${vitr}`;
        }
    });
}


vypisJmena();
vypisKurzyNBP();
vypisPocasi(51.0717922, 19.4338617, "pocasi-radomsko");
vypisPocasi(49.6336822, 18.6824547, "pocasi-karpentna   ");
// @ts-ignore
// async function myDisplay(): Promise<void> {
//     vypisPocasi(49.6336822, 18.6824547, "pocasi-radomsko");
//     await vypisPocasi(51.0717922, 19.4338617, "pocasi-karpentna");
// }
//
// myDisplay();







