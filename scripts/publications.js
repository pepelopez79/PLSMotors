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
        const response = await fetch(`${baseURL}/publicaciones`);
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
        const response = await fetch(`${baseURL}/favoritos/${dniUsuarioActual}`);
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

// Función para obtener datos del vehículo y usuario
async function obtenerDatosAdicionales(matricula, dni) {
    mostrarCargando();
    try {
        const [vehiculoResponse, usuarioResponse] = await Promise.all([
            fetch(`${baseURL}/vehiculos/${matricula}`),
            fetch(`${baseURL}/usuarios/${dni}`)
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

// Función para manejar la vista actual
async function manejarVistaActual() {
    await Promise.all([obtenerPublicacionesAPI(), obtenerPublicacionesFavoritasAPI()]);
    const publicacionesSection = document.querySelector('#publicaciones');
    const misPublicacionesSection = document.querySelector('#mis-publicaciones');
    const publicacionesFavoritasSection = document.querySelector('#publicaciones-favoritas');

    if (publicacionesSection && publicacionesSection.offsetParent !== null) {
        document.getElementById('reset-filters-btn').click();
    } else if (misPublicacionesSection && misPublicacionesSection.offsetParent !== null) {
        mostrarMisPublicaciones(dniUsuarioActual);
    } else if (publicacionesFavoritasSection && publicacionesFavoritasSection.offsetParent !== null) {
        mostrarPublicacionesFavoritas();
    } else {
        console.error('Vista no reconocida');
    }
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
    fetch(`${baseURL}/favoritos`, {
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
    fetch(`${baseURL}/favoritos`, {
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

// Función para subir imágenes al backend
async function subirImagenesBackend(archivos) {
    if (archivos.length === 0) {
        alert("Por favor, selecciona al menos una imagen.");
        return null;
    }

    const formData = new FormData();
    archivos.forEach(file => {
        formData.append('imagen', file);
    });

    try {
        const response = await fetch(`${baseURL}/subir_imagen`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            return result.rutas;
        } else {
            alert(`Error al subir imágenes.`);
            return null;
        }
    } catch (error) {
        console.error('Error al subir imágenes.');
        return null;
    }
}

// Función para eliminar imágenes en el backend
async function eliminarImagenesBackend(imagenes) {
    try {
        const response = await fetch(`${baseURL}/eliminar_imagenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imagenes })
        });

        console.log("Respuesta de eliminación de imágenes:", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error al eliminar imágenes:", errorResponse);
            throw new Error(`Error al eliminar imágenes: ${errorResponse.message || response.statusText}`);
        }

        const result = await response.json();
        console.log("Imágenes eliminadas con éxito:", result);
        return result;
    } catch (error) {
        console.error("Error al eliminar imágenes en el backend:", error);
        throw error;
    }
}

// Función para abrir el modal de creación de vehículo y manejar el envío del formulario
function abrirModalCrearVehiculo(dniUsuarioActual) {
    const createModal = document.getElementById('createVehicleModal');
    const form = createModal.querySelector('form');
    const imageContainer = createModal.querySelector('.image-container');
    const uploadedFiles = []; // Almacenar las imágenes seleccionadas para subir

    // Limpiar el contenedor de imágenes y la lista de archivos cada vez que se abre el modal
    imageContainer.innerHTML = '';
    uploadedFiles.length = 0;

    // Añadir el icono de "plus" para agregar imágenes
    const addImageWrapper = document.createElement('div');
    addImageWrapper.classList.add('vehicle-image', 'add-btn');

    const addIcon = document.createElement('i');
    addIcon.classList.add('fas', 'fa-plus', 'fa-2x');
    addIcon.style.color = 'green';

    addImageWrapper.appendChild(addIcon);
    imageContainer.appendChild(addImageWrapper);

    // Evento para abrir el selector de archivos
    addImageWrapper.addEventListener('click', function () {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'image/*';
        inputFile.multiple = true;

        inputFile.addEventListener('change', function (event) {
            const files = event.target.files;

            if (files.length > 0) {
                // Mostrar las imágenes seleccionadas y guardarlas para subirlas
                Array.from(files).forEach(file => {
                    // Obtener la fecha y hora actual
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().replace(/[:.-]/g, ''); // Formato: yyyyMMddHHmmss

                    // Crear un nuevo nombre para el archivo con la fecha y hora
                    const newFileName = `${formattedDate}_${file.name}`;

                    // Crear un nuevo objeto File con el nuevo nombre
                    const renamedFile = new File([file], newFileName, { type: file.type });

                    // Mostrar la imagen y agregarla a la lista de archivos subidos
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = renamedFile.name; // Usar el nuevo nombre
                        img.classList.add('vehicle-image');
                        img.file = renamedFile;
                        uploadedFiles.push(renamedFile);
                        imageContainer.insertBefore(img, addImageWrapper);

                        // Añadir el evento de confirmación para eliminar la imagen
                        img.addEventListener('click', function () {
                            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta imagen?');
                            if (confirmDelete) {
                                imageContainer.removeChild(img);
                                const index = uploadedFiles.indexOf(renamedFile);
                                if (index > -1) uploadedFiles.splice(index, 1);
                            }
                        });
                    };
                    reader.readAsDataURL(renamedFile);
                });
            }
        });

        inputFile.click();
    });

    form.onsubmit = async (event) => {
        event.preventDefault();

        const valid = validarCampos(form);
        if (!valid) return;

        // Subir imágenes al backend antes de crear el vehículo
        const rutasImagenes = await subirImagenesBackend(uploadedFiles);

        if (rutasImagenes) {
            // Enviar el formulario junto con las rutas de las imágenes al backend
            console.log("Formulario de creación enviado.");
            await crearVehiculoYPublicacion(form, dniUsuarioActual, rutasImagenes);
        }
    };

    form.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    $(createModal).modal('show');
}

// Función para crear un vehículo y luego una publicación
async function crearVehiculoYPublicacion(form, dniUsuarioActual, rutasImagenes) {
    const rutasCompletas = rutasImagenes.map(ruta => `${baseURL}/${ruta}`);

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
        imagenes: rutasCompletas || []
    };

    console.log("Datos del vehículo a enviar:", vehicleData);
    try {
        const createVehicleResponse = await fetch(`${baseURL}/vehiculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleData)
        });
            
        if (!createVehicleResponse.ok) {
            // Manejo de errores específicos basado en la respuesta de la API
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
        console.error('Error al crear el vehículo:', error);
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
        const createPublicationResponse = await fetch(`${baseURL}/publicaciones`, {
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

function abrirModalEditar(vehicle) {
    const editModal = document.getElementById('editVehicleModal');
    const form = editModal.querySelector('form');
    const imageContainer = editModal.querySelector('.image-container');
    const uploadedFiles = [];
    const imagesToDelete = [];

    // Inicializar vehicle.imagenes como un array vacío si es undefined o null
    vehicle.imagenes = vehicle.imagenes && Array.isArray(vehicle.imagenes) ? vehicle.imagenes : [];

    // Rellenar los campos del formulario con los datos del vehículo
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

    imageContainer.innerHTML = '';

    // Asegurarse de que la lista de imágenes esté correctamente inicializada antes de recorrerla
    if (vehicle.imagenes.length > 0) {
        vehicle.imagenes.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${vehicle.marca} ${vehicle.modelo}`;
            img.classList.add('vehicle-image');
            imageContainer.appendChild(img);

            // Evento para eliminar imagen
            img.addEventListener('click', function () {
                const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta imagen?');
                if (confirmDelete) {
                    imageContainer.removeChild(img);
                    // Eliminar la imagen de vehicle.imagenes
                    const index = vehicle.imagenes.indexOf(src);
                    if (index > -1) {
                        vehicle.imagenes.splice(index, 1); // Eliminarla del array
                    }
                    // Agregar la imagen a la lista de imágenes a eliminar
                    imagesToDelete.push(src);
                }
            });
        });
    }

    // Crear el icono de "plus" para añadir imágenes
    const addImageWrapper = document.createElement('div');
    addImageWrapper.classList.add('vehicle-image', 'add-btn');

    const addIcon = document.createElement('i');
    addIcon.classList.add('fas', 'fa-plus', 'fa-2x');
    addIcon.style.color = 'green';

    addImageWrapper.appendChild(addIcon);
    imageContainer.appendChild(addImageWrapper);

    // Evento para abrir el selector de imágenes cuando se hace clic en el icono "plus"
    addImageWrapper.addEventListener('click', function () {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'image/*';
        inputFile.multiple = true;

        inputFile.addEventListener('change', function (event) {
            const files = event.target.files;

            if (files.length > 0) {
                // Mostrar las imágenes seleccionadas y guardarlas para subirlas
                Array.from(files).forEach(file => {
                    // Obtener la fecha y hora actual
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().replace(/[:.-]/g, ''); // Formato: yyyyMMddHHmmss

                    // Crear un nuevo nombre para el archivo con la fecha y hora
                    const newFileName = `${formattedDate}_${file.name}`;

                    // Crear un nuevo objeto File con el nuevo nombre
                    const renamedFile = new File([file], newFileName, { type: file.type });

                    // Mostrar la imagen y agregarla a la lista de archivos subidos
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = renamedFile.name; // Usar el nuevo nombre
                        img.classList.add('vehicle-image');
                        img.file = renamedFile;
                        uploadedFiles.push(renamedFile);
                        imageContainer.insertBefore(img, addImageWrapper);

                        // Añadir el evento de confirmación para eliminar la imagen
                        img.addEventListener('click', function () {
                            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta imagen?');
                            if (confirmDelete) {
                                imageContainer.removeChild(img);
                                imagesToDelete.push(renamedFile.name);
                                const index = uploadedFiles.indexOf(renamedFile);
                                if (index > -1) uploadedFiles.splice(index, 1);
                            }
                        });
                    };
                    reader.readAsDataURL(renamedFile);
                });
            }
        });

        // Abrir el selector de archivos
        inputFile.click();
    });

    // Validación y envío del formulario
    form.onsubmit = async (event) => {
        event.preventDefault();

        const valid = validarCampos(form);
        if (!valid) return;

        // Verificar si se ha agregado o eliminado alguna imagen
        if (uploadedFiles.length > 0 || imagesToDelete.length > 0) {
            // Subir las nuevas imágenes al backend si es necesario
            const rutasImagenes = uploadedFiles.length > 0 ? await subirImagenesBackend(uploadedFiles) : [];

            if (rutasImagenes.length > 0 || imagesToDelete.length > 0) {
                // Eliminar las imágenes del backend que fueron marcadas para eliminación
                if (imagesToDelete.length > 0) {
                    await eliminarImagenesBackend(imagesToDelete);
                }

                // Enviar los datos de la edición junto con las rutas de las imágenes al backend
                console.log("Formulario de edición enviado.");
                await actualizarDatosVehiculo(form, vehicle, rutasImagenes.length > 0 ? rutasImagenes : undefined);
            }
        } else {
            console.log("No se han añadido ni eliminado imágenes.");
            // Si no hay cambios en las imágenes, solo actualizar los datos del vehículo
            await actualizarDatosVehiculo(form, vehicle);
        }
    };

    // Prevenir que el formulario se envíe al presionar Enter
    form.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    // Mostrar el modal
    $(editModal).modal('show');
    editModal.dataset.vehicleId = vehicle.matricula;
}

async function actualizarDatosVehiculo(form, vehicle, rutasImagenes) {
    // Verificar que rutasImagenes sea un array válido antes de hacer map
    const rutasValidas = Array.isArray(rutasImagenes) ? rutasImagenes : [];

    // Asegúrate de que todas las rutas de imagen tengan el baseURL
    const rutasConBaseURL = rutasValidas.map(ruta => `${baseURL}/${ruta}`);

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
        imagenes: [...vehicle.imagenes, ...rutasConBaseURL]
    };

    console.log("Datos del vehículo a actualizar:", newValues);

    try {
        const updateVehicleResponse = await fetch(`${baseURL}/vehiculos/${vehicle.matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newValues)
        });

        if (!updateVehicleResponse.ok) {
            alert("No se han realizado cambios en el vehículo.");
            return;
        }

        $('#editVehicleModal').modal('hide');
        location.reload();

    } catch (error) {
        console.error('Error al actualizar el vehículo:', error);
        alert('No se pudo actualizar el vehículo. Inténtalo de nuevo más tarde.');
    }
}

async function abrirModalEliminar(publicacion, vehiculo) {
    const modal = document.createElement('div');
    modal.id = 'modal-eliminar';
    modal.style = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 30%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            width: 300px;
        ">
            <h3 style="margin-bottom: 15px;">Confirmar eliminación</h3>
            <p id="modal-mensaje" style="margin-bottom: 40px;">
                ¿Estás seguro de que quieres eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo}?
            </p>
            <div class="modal-botones" style="display: flex; justify-content: space-between;">
                <button id="btn-cancelar" style="
                    padding: 10px 20px;
                    background: gray; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                ">Cancelar</button>
                <button id="btn-confirmar" style="
                    padding: 10px 20px; 
                    background: red; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                ">Eliminar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const confirmacion = await new Promise((resolve) => {
        const btnCancelar = document.getElementById('btn-cancelar');
        const btnConfirmar = document.getElementById('btn-confirmar');

        btnCancelar.onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };

        btnConfirmar.onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };
    });

    if (confirmacion) {
        try {
            // Eliminar publicación
            const responsePublicacion = await fetch(`${baseURL}/publicaciones/${publicacion._id}`, {
                method: 'DELETE'
            });
            if (!responsePublicacion.ok) throw new Error('Error al eliminar la publicación');

            // Eliminar vehículo
            const responseVehiculo = await fetch(`${baseURL}/vehiculos/${vehiculo.matricula}`, {
                method: 'DELETE'
            });
            if (!responseVehiculo.ok) throw new Error('Error al eliminar el vehículo');

            // Eliminar imágenes asociadas usando eliminarImagenesBackend
            const resultadoImagenes = await eliminarImagenesBackend(vehiculo.imagenes);
            console.log("Eliminación de imágenes:", resultadoImagenes);

            // Recargar la página
            location.reload();
        } catch (error) {
            console.error('Error al eliminar el vehículo:', error);
            alert('No se pudo eliminar la publicación. Inténtalo de nuevo más tarde.');
        }
    }
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