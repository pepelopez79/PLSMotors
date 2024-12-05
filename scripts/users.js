$(document).ready(function() {
    // Ocultar elementos al inicio
    $("#confirmPasswordGroup").hide();
    $("#nombreGroup").hide();
    $("#telefonoGroup").hide();
    $("#dniGroup").hide();
    $("#btnVolver").hide();
    $("#btnRegistro").hide();
    $("#btnCerrarSesion").hide();

    // Obtener el valor de la cookie (si existe)
    let dniUsuarioActual = obtenerCookie("dniUsuarioActual");

    // Si ya hay un DNI en la cookie, mostramos la información del usuario
    if (dniUsuarioActual) {
        mostrarInformacionUsuario(dniUsuarioActual);
    }

    // Al hacer clic en "Iniciar sesión"
    $("#btnIniciarSesion").on('click', function() {
        const email = $("#email").val();
        const contrasena = $("#password").val();

        if (!email || !contrasena) {
            alert("Por favor ingrese el correo electrónico y la contraseña.");
            return;
        }

        // Realizar la solicitud de inicio de sesión
        fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, contrasena: contrasena })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    alert(data.error || "Error desconocido");
                    throw new Error(data.error || 'Error en el inicio de sesión');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Inicio de sesión exitoso:', data);
            guardarCookie("token", data.token, 48); 
            dniUsuarioActual = "23456789C";
            guardarCookie("dniUsuarioActual", data.dni, 7);

            // Mostrar la información del usuario
            mostrarInformacionUsuario(dniUsuarioActual);
        })
        .catch(error => {
            console.error('Error al iniciar sesión:', error);
        });
    });

    // Al hacer clic en "Registrar"
    $("#btnRegistrar").on('click', function() {
        $("#confirmPasswordGroup").show();
        $("#nombreGroup").show();
        $("#telefonoGroup").show();
        $("#dniGroup").show();
        $("#btnIniciarSesion").hide();
        $("#btnRegistrar").hide();
        $("#btnVolver").show();
        $("#btnRegistro").show();
    });

    // Al hacer clic en "Volver"
    $("#btnVolver").on('click', function() {
        $("#confirmPasswordGroup").hide();
        $("#nombreGroup").hide();
        $("#telefonoGroup").hide();
        $("#dniGroup").hide();
        $("#btnIniciarSesion").show();
        $("#btnRegistrar").show();
        $("#btnVolver").hide();
        $("#btnRegistro").hide();

        $("#email").val('');
        $("#password").val('');
        $("#confirmPassword").val('');
        $("#dni").val('');
        $("#nombre").val('');
        $("#telefono").val('');
    });

    // Al hacer clic en "Cerrar sesión"
    $("#btnCerrarSesion").on('click', function() {
        // Eliminar la cookie del DNI
        eliminarCookie("dniUsuarioActual");
        eliminarCookie("token");
        // Recargar la página para reflejar el cambio
        location.reload();
    });
});

// Función para mostrar la información del usuario
function mostrarInformacionUsuario(dniUsuarioActual) {
    $("#usuarioInfo").text("Estás logueado como usuario con DNI " + dniUsuarioActual); 
    $("#btnCerrarSesion").show();

    // Ocultar los botones de inicio de sesión y registro
    $("#emailGroup").hide();
    $("#passwordGroup").hide();
    $("#btnIniciarSesion").hide();
    $("#btnRegistrar").hide();
}

// Función para validar campos
function validarCampos() {
    const email = $("#email").val();
    const contrasena = $("#password").val();
    const confirmContrasena = $("#confirmPassword").val();
    const dni = $("#dni").val();
    const nombre = $("#nombre").val();
    const telefono = $("#telefono").val();

    if (!email || !contrasena || !dni || !nombre || !telefono) {
        alert("Por favor complete todos los campos.");
        return false;
    }

    // Validar formato de correo
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor ingrese un correo electrónico válido.");
        return false;
    }

    // Validar que la contraseña tenga al menos 8 caracteres, una mayúscula, una minúscula, un número y un signo de puntuación
    const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-,])[A-Za-z\d.\-,]{8,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        alert("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un signo de puntuación.");
        return false;
    }

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmContrasena) {
        alert("Las contraseñas no coinciden.");
        return false;
    }

    // Validar formato de DNI
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(dni)) {
        alert("Por favor ingrese un DNI válido.");
        return false;
    }

    // Validar formato de teléfono
    const telefonoRegex = /^[679]{1}[0-9]{8}$/;
    if (!telefonoRegex.test(telefono)) {
        alert("Por favor ingrese un número de teléfono válido.");
        return false;
    }

    return true;
}

// Función para crear un usuario
function crearUsuario() {
    const email = $("#email").val();
    const contrasena = $("#password").val();
    const dni = $("#dni").val();
    const nombre = $("#nombre").val();
    const telefono = $("#telefono").val();
    const admin = false;

    const usuarioData = {
        admin: admin,
        contrasena: contrasena,
        dni: dni,
        email: email,
        nombre: nombre,
        telefono: telefono
    };

    fetch(`${baseURL}/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                if (response.status === 409 && data.error === "Ya existe un usuario registrado con este DNI.") {
                    alert("Hubo un error al crear el usuario. Inténtalo de nuevo.");
                } else {
                    alert("Ya existe un usuario registrado con este DNI.");
                }
                throw new Error(data.error || 'Error desconocido');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario creado con éxito:', data);
        alert("¡Usuario creado correctamente!");
        $("#btnVolver").click();
    })
    .catch(error => {
        console.error('Error al crear el usuario:', error);
    });
}

$("#btnRegistro").on('click', function() {
    if (validarCampos()) {
        crearUsuario();
    }
});
