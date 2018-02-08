let jsVotantes;
let jsPeliculas;
let elegido = 0;

let jsMarvel;

$(document).ready(function () {
    //makeChart(elegido);
});

function makeChart(e) {
    elegido = e;
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(recuperarPeliculas());
        var options = tipos[elegido];
        var chart = new google.visualization.PieChart(document.getElementById('grafica'));
        if (elegido == 1) {
            chart = new google.visualization.BarChart(document.getElementById('grafica'));
        }
        chart.draw(data, options);
    }
    $('#grafica').focus();
}

function recuperarPeliculas() {
    let pel = [];
    pel.push(['Película', 'Votos']);
    $(ip).each(function (i) {
        pel.push([ip[i].titulo, 0])
    })
    $(jsVotantes).each(function (j) {
        pel[parseInt(this.voto) + 1][1] += 1;
    })
    return pel;
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
    makeChart(elegido);
});



