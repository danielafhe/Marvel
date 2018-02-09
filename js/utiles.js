function comic() {
    this.id = "",
        this.img = "",
        this.title = "",
        this.description = "",
        this.page = "",
        this.pricePrint = "",
        this.priceDigital = ""
}

function character() {
    this.id = "",
        this.img = "",
        this.name = "",
        this.description = ""
}

let votante = {
    nombre: "",
    email: "",
    telefono: "",
    voto: ""
}

var tipos = [{
    title: 'Resultados de la votación:',
    pieSliceText: 'label',
    slices: {
        4: {
            offset: 0.2
        },
        12: {
            offset: 0.3
        },
        14: {
            offset: 0.4
        },
        15: {
            offset: 0.5
        },
    }

}, {
    title: 'Resultados de la votación',
    backgroundColor: "#f1f1f1",
    is3D: true,
    vAxis: {
        textPosition: 'in'
    }
}, {
    title: 'Resultados de la votación:',
    pieHole: 0.4
}]

function cargar() {
    let local;

    local = localStorage.getItem("jsVotantes");
    if (local != null) {
        jsVotantes = JSON.parse(local);
        console.log(local);
        jsVotantes.forEach(function (value, indice, array) {
            console.log(value);
        })
    } else {
        jsVotantes = [];
    }
}

let $cargarPaginacion = function () {
    function paginate(options) {
        var items = $(options.itemSelector);
        var numItems = items.length;
        var perPage = options.itemsPerPage;
        items.slice(perPage).hide();
        $(options.paginationSelector).pagination({
            items: numItems,
            itemsOnPage: perPage,
            cssStyle: "light-theme",
            onPageClick: function (pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
                return false;
            }
        });
    }

    paginate({
        itemSelector: "#cuerpo1 .card",
        paginationSelector: "#pagination-1",
        itemsPerPage: 10
    });
    paginate({
        itemSelector: "#cuerpo2 .card",
        paginationSelector: "#pagination-2",
        itemsPerPage: 10
    });
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}