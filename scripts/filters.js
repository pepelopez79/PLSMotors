// Filtros
const generateOptions = (array, name) => {
    return array.map(item => `<option value="${item.toLowerCase().replace(/\s+/g, '_')}">${item}</option>`).join('');
};

// Botón de búsqueda
document.getElementById('search-btn').addEventListener('click', async function() {
    paginaActual = 1;

    // Obtener valores de los filtros
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const province = document.getElementById('province').value;
    const city = document.getElementById('city').value;
    const mileageFrom = document.getElementById('mileage-from').value;
    const mileageTo = document.getElementById('mileage-to').value;
    let yearFrom = document.getElementById('year-from').value;
    let yearTo = document.getElementById('year-to').value;
    const horsepowerFrom = document.getElementById('horsepower-from').value;
    const horsepowerTo = document.getElementById('horsepower-to').value;
    const priceFrom = document.getElementById('price-from').value;
    const priceTo = document.getElementById('price-to').value;
    const fuel = document.getElementById('fuel').options[document.getElementById('fuel').selectedIndex].text;
    const transmission = document.getElementById('transmission').options[document.getElementById('transmission').selectedIndex].text;

    // Verificar y corregir el orden de los años si es necesario
    if (yearFrom && yearTo && parseInt(yearFrom) > parseInt(yearTo)) {
        [yearFrom, yearTo] = [yearTo, yearFrom];
    }

    // Construir los parámetros de la URL solo si los valores no son predeterminados
    let url = `${baseURL}/vehiculos?`;
    const params = new URLSearchParams();

    if (brand && brand !== 'all') params.append('brand', brand);
    if (model) params.append('model', model);
    if (province && province !== 'all') params.append('province', province);
    if (city) params.append('city', city);
    if (mileageFrom && mileageFrom !== '0') params.append('mileage-from', mileageFrom);
    if (mileageTo && mileageTo !== '300000') params.append('mileage-to', mileageTo);
    if (yearFrom && yearFrom !== '1980') params.append('year-from', yearFrom);
    if (yearTo && yearTo !== '2024') params.append('year-to', yearTo);
    if (horsepowerFrom && horsepowerFrom !== '0') params.append('horsepower-from', horsepowerFrom);
    if (horsepowerTo && horsepowerTo !== '500') params.append('horsepower-to', horsepowerTo);
    if (priceFrom && priceFrom !== '0') params.append('price-from', priceFrom);
    if (priceTo && priceTo !== '200000') params.append('price-to', priceTo);
    if (fuel && fuel !== 'Todos') params.append('fuel', fuel);
    if (transmission && transmission !== 'Todos') params.append('transmission', transmission);

    // Agregar los parámetros a la URL
    url += params.toString();
    console.log(url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la red');

        const data = await response.json();
        publicacionesFiltradas = data.data;
    } catch (error) {
        alert('Error al cargar las publicaciones filtradas');
    }

    mostrarPublicaciones(true)

    // Desplazarse a la sección de publicaciones
    document.querySelector('#publicaciones').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Botón de resetear filtros
document.getElementById('reset-filters-btn').addEventListener('click', function() {
    const icon = document.querySelector('.reset-icon');
    icon.classList.add('rotate');

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

    document.getElementById('search-btn').click();

    setTimeout(() => {
        icon.classList.remove('rotate');
    }, 600);
});

document.getElementById('brand').innerHTML += generateOptions(brands);

document.getElementById('province').innerHTML += generateOptions(provinces);

document.getElementById('province').addEventListener('change', updateCities);

document.getElementById('mileage-from').innerHTML += generateMileageOptions();
document.getElementById('mileage-to').innerHTML += generateMileageOptions();

document.getElementById('mileage-from').value = "0";
document.getElementById('mileage-to').value = "300000";

document.getElementById('year-from').innerHTML += generateYearOptions();
document.getElementById('year-to').innerHTML += generateYearOptions();

document.getElementById('year-from').value = "2024";
document.getElementById('year-to').value = "1980";

document.getElementById('horsepower-from').innerHTML += generateHorsepowerOptions();
document.getElementById('horsepower-to').innerHTML += generateHorsepowerOptions();

document.getElementById('horsepower-from').value = "0";
document.getElementById('horsepower-to').value = "500";

document.getElementById('price-from').innerHTML += generatePriceOptions();
document.getElementById('price-to').innerHTML += generatePriceOptions();

document.getElementById('price-from').value = "0";
document.getElementById('price-to').value = "200000";

document.getElementById('fuel').innerHTML += generateFuelOptions();

document.getElementById('transmission').innerHTML += generateTransmissionOptions();