// Variables globales
let baseURL = "https://plsmotors-api.onrender.com"
//let baseURL = "http://127.0.0.1:5000"
let dniUsuarioActual = obtenerCookie("dniUsuarioActual");

function obtenerCookie(nombre) {
    let nombreCookie = nombre + "=";
    let decodificado = decodeURIComponent(document.cookie);
    let listaCookies = decodificado.split(';');

    for (let i = 0; i < listaCookies.length; i++) {
        let cookie = listaCookies[i].trim();
        if (cookie.indexOf(nombreCookie) == 0) {
            return cookie.substring(nombreCookie.length, cookie.length);
        }
    }
    return "";
}

function guardarCookie(nombre, valor, dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    let expiracion = "expires=" + fecha.toUTCString();
    document.cookie = nombre + "=" + valor + ";" + expiracion + ";path=/";
}

function eliminarCookie(nombre) {
    document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function obtenerCookie(nombre) {
    let nombreEQ = nombre + "=";
    let partes = document.cookie.split(';');
    
    for (let i = 0; i < partes.length; i++) {
        let c = partes[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nombreEQ) === 0) {
            return c.substring(nombreEQ.length, c.length);
        }
    }
    return null;
}

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