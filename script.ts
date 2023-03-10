
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

vypisJmena();
vypisKurzyNBP();







