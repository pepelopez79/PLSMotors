const vehicles = [
    {
        marca: "BMW",
        modelo: "Serie 3 330i M Sport 258CV 2018 4p.",
        ano: 2018,
        kilometraje: "50,000 km",
        cv: "150 CV",
        precio: "25,000€",
        provincia: "Comunidad de Madrid",
        ciudad: "Madrid",
        combustible: "Gasolina",
        transmision: "Automático",
        imagenes: [
            "images/cars/bmw-serie3_1.jpg",
            "images/cars/bmw-serie3_2.jpg"
        ],
        autor: "Pepe López"
    },
    {
        marca: "Audi",
        modelo: "A3 Sportback 1.5 TFSI 150CV 2020 5p.",
        ano: 2020,
        kilometraje: "30,000 km",
        cv: "110 CV",
        precio: "22,000€",
        provincia: "Cataluña",
        ciudad: "Barcelona",
        combustible: "Diésel",
        transmision: "Manual",
        imagenes: [
            "images/cars/audi-a3_1.jpg",
            "images/cars/audi-a3_2.jpg",
            "images/cars/audi-a3_3.jpg",
            "images/cars/audi-a3_4.jpg",
            "images/cars/audi-a3_5.jpg"
        ],
        autor: "María Fernández"
    },
    {
        marca: "Mercedes-Benz",
        modelo: "Clase C 220d Avantgarde 194CV 2019 4p.",
        ano: 2019,
        kilometraje: "40,000 km",
        cv: "180 CV",
        precio: "28,000€",
        provincia: "Comunidad Valenciana",
        ciudad: "Valencia",
        combustible: "Gasolina",
        transmision: "Automático",
        imagenes: [
            "images/cars/mercedes-clasec_1.jpg",
            "images/cars/mercedes-clasec_2.jpg",
            "images/cars/mercedes-clasec_3.jpg"
        ],
        autor: "Pepe López"
    },
    {
        marca: "Audi",
        modelo: "Q5 2.0 TDI 190CV 2021 5p.",
        ano: 2021,
        kilometraje: "20,000 km",
        cv: "190 CV",
        precio: "35,000€",
        provincia: "Andalucía",
        ciudad: "Sevilla",
        combustible: "Diésel",
        transmision: "Automático",
        imagenes: [
            "images/cars/audi-q5_1.jpg",
            "images/cars/audi-q5_2.jpg",
            "images/cars/audi-q5_3.jpg"
        ],
        autor: "Luis Martínez"
    },
    {
        marca: "Ford",
        modelo: "Fiesta 1.0 EcoBoost 100CV 2017 5p.",
        ano: 2017,
        kilometraje: "60,000 km",
        cv: "100 CV",
        precio: "15,000€",
        provincia: "Aragón",
        ciudad: "Zaragoza",
        combustible: "Gasolina",
        transmision: "Manual",
        imagenes: [
            "images/cars/ford-fiesta_1.jpg",
            "images/cars/ford-fiesta_2.jpg"
        ],
        autor: "Ana Gómez"
    },
    {
        marca: "Volkswagen",
        modelo: "Golf 1.5 TSI 150CV 2022 5p.",
        ano: 2022,
        kilometraje: "10,000 km",
        cv: "140 CV",
        precio: "30,000€",
        provincia: "Andalucía",
        ciudad: "Málaga",
        combustible: "Gasolina",
        transmision: "Automático",
        imagenes: [
            "images/cars/volkswagen-golf_1.jpg",
            "images/cars/volkswagen-golf_2.jpg",
            "images/cars/volkswagen-golf_3.jpg",
            "images/cars/volkswagen-golf_4.jpg"
        ],
        autor: "Carlos Sánchez"
    },
    {
        marca: "Seat",
        modelo: "Leon 2.0 TDI 115CV 2020 5p.",
        ano: 2020,
        kilometraje: "25,000 km",
        cv: "115 CV",
        precio: "20,000€",
        provincia: "País Vasco",
        ciudad: "Bilbao",
        combustible: "Diésel",
        transmision: "Manual",
        imagenes: [
            "images/cars/seat-leon_1.jpg",
            "images/cars/seat-leon_2.jpg"
        ],
        autor: "Pepe López"
    },
    {
        marca: "Skoda",
        modelo: "Octavia 2.0 TDI 150CV 2019 5p.",
        ano: 2019,
        kilometraje: "35,000 km",
        cv: "150 CV",
        precio: "24,000€",
        provincia: "Gipuzkoa",
        ciudad: "San Sebastián",
        combustible: "Gasolina",
        transmision: "Manual",
        imagenes: [
            "images/cars/skoda-octavia_1.jpg",
            "images/cars/skoda-octavia_2.jpg",
            "images/cars/skoda-octavia_3.jpg"
        ],
        autor: "Javier Ruiz"
    },
    {
        marca: "Peugeot",
        modelo: "308 1.5 BlueHDi 130CV 2021 5p.",
        ano: 2021,
        kilometraje: "15,000 km",
        cv: "130 CV",
        precio: "23,000€",
        provincia: "Comunidad Valenciana",
        ciudad: "Alicante",
        combustible: "Diésel",
        transmision: "Automático",
        imagenes: [
            "images/cars/peugeot-308_1.jpg",
            "images/cars/peugeot-308_2.jpg",
            "images/cars/peugeot-308_3.jpg",
            "images/cars/peugeot-308_4.jpg"
        ],
        autor: "Sara López"
    },
    {
        marca: "Renault",
        modelo: "Megane 1.5 Blue dCi 115CV 2018 5p.",
        ano: 2018,
        kilometraje: "40,000 km",
        cv: "115 CV",
        precio: "18,000€",
        provincia: "Andalucía",
        ciudad: "Granada",
        combustible: "Gasolina",
        transmision: "Manual",
        imagenes: [
            "images/cars/renault-megane_1.jpg",
            "images/cars/renault-megane_2.jpg"
        ],
        autor: "Ana Gómez"
    },
    {
        marca: "Fiat",
        modelo: "500 1.2 69CV 2017 3p.",
        ano: 2017,
        kilometraje: "50,000 km",
        cv: "70 CV",
        precio: "12,000€",
        provincia: "Castilla-La Mancha",
        ciudad: "Toledo",
        combustible: "Gasolina",
        transmision: "Automático",
        imagenes: [
            "images/cars/fiat-500_1.jpg",
            "images/cars/fiat-500_2.jpg"
        ],
        autor: "Marta Jiménez"
    },
    {
        marca: "Toyota",
        modelo: "Corolla 1.8 Hybrid 130CV 2022 5p.",
        ano: 2022,
        kilometraje: "5,000 km",
        cv: "130 CV",
        precio: "27,000€",
        provincia: "Región de Murcia",
        ciudad: "Murcia",
        combustible: "Híbrido",
        transmision: "Automático",
        imagenes: [
            "images/cars/toyota-corolla_1.jpg",
            "images/cars/toyota-corolla_2.jpg",
            "images/cars/toyota-corolla_3.jpg"
        ],
        autor: "Roberto Pérez"
    }
];

// Anuncios Favoritos
const favoriteVehicles = [
    {
        marca: "Fiat",
        modelo: "500 1.2 69CV 2017 3p."
    },
    {
        marca: "Peugeot",
        modelo: "308 1.5 BlueHDi 130CV 2021 5p."
    },
    {
        marca: "Volkswagen",
        modelo: "Golf 1.5 TSI 150CV 2022 5p."
    },
    {
        marca: "Toyota",
        modelo: "Corolla 1.8 Hybrid 130CV 2022 5p."
    }
];

// Paginación
let currentPage = 1;
const vehiclesPerPage = 9;

// Mostrar los vehículos de la página actual
function displayVehicles() {
    const vehicleList = document.getElementById('vehicle-list');
    vehicleList.innerHTML = '';

    const startIndex = (currentPage - 1) * vehiclesPerPage;
    const endIndex = Math.min(startIndex + vehiclesPerPage, vehicles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const vehicle = vehicles[i];
        const vehicleCol = createVehicleCard(vehicle);

        // Añadir evento de clic para abrir el modal
        vehicleCol.addEventListener('click', (event) => handleVehicleClick(event, vehicle));
        
        vehicleList.appendChild(vehicleCol);
    }

    displayPaginationControls();
}

// Mostrar los vehículos favoritos de la página actual
function displayFavoriteVehicles() {
    const vehicleList = document.getElementById('favorite-vehicle-list');
    vehicleList.innerHTML = '';

    // Filtrar los vehículos para mostrar solo los favoritos
    const favoriteVehicleModels = favoriteVehicles.map(vehicle => vehicle.modelo);
    const favoriteVehiclesToDisplay = vehicles.filter(vehicle => favoriteVehicleModels.includes(vehicle.modelo));

    const startIndex = (currentPage - 1) * vehiclesPerPage;
    const endIndex = Math.min(startIndex + vehiclesPerPage, favoriteVehiclesToDisplay.length);

    for (let i = startIndex; i < endIndex; i++) {
        const vehicle = favoriteVehiclesToDisplay[i];
        const vehicleCol = createVehicleCard(vehicle);

        // Añadir evento de clic para abrir el modal
        vehicleCol.addEventListener('click', (event) => handleVehicleClick(event, vehicle));
        
        vehicleList.appendChild(vehicleCol);
    }

    displayPaginationControls();
}

// Mostrar mis vehículos (anuncios) de la página actual
function displayMyVehicles() {
    const vehicleList = document.getElementById('my-vehicle-list');
    vehicleList.innerHTML = '';

    // Filtrar los vehículos publicados por ti
    const myVehicles = vehicles.filter(vehicle => vehicle.autor === "Pepe López");

    const startIndex = (currentPage - 1) * vehiclesPerPage;
    const endIndex = Math.min(startIndex + vehiclesPerPage, myVehicles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const vehicle = myVehicles[i];
        const vehicleCol = createMyVehicleCard(vehicle);

        // Añadir evento de clic para abrir el modal
        vehicleCol.addEventListener('click', (event) => handleVehicleClick(event, vehicle));
        
        vehicleList.appendChild(vehicleCol);
    }

    displayPaginationControls();
}

// Crea un elemento de tarjeta para el vehículo
function createVehicleCard(vehicle) {
    const vehicleCol = document.createElement('div');
    vehicleCol.className = 'col-md-6 col-lg-4 mb-4';

    const isFavorite = favoriteVehicles.some(favorite => favorite.modelo === vehicle.modelo);

    vehicleCol.innerHTML = `
        <div class="cars" style="position: relative;">
            <a href="#" class="panel-imagen" data-toggle="modal" data-target="#vehicleModal" data-vehicle='${JSON.stringify(vehicle)}'>
                <button class="favorite-btn" style="position: absolute; top: 10px; right: 20px; border: none; background: transparent;">
                    <i class="fas fa-heart fa-lg" aria-hidden="true" style="color: red; position: absolute; top: 0; left: 0; ${isFavorite ? 'display: inline;' : 'display: none;'}"></i>
                    <i class="fas fa-heart fa-lg" aria-hidden="true" style="color: white; position: absolute; top: 0; left: 0; ${isFavorite ? 'display: none;' : 'display: inline;'}"></i>
                    <i class="far fa-heart fa-lg" aria-hidden="true" style="color: black; position: absolute; top: 0; left: 0;"></i>
                </button>
                <img src="${vehicle.imagenes[0]}" class="img-fluid" alt="${vehicle.marca} ${vehicle.modelo} en venta">
                <h5>${vehicle.marca} ${vehicle.modelo}</h5>
                <p>${vehicle.ciudad} | ${vehicle.combustible} | ${vehicle.ano} | ${vehicle.kilometraje}</p>
                <h3 class="text-primary font-weight-bold">${vehicle.precio}</h3>
            </a>
        </div>
    `;

    // Evento para cambiar el color del corazón
    vehicleCol.querySelector('.favorite-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFavorite(event);
    });

    return vehicleCol;
}

// Crea un elemento de tarjeta para el vehículo
function createMyVehicleCard(vehicle) {
    const vehicleCol = document.createElement('div');
    vehicleCol.className = 'col-md-6 col-lg-4 mb-4';

    vehicleCol.innerHTML = `
        <div class="cars" style="position: relative;">
            <a href="#" class="panel-imagen" data-toggle="modal" data-target="#vehicleModal" data-vehicle='${JSON.stringify(vehicle)}'>
                <img src="${vehicle.imagenes[0]}" class="img-fluid" alt="${vehicle.marca} ${vehicle.modelo} en venta">
                <h5>${vehicle.marca} ${vehicle.modelo}</h5>
                <p>${vehicle.ciudad} | ${vehicle.combustible} | ${vehicle.ano} | ${vehicle.kilometraje}</p>
                <h3 class="text-primary font-weight-bold">${vehicle.precio}</h3>
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
        openEditModal(vehicle);
    });

    // Modal de eliminar el anuncio
    vehicleCol.querySelector('.delete-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        deleteVehicle(vehicle);
    });

    return vehicleCol;
}

function openEditModal(vehicle) {
    const editModal = document.getElementById('editVehicleModal');
    const form = editModal.querySelector('form');

    form.elements['marca'].value = vehicle.marca;
    form.elements['modelo'].value = vehicle.modelo;
    form.elements['ano'].value = vehicle.ano;
    form.elements['kilometraje'].value = vehicle.kilometraje;
    form.elements['cv'].value = vehicle.cv;
    form.elements['precio'].value = vehicle.precio;
    form.elements['provincia'].value = vehicle.provincia;
    form.elements['ciudad'].value = vehicle.ciudad;
    form.elements['combustible'].value = vehicle.combustible;
    form.elements['transmision'].value = vehicle.transmision;

    $(editModal).modal('show');

    editModal.dataset.vehicleId = vehicle.modelo;
}

function deleteVehicle(vehicle) {
    if (confirm(`¿Estás seguro de que quieres eliminar el vehículo ${vehicle.modelo}?`)) {
        vehicles = vehicles.filter(v => v.modelo !== vehicle.modelo);
        
        displayMyVehicles();
        alert(`Vehículo ${vehicle.modelo} eliminado con éxito.`);
    }
}

function handleVehicleClick(event, vehicle) {
    if (event.target.closest('.panel-imagen')) {
        openVehicleModal(vehicle);
    }
}

// Abre el modal con la información del vehículo
function openVehicleModal(vehicleData) {
    document.getElementById('vehicleModalLabel').innerText = `${vehicleData.marca} ${vehicleData.modelo}`;
    document.getElementById('modal-price').innerText = vehicleData.precio;
    document.getElementById('modal-year').innerText = vehicleData.ano;
    document.getElementById('modal-mileage').innerText = vehicleData.kilometraje;
    document.getElementById('modal-cv').innerText = vehicleData.cv;
    document.getElementById('modal-province').innerText = vehicleData.provincia;
    document.getElementById('modal-city').innerText = vehicleData.ciudad;
    document.getElementById('modal-fuel').innerText = vehicleData.combustible;
    document.getElementById('modal-transmission').innerText = vehicleData.transmision;
    document.getElementById('modal-author').innerText = vehicleData.autor;

    updateCarouselImages(vehicleData.imagenes);
}

// Actualiza el carrusel con las imágenes del vehículo
function updateCarouselImages(images) {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';

    images.forEach((image, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `<img src="${image}" class="img-fluid" alt="Imagen ${index + 1}">`;
        carouselInner.appendChild(carouselItem);
    });
}

// Cambia el color del corazón entre lleno y vacío
function toggleFavorite(event) {
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
        // Cambiar de rojo a blanco
        heartIconFilledRed.style.display = 'none';
        heartIconFilledWhite.style.display = 'inline';

        heartIconFilledWhite.classList.add('favorite', 'favorite-animation');
        heartIconFilledRed.classList.remove('favorite', 'favorite-animation');
        heartIconEmpty.classList.add('favorite-animation');

        setTimeout(removeAnimation, 300);
    }

    if (isWhiteVisible) {
        // Cambiar de blanco a rojo
        heartIconFilledRed.style.display = 'inline';
        heartIconFilledWhite.style.display = 'none';

        heartIconFilledRed.classList.add('favorite', 'favorite-animation');
        heartIconFilledWhite.classList.remove('favorite', 'favorite-animation');
        heartIconEmpty.classList.add('favorite-animation');

        setTimeout(removeAnimation, 300);
    }
}

// Animación del modal
$('#vehicleModal').on('show.bs.modal', function () {
    $(this).find('.modal-content').removeClass('modal-slide-out').addClass('modal-slide-in');
    $('#volverArriba').hide();
});

$('#vehicleModal').on('hide.bs.modal', function () {
    $(this).find('.modal-content').removeClass('modal-slide-in').addClass('modal-slide-out');
});

// Función para mostrar los controles de paginación
function displayPaginationControls() {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        pageItem.addEventListener('click', function(event) {
            event.preventDefault();
            currentPage = i;
            displayVehicles();
            displayMyVehicles();
            displayFavoriteVehicles();
            const carsSection = document.getElementById('cars');
            carsSection.scrollIntoView({ behavior: 'smooth' });
            displayPaginationControls();
        });
        
        paginationControls.appendChild(pageItem);
    }
}

document.addEventListener('DOMContentLoaded', displayVehicles);
document.addEventListener('DOMContentLoaded', displayMyVehicles);
document.addEventListener('DOMContentLoaded', displayFavoriteVehicles);

document.getElementById('editVehicleModal').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const vehicleId = this.dataset.vehicleId;

    const vehicleIndex = vehicles.findIndex(vehicle => vehicle.modelo === vehicleId);

    if (vehicleIndex !== -1) {
        vehicles[vehicleIndex].marca = form.marca.value;
        vehicles[vehicleIndex].modelo = form.modelo.value;
        vehicles[vehicleIndex].ano = form.ano.value;
        vehicles[vehicleIndex].kilometraje = form.kilometraje.value;
        vehicles[vehicleIndex].cv = form.cv.value;
        vehicles[vehicleIndex].precio = form.precio.value;
        vehicles[vehicleIndex].provincia = form.provincia.value;
        vehicles[vehicleIndex].ciudad = form.ciudad.value;
        vehicles[vehicleIndex].combustible = form.combustible.value;
        vehicles[vehicleIndex].transmision = form.transmision.value;

        displayMyVehicles();

        $(this).modal('hide');
        alert(`Vehículo ${vehicles[vehicleIndex].modelo} editado con éxito.`);
    }
});