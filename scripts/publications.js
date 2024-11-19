// Variables iniciales
let publicaciones = [];
let publicacionesFiltradas = [];
let matriculasFavoritas = [];
const dniUsuarioActual = "23456789C";
const publicacionesPorPagina = 9;
let paginaActual = 1;

// Mostrar el indicador de carga
function mostrarCargando() {
    document.getElementById('loading').style.display = 'block';
}

// Ocultar el indicador de carga
function ocultarCargando() {
    document.getElementById('loading').style.display = 'none';
}

// Obtener publicaciones de la API
async function obtenerPublicacionesAPI() {
    mostrarCargando();
    try {
        const response = await fetch('https://plsmotors-api.onrender.com/publicaciones');
        if (!response.ok) throw new Error('Error en la red');
        const data = await response.json();
        publicaciones = data.data;
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
    }
    ocultarCargando();
}

// Obtener publicaciones favoritas de la API
async function obtenerPublicacionesFavoritasAPI() {
    mostrarCargando();
    try {
        const response = await fetch(`https://plsmotors-api.onrender.com/favoritos/${dniUsuarioActual}`);
        if (!response.ok) throw new Error('Error en la red');

        const data = await response.json();
        console.log(data);

        // Extraer matrículas favoritas
        matriculasFavoritas = data.data.map(favorito => favorito.matricula_vehiculo);
    } catch (error) {
        console.error('Error al obtener tus publicaciones favoritas:', error);
    } finally {
        ocultarCargando();
    }
}

// Función para manejar la vista actual
async function manejarVistaActual() {
    await Promise.all([obtenerPublicacionesAPI(), obtenerPublicacionesFavoritasAPI()]);
    const publicacionesSection = document.querySelector('#publicaciones');
    const misPublicacionesSection = document.querySelector('#mis-publicaciones');
    const publicacionesFavoritasSection = document.querySelector('#publicaciones-favoritas');

    if (publicacionesSection && publicacionesSection.offsetParent !== null) {
        mostrarPublicaciones();
    } else if (misPublicacionesSection && misPublicacionesSection.offsetParent !== null) {
        mostrarMisPublicaciones(dniUsuarioActual);
    } else if (publicacionesFavoritasSection && publicacionesFavoritasSection.offsetParent !== null) {
        mostrarPublicacionesFavoritas();
    } else {
        console.error('Vista no reconocida');
    }
}

// Función para obtener datos del vehículo y usuario
async function obtenerDatosAdicionales(matricula, dni) {
    mostrarCargando();
    try {
        const [vehiculoResponse, usuarioResponse] = await Promise.all([
            fetch(`https://plsmotors-api.onrender.com/vehiculos/${matricula}`),
            fetch(`https://plsmotors-api.onrender.com/usuarios/${dni}`)
        ]);
        if (!vehiculoResponse.ok || !usuarioResponse.ok) throw new Error('Error en los datos adicionales');
        const vehiculo = await vehiculoResponse.json();
        const usuario = await usuarioResponse.json();
        return { vehiculo: vehiculo.data, usuario: usuario.data };
    } catch (error) {
        console.error('Error al obtener datos adicionales:', error);
        return { vehiculo: null, usuario: null };
    } finally {
        ocultarCargando();
    }
}

function mostrarPublicaciones(filtros = false) {
    obtenerPublicacionesAPI();
    const contenedor = document.querySelector('#publicaciones .container');
    contenedor.innerHTML = '';

    let publicacionesMostradas = [...publicaciones];

    // Filtrado
    if (filtros) {
        publicacionesMostradas = publicacionesMostradas.filter(publicacion => 
            publicacionesFiltradas.some(vehiculo => vehiculo.matricula === publicacion.matricula_vehiculo)
        );
    }

    // Paginación
    const inicio = (paginaActual - 1) * publicacionesPorPagina;
    const fin = inicio + publicacionesPorPagina;
    const publicacionesPaginadas = publicacionesMostradas.slice(inicio, fin);

    if (publicacionesPaginadas.length === 0) {
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje';
        mensaje.textContent = 'No hay publicaciones disponibles';
        contenedor.appendChild(mensaje);
        return;
    }

    // Crear tarjetas para las publicaciones
    const promises = publicacionesPaginadas.map(publicacion => 
        obtenerDatosAdicionales(publicacion.matricula_vehiculo, publicacion.dni_usuario)
            .then(({ vehiculo, usuario }) => {
                const isFavorita = matriculasFavoritas.includes(publicacion.matricula_vehiculo);
                return vehiculo ? crearTarjetaVehiculo(vehiculo, usuario, dniUsuarioActual, isFavorita) : null;
            })
            .catch(error => {
                console.error('Error al obtener datos adicionales:', error);
                return null;
            })
    );

    // Renderizado de las tarjetas y controles de paginación
    Promise.all(promises).then(vehicleCards => {
        const row = document.createElement('div');
        row.className = 'row';
        vehicleCards.forEach(card => {
            if (card) {
                row.appendChild(card);
            }
        });
        contenedor.appendChild(row);

        // Mostrar controles de páginas basados en las publicaciones filtradas
        mostrarControlesDePaginas(publicacionesMostradas);
    }).catch(error => {
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje';
        mensaje.textContent = 'Error al cargar las publicaciones';
        contenedor.appendChild(mensaje);
    });
}

function mostrarMisPublicaciones(dniUsuarioActual) {
    const contenedor = document.querySelector('#mis-publicaciones .container');
    contenedor.innerHTML = '';
    const publicacionesUsuario = publicaciones.filter(pub => pub.dni_usuario === dniUsuarioActual);

    if (publicacionesUsuario.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.className = 'mensaje';
        mensaje.textContent = 'No has publicado nada aún';
        contenedor.appendChild(mensaje);
        
        // Aquí puedes añadir la tarjeta vacía solo si no hay publicaciones
        const addCard = crearTarjetaVacia(dniUsuarioActual);
        contenedor.appendChild(addCard);
        
        return; // Termina la función aquí
    }

    const promises = publicacionesUsuario.map(publicacion =>
        obtenerDatosAdicionales(publicacion.matricula_vehiculo, publicacion.dni_usuario)
            .then(({ vehiculo, usuario }) => {
                if (vehiculo) {
                    return crearMiTarjetaVehiculo(publicacion, vehiculo, usuario);
                }
                return null;
            })
            .catch(error => {
                console.error('Error al obtener datos adicionales para la publicación:', error);
                return null;
            })
    );

    Promise.all(promises).then(vehicleCards => {
        const row = document.createElement('div');
        row.className = 'row';

        // Añadir todas las tarjetas de vehículo
        vehicleCards.forEach(card => {
            if (card) {
                row.appendChild(card);
            }
        });

        // Añadir la tarjeta de "añadir nueva publicación" si hay al menos una publicación
        const addCard = crearTarjetaVacia(dniUsuarioActual);
        row.appendChild(addCard);

        contenedor.appendChild(row);
    }).catch(error => {
        console.error('Error al mostrar mis publicaciones:', error);
    });
}    

async function mostrarPublicacionesFavoritas() {
    const contenedor = document.querySelector('#publicaciones-favoritas .container');
    contenedor.innerHTML = '';

    const publicacionesFavoritasFiltradas = publicaciones.filter(publicacion =>
        matriculasFavoritas.includes(publicacion.matricula_vehiculo)
    );

    if (publicacionesFavoritasFiltradas.length === 0) {
        const mensajeNoFavoritas = document.createElement('p');
        mensajeNoFavoritas.textContent = 'No tienes publicaciones favoritas';
        mensajeNoFavoritas.className = 'mensaje';
        contenedor.appendChild(mensajeNoFavoritas);
        return;
    }

    const promises = publicacionesFavoritasFiltradas.map(publicacion => 
        obtenerDatosAdicionales(publicacion.matricula_vehiculo, publicacion.dni_usuario)
            .then(({ vehiculo, usuario }) => {
                return vehiculo ? crearTarjetaVehiculo(vehiculo, usuario, dniUsuarioActual, true) : null;
            })
            .catch(error => {
                console.error('Error al obtener datos adicionales:', error);
                return null;
            })
    );

    Promise.all(promises).then(vehicleCards => {
        const row = document.createElement('div');
        row.className = 'row';
        vehicleCards.forEach(card => {
            if (card) {
                row.appendChild(card);
            }
        });
        contenedor.appendChild(row);
    }).catch(error => {
        console.error('Error al mostrar publicaciones favoritas:', error);
    });
}    

// Control de paginación
function mostrarControlesDePaginas(publicacionesMostradas) {
    const paginacion = document.querySelector('#pagination');
    paginacion.innerHTML = '';
    const totalPaginas = Math.ceil(publicacionesMostradas.length / publicacionesPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click', (event) => {
            event.preventDefault();
            paginaActual = i;
            mostrarPublicaciones(filtros = true);
        });
        paginacion.appendChild(pageItem);
    }
}

// Cambia el color del corazón entre lleno y vacío
function cambiarFavorito(event, dniUsuarioActual, matriculaVehiculo) {
    event.stopPropagation();
    event.preventDefault();

    const favoriteButton = event.target.closest('.favorite-btn');
    const heartIconEmpty = favoriteButton.querySelector('.far');
    const heartIconFilledRed = favoriteButton.querySelector('.fas[style*="color: red"]');
    const heartIconFilledWhite = favoriteButton.querySelector('.fas[style*="color: white"]');

    function removeAnimation() {
        heartIconFilledRed.classList.remove('favorite-animation');
        heartIconFilledWhite.classList.remove('favorite-animation');
        heartIconEmpty.classList.remove('favorite-animation');
    }

    const isRedVisible = window.getComputedStyle(heartIconFilledRed).display !== 'none';
    const isWhiteVisible = window.getComputedStyle(heartIconFilledWhite).display !== 'none';

    if (isRedVisible) {
        eliminarFavorito(dniUsuarioActual, matriculaVehiculo);
        heartIconFilledRed.style.display = 'none';
        heartIconFilledWhite.style.display = 'inline';
        heartIconFilledWhite.classList.add('favorite', 'favorite-animation');
        heartIconFilledRed.classList.remove('favorite', 'favorite-animation');
        heartIconEmpty.classList.add('favorite-animation');
        setTimeout(removeAnimation, 300);
    }

    if (isWhiteVisible) {
        agregarFavorito(dniUsuarioActual, matriculaVehiculo);
        heartIconFilledRed.style.display = 'inline';
        heartIconFilledWhite.style.display = 'none';
        heartIconFilledRed.classList.add('favorite', 'favorite-animation');
        heartIconFilledWhite.classList.remove('favorite', 'favorite-animation');
        heartIconEmpty.classList.add('favorite-animation');
        setTimeout(removeAnimation, 300);
    }
}

function agregarFavorito(dniUsuario, matriculaVehiculo) {
    fetch('https://plsmotors-api.onrender.com/favoritos', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        dni_usuario: dniUsuario,
        matricula_vehiculo: matriculaVehiculo
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Favorito añadido:', data);
    })
    .catch(error => {
        console.error('Error al añadir favorito:', error);
    });
}
  
function eliminarFavorito(dniUsuario, matriculaVehiculo) {
    fetch('https://plsmotors-api.onrender.com/favoritos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dni_usuario: dniUsuario,
        matricula_vehiculo: matriculaVehiculo
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Favorito eliminado:', data);
    })
    .catch(error => {
      console.error('Error al eliminar favorito:', error);
    });
}  

// Función para crear tarjeta de vehículo
function crearTarjetaVehiculo(vehiculo, usuario, dniUsuarioActual, isFavorite) {
    const vehicleCol = document.createElement('div');

    vehicleCol.className = 'col-md-6 col-lg-4 mb-4';
    vehicleCol.innerHTML = `
        <div class="cars panel-imagen" style="position: relative; cursor: pointer;">
            <a href="#" style="text-decoration: none;" data-toggle="modal" data-target="#vehicleModal" data-vehicle='${JSON.stringify(vehiculo)}'>
                <button class="favorite-btn" style="position: absolute; top: 10px; right: 20px; border: none; background: transparent;">
                    <i class="fas fa-heart fa-lg" aria-hidden="true" style="color: red; position: absolute; top: 0; left: 0; ${isFavorite ? 'display: inline;' : 'display: none;'}"></i>
                    <i class="fas fa-heart fa-lg" aria-hidden="true" style="color: white; position: absolute; top: 0; left: 0; ${isFavorite ? 'display: none;' : 'display: inline;'}"></i>
                    <i class="far fa-heart fa-lg" aria-hidden="true" style="color: black; position: absolute; top: 0; left: 0;"></i>
                </button>
                <img src="${vehiculo.imagenes[0]}" class="img-fluid" alt="${vehiculo.marca} ${vehiculo.modelo} en venta">
                <h5>${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.motor} ${vehiculo.combustible} ${vehiculo.cv} CV</h5>
                <p>${vehiculo.ciudad} | ${vehiculo.transmision} | ${vehiculo.ano} | ${vehiculo.kilometraje} km</p>
                <h3 class="text-primary font-weight-bold">${vehiculo.precio} €</h3>
            </a>
        </div>
    `;

    // Evento para cambiar el color del corazón
    vehicleCol.querySelector('.favorite-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        cambiarFavorito(event, dniUsuarioActual, vehiculo.matricula);
        // Mostrar valores en la consola
        console.log("Usuario:", dniUsuarioActual);
        console.log("Matrícula del vehículo:", vehiculo.matricula);
    });

    vehicleCol.addEventListener('click', (event) => manejarClickVehiculo(event, vehiculo, usuario));
    return vehicleCol;
}

// Función para crear mi tarjeta de vehículo
function crearMiTarjetaVehiculo(publicacion, vehiculo, usuario) {
    const vehicleCol = document.createElement('div');
    vehicleCol.className = 'col-md-6 col-lg-4 mb-4';
    vehicleCol.innerHTML = `
        <div class="cars panel-imagen" style="position: relative; cursor: pointer;">
            <a href="#" style="text-decoration: none;" data-toggle="modal" data-target="#vehicleModal" data-vehicle='${JSON.stringify(vehiculo)}'>
                <img src="${vehiculo.imagenes[0]}" class="img-fluid" alt="${vehiculo.marca} ${vehiculo.modelo} en venta">
                <h5>${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.motor} ${vehiculo.combustible} ${vehiculo.cv} CV</h5>
                <p>${vehiculo.ciudad} | ${vehiculo.transmision} | ${vehiculo.ano} | ${vehiculo.kilometraje} km</p>
                <h3 class="text-primary font-weight-bold">${vehiculo.precio} €</h3>
                <div class="action-buttons" style="position: absolute; top: 10px; right: 20px;">
                    <button class="edit-btn" style="border: none; background: transparent; position: relative;" title="Editar">
                        <i class="fas fa-edit fa-lg" style="color: blue; position: absolute; top: -10px; left: -15px;"></i>
                        <i class="far fa-edit fa-lg" style="color: black; position: absolute; top: -10px; left: -15px;"></i>
                    </button>
                    <button class="delete-btn" style="border: none; background: transparent; position: relative;" title="Eliminar">
                        <i class="fas fa-trash fa-lg" style="color: red; position: absolute; top: -10px; left: 0;"></i>
                        <i class="far fa-trash-alt fa-lg" style="color: black; position: absolute; top: -10px; left: 0;"></i>
                    </button>
                </div>
            </a>
        </div>
    `;

    // Modal de edición del anuncio
    vehicleCol.querySelector('.edit-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        abrirModalEditar(vehiculo);
    });

    // Modal de eliminar el anuncio
    vehicleCol.querySelector('.delete-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        abrirModalEliminar(publicacion, vehiculo);
    });

    vehicleCol.addEventListener('click', (event) => manejarClickVehiculo(event, vehiculo, usuario));
    return vehicleCol;
}

// Función para crear la tarjeta vacía con el signo de "más"
function crearTarjetaVacia(dniUsuarioActual) {
    const vehicleCol = document.createElement('div');
    vehicleCol.className = 'col-md-6 col-lg-4 mb-4';
    vehicleCol.innerHTML = `
        <div class="cars panel-imagen" style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fas fa-plus fa-4x" style="color: green;"></i>
        </div>
    `;

    vehicleCol.addEventListener('click', (event) => {
        event.stopPropagation();
        abrirModalCrearVehiculo(dniUsuarioActual);
    });

    return vehicleCol;
}

// Función para abrir el modal de creación de vehículo y manejar el envío del formulario
function abrirModalCrearVehiculo(dniUsuarioActual) {
    const createModal = document.getElementById('createVehicleModal');
    const form = createModal.querySelector('form');

    form.onsubmit = async (event) => {
        event.preventDefault();

        const valid = validarCampos(form, true);
        if (!valid) {
            return;
        }

        await crearVehiculoYPublicacion(form, dniUsuarioActual);
    };

    form.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    $(createModal).modal('show');
}

// Función para validar los campos del modal
function validarCampos(form, isCreating) {
    const requiredFields = [
        'marca',
        'modelo',
        'motor',
        'ano',
        'kilometraje',
        'cv',
        'precio',
        'provincia',
        'ciudad',
        'combustible',
        'transmision'
    ];

    if (isCreating) {
        requiredFields.unshift('matricula');
    }

    let valid = true;

    requiredFields.forEach(field => {
        const input = form.elements[field];
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = 'red';
            input.setAttribute('title', `${input.name} es obligatorio.`);
        } else {
            input.style.borderColor = '';
            input.removeAttribute('title');
        }
    });

    // Validar matrícula solo al crear vehículo
    if (isCreating) {
        const matriculaInput = form.elements['matricula'];
        const matriculaRegex = /^[0-9]{4}[A-Z]{3}$/; // Formato 1234ABC
        if (!matriculaRegex.test(matriculaInput.value)) {
            valid = false;
            matriculaInput.style.borderColor = 'red';
            matriculaInput.setAttribute('title', 'La matrícula debe ser en el formato 1234ABC');
            alert('La matrícula debe ser en el formato 1234ABC')
        }
    }

    return valid;
}

// Función para crear un vehículo y luego una publicación
async function crearVehiculoYPublicacion(form, dniUsuarioActual) {
    const vehicleData = {
        matricula: form.elements['matricula'].value,
        marca: form.elements['marca'].value,
        modelo: form.elements['modelo'].value,
        motor: form.elements['motor'].value,
        ano: parseInt(form.elements['ano'].value, 10),
        kilometraje: form.elements['kilometraje'].value,
        cv: form.elements['cv'].value,
        precio: form.elements['precio'].value,
        provincia: form.elements['provincia'].value,
        ciudad: form.elements['ciudad'].value,
        combustible: form.elements['combustible'].value,
        transmision: form.elements['transmision'].value,
        imagenes: [
            "images/cars/ford-fiesta_1.jpg",
            "images/cars/ford-fiesta_2.jpg"
        ]
    };

    console.log("Datos del vehículo a enviar:", vehicleData);
    try {
        const createVehicleResponse = await fetch('https://plsmotors-api.onrender.com/vehiculos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleData)
        });
            
        if (!createVehicleResponse.ok) {
            // Manejo de errores específicos basado la respuesta de la API
            if (createVehicleResponse.status === 409) {
                alert("Ya existe una publicación para el vehículo con la matrícula introducida");
            } else {
                alert("Error al crear el vehículo");
            }
            return;
        }
    
        await crearPublicacion(vehicleData.matricula, dniUsuarioActual);
    
        $('#createVehicleModal').modal('hide');
        location.reload();
    
    } catch (error) {
        alert('No se pudo crear el vehículo. Inténtalo de nuevo más tarde.');
    }    
}

// Función para crear una publicación
async function crearPublicacion(matriculaVehiculo, dniUsuarioActual) {
    const publicacionData = {
        dni_usuario: dniUsuarioActual,
        matricula_vehiculo: matriculaVehiculo
    };

    console.log("Datos de la publicación a enviar:", publicacionData);

    try {
        const createPublicationResponse = await fetch('https://plsmotors-api.onrender.com/publicaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publicacionData)
        });

        console.log("Respuesta de creación de publicación:", createPublicationResponse);

        if (!createPublicationResponse.ok) {
            const errorResponse = await createPublicationResponse.json();
            console.error("Error al crear la publicación:", errorResponse);
            throw new Error(`Error al crear la publicación: ${errorResponse.message || createPublicationResponse.statusText}`);
        }

        const createdPublication = await createPublicationResponse.json();
        console.log("Publicación creada con éxito:", createdPublication);
    } catch (error) {
        console.error("Error al crear la publicación:", error);
    }
}

// Función para abrir el modal de editar
function abrirModalEditar(vehicle) {
    const editModal = document.getElementById('editVehicleModal');
    const form = editModal.querySelector('form');

    form.elements['marca'].value = vehicle.marca;
    form.elements['modelo'].value = vehicle.modelo;
    form.elements['motor'].value = vehicle.motor;
    form.elements['ano'].value = vehicle.ano;
    form.elements['kilometraje'].value = vehicle.kilometraje;
    form.elements['cv'].value = vehicle.cv;
    form.elements['precio'].value = vehicle.precio;
    form.elements['provincia'].value = vehicle.provincia;
    form.elements['ciudad'].value = vehicle.ciudad;
    form.elements['combustible'].value = vehicle.combustible;
    form.elements['transmision'].value = vehicle.transmision;

    const imageContainer = editModal.querySelector('.image-container');
    imageContainer.innerHTML = ''; 
    
    // Añadir las imágenes del vehículo
    vehicle.imagenes.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${vehicle.marca} ${vehicle.modelo}`;
        img.classList.add('vehicle-image');
        imageContainer.appendChild(img);
        img.addEventListener('click', function() {
            alert('Eliminar imagen');
        }); 
    });
    
    const addImageWrapper = document.createElement('div');
    addImageWrapper.classList.add('vehicle-image');
    addImageWrapper.classList.add('add-btn');

    const addIcon = document.createElement('i');
    addIcon.classList.add('fas', 'fa-plus', 'fa-2x');
    addIcon.style.color = 'green';
    
    addImageWrapper.appendChild(addIcon);
    imageContainer.appendChild(addImageWrapper);
    
    addImageWrapper.addEventListener('click', function() {
        alert('Añadir nueva imagen');
    });    

    form.onsubmit = async (event) => {
        event.preventDefault();

        const valid = validarCampos(form);
        if (!valid) return;

        console.log("Formulario de edición enviado.");
        await actualizarDatosVehiculo(form, vehicle);
    };

    form.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    $(editModal).modal('show');
    editModal.dataset.vehicleId = vehicle.matricula;
}

async function actualizarDatosVehiculo(form, vehicle) {
    const newValues = {
        matricula: vehicle.matricula,
        marca: form.elements['marca'].value,
        modelo: form.elements['modelo'].value,
        motor: form.elements['motor'].value,
        ano: parseInt(form.elements['ano'].value, 10),
        kilometraje: form.elements['kilometraje'].value,
        cv: form.elements['cv'].value,
        precio: form.elements['precio'].value,
        provincia: form.elements['provincia'].value,
        ciudad: form.elements['ciudad'].value,
        combustible: form.elements['combustible'].value,
        transmision: form.elements['transmision'].value,
        imagenes: vehicle.imagenes
    };

    const isChanged = Object.keys(newValues).some(key => newValues[key] !== vehicle[key]);
    if (!isChanged) {
        alert("No se han realizado cambios en los datos del vehículo.");
        console.log("No hay cambios para actualizar.");
        return;
    }

    try {
        console.log(`Actualizando datos para el vehículo con matrícula: ${vehicle.matricula}`);

        const updateResponse = await fetch(`https://plsmotors-api.onrender.com/vehiculos/${vehicle.matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newValues)
        });

        if (!updateResponse.ok) {
            const errorResponse = await updateResponse.json();
            throw new Error(`Error al actualizar el vehículo: ${errorResponse.message || updateResponse.statusText}`);
        }

        const updatedData = await updateResponse.json();
        console.log("Vehículo actualizado con éxito:", updatedData);
        
        $('#editVehicleModal').modal('hide');
        location.reload();
    } catch (updateError) {
        console.error("Error al actualizar el vehículo:", updateError);
    }
}

async function abrirModalEliminar(publicacion, vehiculo) {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el vehículo ${vehiculo.modelo}?`);
    if (confirmacion) {
        try {
            const responsePublicacion = await fetch(`https://plsmotors-api.onrender.com/publicaciones/${publicacion._id}`, {
                method: 'DELETE'
            });
            if (!responsePublicacion.ok) throw new Error('Error al eliminar la publicación')
            const responseVehiculo = await fetch(`https://plsmotors-api.onrender.com/vehiculos/${vehiculo.matricula}`, {
                method: 'DELETE'
            });
            if (!responseVehiculo.ok) throw new Error('Error al eliminar el vehículo');

            console.log('Publicación eliminada:', responsePublicacion);
            console.log('Vehículo eliminado:', responseVehiculo);

            location.reload();
        } catch (error) {
            console.error('Error al eliminar el vehículo:', error);
            alert('No se pudo eliminar la publicación. Inténtalo de nuevo más tarde.');
        }
    }
}

function manejarClickVehiculo(event, vehicle, user) {
    if (event.target.closest('.panel-imagen')) {
        abrirModalVehiculo(vehicle, user);
    }
}

// Abre el modal con la información del vehículo
function abrirModalVehiculo(vehicleData, userData) {
    document.getElementById('vehicleModalLabel').innerText = `${vehicleData.marca} ${vehicleData.modelo}`;
    const modalDetailsContainer = document.getElementById('modal-details');
    modalDetailsContainer.innerHTML = `
        <h4><strong>Datos del Vehículo:</strong></h4>
        <p>Marca: ${vehicleData.marca}</p>
        <p>Modelo: ${vehicleData.modelo}</p>
        <p>Motor: ${vehicleData.motor}</p>
        <p>Año: ${vehicleData.ano}</p>
        <p>Kilometraje: ${vehicleData.kilometraje}</p>
        <p>CV: ${vehicleData.cv}</p>
        <p>Precio: ${vehicleData.precio}</p>
        <p>Provincia: ${vehicleData.provincia}</p>
        <p>Ciudad: ${vehicleData.ciudad}</p>
        <p>Combustible: ${vehicleData.combustible}</p>
        <p>Transmisión: ${vehicleData.transmision}</p>
        <br>
        ${userData ? `
            <h4><strong>Datos del Usuario:</strong></h4>
            <p>Nombre: ${userData.nombre}</p>
            <p>Email: ${userData.email}</p>
            <p>Teléfono: ${userData.telefono}</p>
        ` : '<p>No se pudo obtener información del usuario.</p>'}
    `;

    actualizarImagenesCarrusel(vehicleData.imagenes);
}

// Función para actualizar el carrusel con las imágenes del vehículo
function actualizarImagenesCarrusel(images) {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';

    images.forEach((image, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `<img src="${image}" class="img-fluid" alt="Imagen ${index + 1}">`;
        carouselInner.appendChild(carouselItem);
    });
}

// Animación del modal
$('#vehicleModal').on('show.bs.modal', function () {
    $(this).find('.modal-content').removeClass('modal-slide-out').addClass('modal-slide-in');
    $('#volverArriba').hide();
});

$('#vehicleModal').on('hide.bs.modal', function () {
    $(this).find('.modal-content').removeClass('modal-slide-in').addClass('modal-slide-out');
});

manejarVistaActual();