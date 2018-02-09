let inicializado = false;
let comicsAll = [];
let charactersAll = [];
let jsVotantes;
let apiActualizada = false;

//Imagen que se muestra cuando no está disponible la original
//var imgNotAva = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
var imgNotAva = "recursos/caratulas/image_not_available.jpg";
//var imgNotAva = "recursos/caratulas/generica.jpg";

/** 
 * Claves publicas y privadas para la api
 */
var keyPublic = "94bb05418c2277d4e4065e4a5336879d";
var keyPrivate = "2d1b1267a94252c88f7c88f3edef2964eafd1cd3";

/**
 * Title que sirve de plantilla
 */
let cardTitle =
    "<div tabindex='-1' class='cardTitle card text-center' style='width: 30%; min-width: 18rem; margin-top: 2rem;'>" +
    "<img aria-label='Imagen de cartelera de la película.' class='card-img-top' src='' alt='Card image cap'>" +
    "<div class='card-body'> " +
    " <h1 tabindex='0' class='card-title'></h1>" +
    " <p tabindex='0' class='card-text'></p>" +
    "<button type='button' href='#' aria-label='Pulse enter para ver más información.' tabindex='0' class='btn btn-primary' data-toggle='modal' data-target='#myModal'>Información</button> " +
    "</div>" +
    "</div>";

$(document).ready(function () {
    if (!apiActualizada)
        peticionMarvel(getData(0), getData(1));
});


//credit: http://stackoverflow.com/a/1527820/52160
/**
 * Devuelve una u otra url dependiendo del parametro recibido
 */
function getData(e) {
    let cantidad = 100;
    let urlCo = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&orderBy=title&limit=" + cantidad + "&apikey=" + keyPublic;
    let urlCh = "https://gateway.marvel.com:443/v1/public/characters?orderBy=name&limit=" + cantidad + "&apikey=" + keyPublic;
    let elegido = e == 0 ? urlCo : urlCh;

    //let ts = new Date().getTime();
    //let hash = CryptoJS.MD5(ts + keyPrivate + keyPublic);
    //elegido += "&ts=" + ts + "&hash=" + hash;

    return $.get(elegido);
}

/**
 * Realiza una busqueda personalizada a la api
 */
function buscarCustom() {
    let ordenElegido = $("#inputGroupSelect03").val() != "Orden" ? "&orderBy=" + $("#inputGroupSelect03").val() : "";
    let startWithElegido = $("#inputSearchCustom").val() != "" ? "&nameStartsWith=" + $("#inputSearchCustom").val() : "";
    peticionMarvel(getDataCustom(ordenElegido, startWithElegido, 0), getDataCustom(ordenElegido, startWithElegido, 1));

    return false;
}

/**
 * Dependiendo de los datos del check y del input, devuelve otros resultados 
 * a la api.
 * @param {*} orden valor del combobox
 * @param {*} inicio valor del input
 * @param {*} e tipo de busqueda, character-comic
 */
function getDataCustom(orden, inicio, e) {
    let ordenFinal;
    let titleFinal;
    if (orden.includes("name"))
        ordenFinal = "&orderBy=title";
    else
        ordenFinal = orden;
    if (inicio.includes("name"))
        titleFinal = "&titleStartsWith=" + inicio.slice(16, inicio.length);
    else
        titleFinal = inicio;

    let cantidad = 100;
    let urlCo = "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&limit=" + cantidad + titleFinal + ordenFinal + "&apikey=" + keyPublic;
    let urlCh = "https://gateway.marvel.com:443/v1/public/characters?limit=" + cantidad + inicio + orden + "&apikey=" + keyPublic;
    let elegido = e == 0 ? urlCo : urlCh;
    /*
        let ts = new Date().getTime();
        let hash = CryptoJS.MD5(ts + keyPrivate + keyPublic);
        elegido += "&ts=" + ts + "&hash=" + hash;
    */
    return $.get(elegido);
}
/**
 * Realiza las peticiones a la api con las url recibidas, guardo los objetos recibidos en los 
 * array correspondientes para su posterior gestion.
 * @param {*} a Peticion numero 1, comics
 * @param {*} b Peticion numero 2, characters
 */
function peticionMarvel(a, b) {
    //if (!inicializado) {
    $("#cuerpo1 *").remove();
    $("#cuerpo2 *").remove();
    let promises = [];
    promises.push(a);
    promises.push(b);
    $(".errorServer").hide();
    $(".loader").show();
    comicsAll = [];
    charactersAll = [];

    $.when.apply($, promises).done(function () {
        let args = Array.prototype.slice.call(arguments, 0);
        console.log(args);

        let comics = args[0][0];
        let jsComics = comics.data.results;
        if (comics.code === 200) {
            $(jsComics).each(function (i) {
                $("#cuerpo1").append(cardTitle);
                let c = new comic();
                c.id = jsComics[i].id != null ? jsComics[i].id : "Indefinido.";
                c.img = jsComics[i].images[0] != null ? jsComics[i].images[0].path + "." + jsComics[i].images[0].extension : imgNotAva;
                c.title = jsComics[i].title != null ? jsComics[i].title : "No contiene título.";
                c.description = jsComics[i].description != null && jsComics[i].description != "" ? jsComics[i].description : "No contiene una descripción válida.";
                c.page = jsComics[i].pageCount != null ? jsComics[i].pageCount : "Indefinido.";
                c.pricePrint = jsComics[i].prices[0] != null ? jsComics[i].prices[0].price : "Indefinido.";
                c.priceDigital = jsComics[i].prices[1] != null ? jsComics[i].prices[1].price : "Indefinido.";
                comicsAll.push(c);
            });
        }

        let characters = args[1][0];
        let jsCharacters = characters.data.results
        if (characters.code === 200) {
            $(jsCharacters).each(function (i) {
                $("#cuerpo2").append(cardTitle);
                let c = new character();
                c.id = jsCharacters[i].id != null ? jsCharacters[i].id : "Indefinido.";
                c.img = jsCharacters[i].thumbnail != null ? jsCharacters[i].thumbnail.path + "." + jsCharacters[i].thumbnail.extension : imgNotAva;
                c.name = jsCharacters[i].name != null ? jsCharacters[i].name : "Indefinido.";
                c.description = jsCharacters[i].description != null && jsCharacters[i].description != "" ? jsCharacters[i].description : "No contiene una descripción válida.";
                charactersAll.push(c);
            });
        }

        $cargarTitles();
        $cargarPaginacion();
        localStorage.setItem("comicsAll", JSON.stringify(comicsAll));
        localStorage.setItem("charactersAll", JSON.stringify(charactersAll));
        $(".loader").hide();
        //inicializado = true;
    }).catch(function (error) {
        $(".errorServer").fadeIn(3000);
        $(".loader").hide();
    });
    //}
}

/** 
 * Cargar los titles con los datos del array correspondiente
*/
let $cargarTitles = function () {
    $("#cuerpo1 .cardTitle").each(function (i) {
        $(this).children().eq(0).attr("src", comicsAll[i].img);
        $(this).children().eq(0).attr("alt", comicsAll[i].title);
        $(this).children().eq(1).children().eq(0).text(comicsAll[i].title);
        $(this).children().eq(1).children().eq(1).text(comicsAll[i].description.substring(0, 20) + "...");
        $(this).children().eq(1).children().eq(2).attr("href", i);
        $(this).children().eq(1).children().eq(2).on("click", function () {
            modificarModalComic($(this).attr("href"));
        });
    });

    $("#cuerpo2 .cardTitle").each(function (i) {
        $(this).children().eq(0).attr("src", charactersAll[i].img);
        $(this).children().eq(0).attr("alt", charactersAll[i].name);
        $(this).children().eq(1).children().eq(0).text(charactersAll[i].name);
        $(this).children().eq(1).children().eq(1).text(charactersAll[i].description.substring(0, 20) + "...");
        $(this).children().eq(1).children().eq(2).attr("href", i);
        $(this).children().eq(1).children().eq(2).on("click", function () {
            modificarModalCharacter($(this).attr("href"));
        });
    });
}

/**
 * Modificar el modal para el tipo comic, mostrando en cada item su atributo
 * @param {*} i id del comic
 */
function modificarModalComic(i) {
    $(".cajaFormulario").find("form").attr("id", "comicVote");
    $("#md-body-info").attr("ident", comicsAll[i].id);
    $("#md-title").text(comicsAll[i].title);
    let $img = $("#md-img");
    $img.attr("src", comicsAll[i].img);
    $img.attr("class", "img-fluid");
    $img.attr("alt", "Imagen portada " + comicsAll[i].title);
    $img.attr("style", "width: 100%");
    $("#md-res").children().eq(0).text("Título: " + comicsAll[i].title);
    $("#md-res").children().eq(1).text("Cantidad páginas: " + comicsAll[i].page);
    $("#md-res").children().eq(2).text("Precio físico: " + comicsAll[i].pricePrint + "$");
    $("#md-res").children().eq(3).text("Precio digital: " + comicsAll[i].priceDigital + "$");
    $("#md-res").children().eq(4).text("");
    $("#md-res").children().eq(5).text("Descripción: " + comicsAll[i].description);
}

/**
 * Modificar el modal para el tipo comic, mostrando en cada item su atributo
 * @param {*} i id del character
 */
function modificarModalCharacter(i) {
    $(".cajaFormulario").find("form").attr("id", "characterVote");
    $("#md-body-info").attr("ident", charactersAll[i].id);
    $("#md-title").text(charactersAll[i].name);
    let $img = $("#md-img");
    $img.attr("src", charactersAll[i].img);
    $img.attr("class", "img-fluid");
    $img.attr("alt", "Imagen portada " + charactersAll[i].name);
    $img.attr("style", "width: 100%");
    $("#md-res").children().eq(0).text("Nombre: " + charactersAll[i].name);
    $("#md-res").children().eq(1).text("");
    $("#md-res").children().eq(2).text("");
    $("#md-res").children().eq(3).text("");
    $("#md-res").children().eq(4).text("");
    $("#md-res").children().eq(5).text("Descripción: " + charactersAll[i].description);
}

/**
 * Guarda el voto de un usuario en el array, comprobando que no se repite el email del usuario
 * @param {*} e formulario con los datos
 */
function saveVote(e) {
    let valido = true;
    let votado = false;
    let nombre = $("#inputName").val();
    let email = $("#inputEmail").val();
    let telefono = $("#inputTelefono").val();
    let index = $("#md-body-info").attr("ident");
    let title = $("#md-title").text();

    if (e.id == "comicVote") {
        $(jsVotantes).each(function (i) {
            if ($(this)[0].email == email && $(this)[0].votoComicId == "") {
                jsVotantes[i].votoComicId = index;
                jsVotantes[i].votoComicName = title;
                votado = true;
            } else if ($(this)[0].email == email && $(this)[0].votoComicId != "") {
                valido = false;
            }
        });
        if (!votado && valido) {
            jsVotantes.push({
                nombre: nombre,
                email: email,
                telefono: telefono,
                votoComicId: index,
                votoComicName: title,
                votoCharacterId: "",
                votoCharacterName: ""
            })
        }
    } else if (e.id == "characterVote") {
        $(jsVotantes).each(function (i) {
            if ($(this)[0].email == email && $(this)[0].votoCharacterId == "") {
                jsVotantes[i].votoCharacterId = index;
                jsVotantes[i].votoCharacterName = title;
                votado = true;
            } else if ($(this)[0].email == email && $(this)[0].votoCharacterId != "") {
                valido = false;
            }
        });
        if (!votado && valido) {
            jsVotantes.push({
                nombre: nombre,
                email: email,
                telefono: telefono,
                votoComicId: "",
                votoComicName: "",
                votoCharacterId: index,
                votoCharacterName: title
            })
        }
    }

    if (!valido) {
        $("#error").fadeIn(1500);
        setTimeout(function () {
            $("#error").fadeOut(3000);
        }, 3000);
    } else {
        $('#cerrarModal').click();
    }

    localStorage.setItem("jsVotantes", JSON.stringify(jsVotantes));
    console.log(jsVotantes)

    return false;
}