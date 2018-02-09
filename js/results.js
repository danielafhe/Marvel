let jsVotantes;
let elegido = 0;

$(document).ready(function () {
    makeChartComics(elegido);
    makeChartCharacters(elegido);
});

function makeChartComics(e) {
    elegido = e;
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(recuperarComics());
        var options = tipos[elegido];
        var chart = new google.visualization.PieChart(document.getElementById('graficaComics'));
        if (elegido == 1) {
            chart = new google.visualization.BarChart(document.getElementById('graficaComics'));
        }
        chart.draw(data, options);
    }
    //$('#grafica').focus();
}
function makeChartCharacters(e) {
    elegido = e;
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(recuperarCharacters());
        var options = tipos[elegido];
        var chart = new google.visualization.PieChart(document.getElementById('graficaCharacters'));
        if (elegido == 1) {
            chart = new google.visualization.BarChart(document.getElementById('graficaCharacters'));
        }
        chart.draw(data, options);
    }
    //$('#grafica').focus();
}

function recuperarComics() {
    let votosComics = [];
    votosComics.push(['Comic', 'Votos']);
    $(jsVotantes).each(function (i) {
        if (jsVotantes[i].votoComicName != "") {
            let sumado = false;
            $(votosComics).each(function (j) {
                if (votosComics[j][0] == jsVotantes[i].votoComicName) {
                    votosComics[j][1] += 1;
                    sumado = true;
                }
            })
            if (!sumado)
                votosComics.push([jsVotantes[i].votoComicName, 1])
        }
    });
    return votosComics;
}

function recuperarCharacters() {
    let votosCharacter = [];
    votosCharacter.push(['Personaje', 'Votos']);
    $(jsVotantes).each(function (i) {
        if (jsVotantes[i].votoCharacterName != "") {
            let sumado = false;
            $(votosCharacter).each(function (j) {
                if (votosCharacter[j][0] == jsVotantes[i].votoCharacterName) {
                    votosCharacter[j][1] += 1;
                    sumado = true;
                }
            })
            if (!sumado)
                votosCharacter.push([jsVotantes[i].votoCharacterName, 1])
        }
    });
    return votosCharacter;
}

function cargar() {
    let local;

    local = localStorage.getItem("jsVotantes");
    if (local != null) {
        jsVotantes = JSON.parse(local);
        /*
        jsVotantes.forEach(function (value, indice, array) {
            console.log(value);
        })
        */
    } else {
        jsVotantes = [];
    }
}
$(window).resize(function () {
    makeChartComics(elegido);
    makeChartCharacters(elegido);
});