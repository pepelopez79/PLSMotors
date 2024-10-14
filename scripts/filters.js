// Filtros
const generateOptions = (array, name) => {
    return array.map(item => `<option value="${item.toLowerCase().replace(/\s+/g, '_')}">${item}</option>`).join('');
};

document.getElementById('search-btn').addEventListener('click', function() {
    // Lógica de la búsqueda filtrada
});

// Almacenar valores por defecto
const defaultValues = {
    brand: 'all',
    model: '',
    province: 'all',
    city: 'all',
    mileageFrom: '0',
    mileageTo: '300000',
    yearFrom: '2024',
    yearTo: '1980',
    horsepowerFrom: '0',
    horsepowerTo: '500',
    priceFrom: '0',
    priceTo: '200000',
    fuel: 'all',
    transmission: 'all'
};

// Función para reiniciar todos los filtros
function resetFilters() {
    // Reiniciar marca y modelo
    document.getElementById('brand').value = defaultValues.brand;
    document.getElementById('model').disabled = true;
    document.getElementById('model').value = defaultValues.model;

    // Reiniciar provincia y ciudad
    document.getElementById('province').value = defaultValues.province;
    document.getElementById('city').disabled = true;
    document.getElementById('city').value = defaultValues.city;

    // Reiniciar kilometraje
    document.getElementById('mileage-from').value = defaultValues.mileageFrom;
    document.getElementById('mileage-to').value = defaultValues.mileageTo;

    // Reiniciar año
    document.getElementById('year-from').value = defaultValues.yearFrom;
    document.getElementById('year-to').value = defaultValues.yearTo;

    // Reiniciar caballos
    document.getElementById('horsepower-from').value = defaultValues.horsepowerFrom;
    document.getElementById('horsepower-to').value = defaultValues.horsepowerTo;

    // Reiniciar precio
    document.getElementById('price-from').value = defaultValues.priceFrom;
    document.getElementById('price-to').value = defaultValues.priceTo;

    // Reiniciar combustible y transmisión
    document.getElementById('fuel').value = defaultValues.fuel;
    document.getElementById('transmission').value = defaultValues.transmission;
}

document.getElementById('reset-filters-btn').addEventListener('click', function() {
    const icon = document.querySelector('.reset-icon');
    icon.classList.add('rotate');

    setTimeout(() => {
        icon.classList.remove('rotate');
    }, 600);
});

document.getElementById('reset-filters-btn').addEventListener('click', resetFilters);

// Marcas
const brands = [
    "Audi", "BMW", "Mercedes Benz", "Volkswagen", "Ford", "Toyota", "Honda", "Peugeot",
    "Renault", "Nissan", "Opel", "Fiat", "Skoda", "Citroën", "Mazda", "Subaru",
    "Volvo", "Land Rover", "Jaguar", "Tesla", "Porsche", "Lamborghini", "Ferrari",
    "Maserati", "Alfa Romeo", "Chrysler", "Dodge", "Jeep", "Mitsubishi", "Suzuki",
    "Kia", "Hyundai", "Tata", "MG", "DS"
];

// Modelos
const models = {
    audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron"],
    bmw: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "i3", "i4", "iX"],
    mercedes_benz: ["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "GLA", "GLB", "GLC", "GLE", "GLS", "EQC", "AMG GT"],
    volkswagen: ["Golf", "Polo", "Tiguan", "T-Roc", "Arteon", "Passat", "ID.3", "ID.4", "Jetta", "Beetle"],
    ford: ["Fiesta", "Focus", "Mondeo", "Kuga", "Mustang", "Explorer", "Edge", "Transit", "Ranger"],
    toyota: ["Corolla", "Camry", "Hilux", "RAV4", "Yaris", "Land Cruiser", "Aygo", "C-HR", "Mirai"],
    honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Fit", "Pilot", "Ridgeline"],
    peugeot: ["208", "308", "3008", "5008", "Partner", "508", "2008"],
    renault: ["Clio", "Megane", "Captur", "Koleos", "Kadjar", "Twingo", "Zoe"],
    nissan: ["Micra", "Qashqai", "Juke", "X-Trail", "Navara", "Leaf", "Armada"],
    opel: ["Astra", "Insignia", "Corsa", "Mokka", "Grandland", "Zafira", "Crossland"],
    fiat: ["Panda", "500", "Tipo", "Ducato", "Punto", "Doblo"],
    skoda: ["Octavia", "Fabia", "Superb", "Kodiaq", "Kamiq", "Scala", "Enyaq"],
    citroen: ["C3", "C4", "C5 Aircross", "Berlingo", "C1", "C4 Picasso"],
    mazda: ["Mazda2", "Mazda3", "CX-3", "CX-30", "CX-5", "CX-50", "MX-5"],
    subaru: ["Impreza", "Forester", "Outback", "XV", "BRZ", "Crosstrek"],
    volvo: ["V40", "S60", "V60", "S90", "V90", "XC40", "XC60", "XC90"],
    land_rover: ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport"],
    jaguar: ["XE", "XF", "XJ", "F-PACE", "E-PACE", "I-PACE"],
    tesla: ["Model S", "Model 3", "Model X", "Model Y"],
    porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
    lamborghini: ["Huracan", "Aventador", "Urus"],
    ferrari: ["488", "F8", "Portofino", "Roma", "SF90"],
    maserati: ["Ghibli", "Quattroporte", "Levante"],
    alfa_romeo: ["Giulia", "Stelvio", "Giulietta"],
    chrysler: ["300", "Pacifica"],
    dodge: ["Charger", "Challenger", "Durango"],
    jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Renegade"],
    mitsubishi: ["L200", "Outlander", "ASX", "Eclipse Cross"],
    suzuki: ["Vitara", "Swift", "Jimny", "Baleno"],
    kia: ["Rio", "Ceed", "Sportage", "Sorento", "Niro"],
    hyundai: ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona"],
    tata: ["Nexon", "Harrier", "Tiago"],
    mg: ["MG3", "MG ZS", "MG Hector"],
    ds: ["3", "4", "7", "7 Crossback"]
};

function updateModels() {
    const brandSelect = document.getElementById("brand");
    const modelSelect = document.getElementById("model");
    const selectedBrand = brandSelect.value;

    modelSelect.innerHTML = '<option value="">Selecciona un modelo</option>';
    modelSelect.disabled = false;

    if (selectedBrand in models) {
        models[selectedBrand].forEach(function(model) {
            const option = document.createElement("option");
            option.value = model.toLowerCase().replace(/\s+/g, '-'); 
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    } else {
        modelSelect.disabled = true;
    }
}

document.getElementById('brand').innerHTML += generateOptions(brands);

// Provincias
const provinces = [
    "Andalucía", "Cataluña", "Valencia", "Madrid", "País Vasco", "Galicia", "Castilla y León",
    "Castilla La Mancha", "Murcia", "Aragón", "Extremadura", "Navarra", "La Rioja", "Asturias",
    "Cantabria", "Islas Baleares", "Islas Canarias", "Ceuta y Melilla"
];

document.getElementById('province').innerHTML += generateOptions(provinces);

// Ciudades
function updateCities() {
    const province = document.getElementById('province').value.toLowerCase().replace(/\s+/g, '_');
    const citySelect = document.getElementById('city');

    citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

    let cities = [];
    if (province === 'andalucía') {
        cities = ['Sevilla', 'Málaga', 'Granada', 'Cádiz', 'Córdoba', 'Almería', 'Jaén', 'Huelva'];
    } else if (province === 'cataluña') {
        cities = ['Barcelona', 'Girona', 'Tarragona', 'Lleida', 'Badalona', 'Sabadell', 'Terrassa', 'Mataró'];
    } else if (province === 'valencia') {
        cities = ['Valencia', 'Alicante', 'Castellón', 'Elche', 'Gandía', 'Orihuela', 'Torrent'];
    } else if (province === 'madrid') {
        cities = ['Madrid', 'Alcalá de Henares', 'Móstoles', 'Getafe', 'Fuenlabrada'];
    } else if (province === 'país_vasco') {
        cities = ['Bilbao', 'San Sebastián', 'Vitoria-Gasteiz', 'Barakaldo', 'Irun', 'Portugalete'];
    } else if (province === 'galicia') {
        cities = ['Santiago de Compostela', 'A Coruña', 'Vigo', 'Lugo', 'Ourense'];
    } else if (province === 'castilla_y_león') {
        cities = ['Valladolid', 'Burgos', 'Salamanca', 'León', 'Segovia'];
    } else if (province === 'castilla_la_mancha') {
        cities = ['Toledo', 'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara'];
    } else if (province === 'murcia') {
        cities = ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura'];
    } else if (province === 'aragón') {
        cities = ['Zaragoza', 'Huesca', 'Teruel'];
    } else if (province === 'extremadura') {
        cities = ['Badajoz', 'Cáceres', 'Plasencia'];
    } else if (province === 'navarra') {
        cities = ['Pamplona', 'Tudela', 'Estella'];
    } else if (province === 'la_rioja') {
        cities = ['Logroño', 'Calahorra', 'Arnedo'];
    } else if (province === 'asturias') {
        cities = ['Oviedo', 'Gijón', 'Avilés'];
    } else if (province === 'cantabria') {
        cities = ['Santander', 'Torrelavega', 'Astillero'];
    } else if (province === 'islas_baleares') {
        cities = ['Palma', 'Ibiza', 'Mahón', 'Manacor'];
    } else if (province === 'islas_canarias') {
        cities = ['Las Palmas de Gran Canaria', 'Santa Cruz de Tenerife', 'San Cristóbal de La Laguna', 'La Orotava', 'Arrecife'];
    } else if (province === 'ceuta_y_melilla') {
        cities = ['Ceuta', 'Melilla'];
    }    

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase().replace(/\s+/g, '_');
        option.textContent = city;
        citySelect.appendChild(option);
    });

    citySelect.disabled = cities.length === 0;
}

document.getElementById('province').addEventListener('change', updateCities);

// Kilometraje
const generateMileageOptions = () => {
    return [...Array(16).keys()].map(i => `<option value="${i * 20000}">${i * 20000} km</option>`).join('');
};

document.getElementById('mileage-from').innerHTML += generateMileageOptions();
document.getElementById('mileage-to').innerHTML += generateMileageOptions();

document.getElementById('mileage-from').value = "0";
document.getElementById('mileage-to').value = "300000";

// Años
const generateYearOptions = () => {
    return [...Array(45).keys()].map(i => `<option value="${2024 - i}">${1980 + i}</option>`).join('');
};

document.getElementById('year-from').innerHTML += generateYearOptions();
document.getElementById('year-to').innerHTML += generateYearOptions();

document.getElementById('year-from').value = "2024";
document.getElementById('year-to').value = "1980";

// Potencia
const generateHorsepowerOptions = () => {
    return [...Array(11).keys()].map(i => `<option value="${i * 50}">${i * 50} CV</option>`).join('');
};

document.getElementById('horsepower-from').innerHTML += generateHorsepowerOptions();
document.getElementById('horsepower-to').innerHTML += generateHorsepowerOptions();

document.getElementById('horsepower-from').value = "0";
document.getElementById('horsepower-to').value = "500";

// Precios
const generatePriceOptions = () => {
    return [...Array(41).keys()].map(i => `<option value="${i * 5000}">${i * 5000} €</option>`).join('');
};

document.getElementById('price-from').innerHTML += generatePriceOptions();
document.getElementById('price-to').innerHTML += generatePriceOptions();

document.getElementById('price-from').value = "0";
document.getElementById('price-to').value = "200000";

// Combustible
const fuels = [
    { value: 'all', text: 'Todos' },
    { value: 'gasolina', text: 'Gasolina' },
    { value: 'diesel', text: 'Diésel' },
    { value: 'electrico', text: 'Eléctrico' },
    { value: 'hibrido', text: 'Híbrido' }
];

const generateFuelOptions = () => {
    return fuels.map(fuel => `<option value="${fuel.value}">${fuel.text}</option>`).join('');
};

document.getElementById('fuel').innerHTML += generateFuelOptions();

// Transmisión
const transmissions = [
    { value: 'all', text: 'Todos' },
    { value: 'manual', text: 'Manual' },
    { value: 'automatico', text: 'Automático' }
];

const generateTransmissionOptions = () => {
    return transmissions.map(transmission => `<option value="${transmission.value}">${transmission.text}</option>`).join('');
};

document.getElementById('transmission').innerHTML += generateTransmissionOptions();