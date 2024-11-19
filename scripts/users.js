$(document).ready(function() {
    $("#confirmPasswordGroup").hide();
    $("#nombreGroup").hide();
    $("#telefonoGroup").hide();
    $("#dniGroup").hide();
    
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
});

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

    fetch('https://plsmotors-api.onrender.com/usuarios', {
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