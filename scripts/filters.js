// Filtros
const generateOptions = (array, name) => {
    return array.map(item => `<option value="${item.toLowerCase().replace(/\s+/g, '_')}">${item}</option>`).join('');
};

// Botón de búsqueda
document.getElementById('search-btn').addEventListener('click', function() {
    // Lógica de la búsqueda filtrada
});

// Botón de resetear filtros
document.getElementById('reset-filters-btn').addEventListener('click', function() {
    const icon = document.querySelector('.reset-icon');
    icon.classList.add('rotate');

    resetFilters();

    setTimeout(() => {
        icon.classList.remove('rotate');
    }, 600);
});

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