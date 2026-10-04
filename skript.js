//-------------------------1. osa Ostukorv ------------------------

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            korv.push(toode);
            lisaArtikkel(toode);  // selle funktsiooni loome allpool
            nupuOhjamine(lisaKorviNupp, toode);
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus();   // selle funktsiooni lisame allpool
    arvutaSumma();
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
        }
    });
    arvutaSumma();
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi && korvArtikkel.kogus > 1) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
        }
    });
    arvutaSumma();
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus')?.remove();
    }
    arvutaSumma();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <span>Kokku: <span class="korvi-summa">0</span> €</span>
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus')?.remove();
    korv = [];

    lisaKorviNupud.forEach(nupp => {
        nupp.innerText = 'Lisa ostukorvi';
        nupp.disabled = false;
    });

    arvutaSumma();
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaSumma() {
    let summa = 0;

    korv.forEach(korvArtikkel => {
        summa += Number(korvArtikkel.hind) * korvArtikkel.kogus;
    });

    const summaElement = document.querySelector('.korvi-summa');

    if (summaElement) {
        summaElement.innerText = summa;
    }
}

//-------------------------2. osa Taimer ------------------------

function alustaTaimer(kestvus, kuva) {
    const start = Date.now();
    let intervall;

    function taimer() {
        const vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        if (vahe < 0) {
            clearInterval(intervall);
            kuva.textContent = "alusta uuesti";
            return;
        }

        const minutid = String(Math.floor(vahe / 60)).padStart(2, "0");
        const sekundid = String(vahe % 60).padStart(2, "0");

        kuva.textContent = minutid + ":" + sekundid;
    }

    taimer();
    intervall = setInterval(taimer, 1000);
}

window.onload = function () {
    const taimeriAeg = 60 * 2;
    const kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
};

//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const telefon = document.getElementById("telefon");
const tarne1 = document.getElementById("tarne1");
const tarne2 = document.getElementById("tarne2");
const aadress = document.getElementById("aadress"); /*minu kood*/

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi");
    } else if (/\d/.test(eesnimi.value)) {
        errors.push("Eesnimi ei tohi sisaldada numbreid");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi");
    } else if (/\d/.test(perenimi.value)) {
        errors.push("Perenimi ei tohi sisaldada numbreid");
    }

    if (telefon.value.trim().length < 6) {
        errors.push("Telefoni number peab sisaldama vähemalt 6 sümbolit");
    }
    if (!/^\d*$/.test(telefon.value.trim())) {
        errors.push("Telefon võib sisaldada ainult numbreid");
    }

    if (aadress.value.trim() === "") {
        errors.push("Sisesta aadress");
    } /*minu kood*/

    if (!tarne1.checked && !tarne2.checked) {
        errors.push("Vali tarneviis");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    errorMessage.innerHTML = errors.join(", ");
});


/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */