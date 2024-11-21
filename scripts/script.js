// Variables globales
//let baseURL = "https://plsmotors-api.onrender.com"
let baseURL = "http://127.0.0.1:5000"

// Cargar el head
fetch('head.html')
    .then(response => response.text())
    .then(data => document.getElementById('head').innerHTML = data);

// Cargar el header
fetch('header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header').innerHTML = data);

// Cargar el footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// Leer Más/Menos
$(document).ready(function () {
    $(".leer-mas").click(function (event) {
        event.preventDefault();
        $(this).prev(".sinopsis").toggle();
        var textoBoton = $(this).text();
        $(this).text(textoBoton === "Leer más..." ? "Leer menos..." : "Leer más...");
    });
});

// Mostrar u ocultar botón volver arriba
$(window).on('scroll', function() {
    if ($(this).scrollTop() > 900) {
        $('#volverArriba').show();
    } else {
        $('#volverArriba').hide();
    }
});

// Desplazamiento al hacer clic en el botón
$('#volverArriba').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
});

$(document).ready(function() {
    // Leer Más/Menos
    $('#toggle-info').on('click', function(event) {
        event.preventDefault();
        const sinopsis = $('.sinopsis');
        let allVisible = true;

        sinopsis.each(function() {
            if ($(this).css('display') === 'none') {
                allVisible = false;
            }
        });

        sinopsis.each(function() {
            $(this).css('display', allVisible ? 'none' : 'block');
        });

        $(this).text(allVisible ? 'Leer más...' : 'Leer menos...');
    });
}); 