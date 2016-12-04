jQuery(document).ready(function($) {
    console.log('gensis: Ready to Start!');

    var headerFijo = $('.header-principal');
    var fijo = "header-fijo";
    var alto = 70;
    var menuMovilSup = $('.sup');
    var reset = "sup-reset";

    $(window).scroll(function() {
        if ($(this).scrollTop() > alto) {
            headerFijo.addClass(fijo);
            menuMovilSup.addClass(reset);
        } else {
            headerFijo.removeClass(fijo);
            menuMovilSup.removeClass(reset);
        }
    });

    var menu = $('.menu');
    var fondo = $('.contenido');
    var mm = $('.def');
    var entradaSalida = "io";

    var latIzq = $('.l-i');
    var latIzqReset ="lat-izq-reset";

    var latDer = $('.l-d');
    var latDerReset ="lat-der-reset";

    mm.click(function() {
        menu.toggleClass(entradaSalida);
    });
    latIzq.click(function() {
        menu.toggleClass(latIzqReset);
    });
    latDer.click(function() {
        menu.toggleClass(latDerReset);
    });

    fondo.click(function() {
        menu.removeClass(entradaSalida);
        menu.removeClass(latIzqReset);
        menu.removeClass(latDerReset);
    });
});