document.addEventListener('DOMContentLoaded', () => {
    // --- SELECCIÓN DE NUEVOS ELEMENTOS ---
    const currentTempCard = document.getElementById('current-temp-card');
    const currentTempValue = document.getElementById('current-temp-value');
    const currentTempTime = document.getElementById('current-temp-time');

    const currentHumCard = document.getElementById('current-hum-card');
    const currentHumValue = document.getElementById('current-hum-value');
    const currentHumTime = document.getElementById('current-hum-time');

    const currentPresCard = document.getElementById('current-pres-card');
    const currentPresValue = document.getElementById('current-pres-value');
    const currentPresTime = document.getElementById('current-pres-time');

    const recordCountInput = document.getElementById('record-count');
    const fetchButton = document.getElementById('fetch-button');
    const loadingIndicator = document.getElementById('loading');

    const tempMin = document.getElementById('temp-min');
    const tempMax = document.getElementById('temp-max');
    const tempAvg = document.getElementById('temp-avg');
    const humMin = document.getElementById('hum-min');
    const humMax = document.getElementById('hum-max');
    const humAvg = document.getElementById('hum-avg');
    const presMin = document.getElementById('pres-min');
    const presMax = document.getElementById('pres-max');
    const presAvg = document.getElementById('pres-avg');

    const tableBody = document.getElementById('data-table-body');

    // La URL de la API. Como el frontend se sirve desde el mismo backend,
    // podemos usar una ruta relativa.
    const API_URL = '/api/weather/readings';

    async function fetchData(n) {
        loadingIndicator.classList.remove('hidden');
        tableBody.innerHTML = '';
        resetStats();

        try {
            const response = await fetch(`${API_URL}?n=${n}`);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.statusText}`);
            }
            const data = await response.json();
            // --- LÓGICA MODIFICADA ---
            updateCurrentValues(data.currentReading); // Actualizar los gauges actuales

            updateStats(data.stats);
            populateTable(data.readings);
        } catch (error) {
            console.error('No se pudo obtener los datos:', error);
            alert('Error al cargar los datos. Verifique la consola para más detalles.');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    // --- FUNCIÓN NUEVA: Actualizar los valores actuales ---
    function updateCurrentValues(reading) {
        if (!reading) {
            // Si no hay lectura actual (BD vacía), no hacemos nada o mostramos un mensaje
            currentTempValue.textContent = '- °C';
            currentHumValue.textContent = '- %';
            currentPresValue.textContent = '- hPa';
            return;
        }

        // Temperatura
        const temp = reading.temperature;
        currentTempValue.textContent = `${temp.toFixed(2)} °C`;
        // Quitar clases previas y añadir la nueva según el valor
        currentTempCard.className = 'live-data-card'; // Resetea
        if (temp < 10) currentTempCard.classList.add('temp-cold');
        else if (temp >= 10 && temp < 20) currentTempCard.classList.add('temp-mild');
        else if (temp >= 20 && temp < 30) currentTempCard.classList.add('temp-warm');
        else currentTempCard.classList.add('temp-hot');

        // Humedad
        const hum = reading.humidity;
        currentHumValue.textContent = `${hum.toFixed(2)} %`;
        currentHumCard.className = 'live-data-card'; // Resetea
        if (hum < 30) currentHumCard.classList.add('hum-dry');
        else if (hum >= 30 && hum <= 60) currentHumCard.classList.add('hum-normal');
        else currentHumCard.classList.add('hum-wet');

        // Presión (para la presión, los colores son más ilustrativos que estándar)
        const pres = reading.pressure;
        currentPresValue.textContent = `${pres.toFixed(2)} hPa`;
        // Para la presión no añadimos colores ya que su rango es menos intuitivo para el color
        
        // Actualizar la hora de la lectura
        const readingTime = new Date(reading.timestamp).toLocaleTimeString();
        currentTempTime.textContent = `a las ${readingTime}`;
        currentHumTime.textContent = `a las ${readingTime}`;
        currentPresTime.textContent = `a las ${readingTime}`;
    }

    // --- FUNCIÓN NUEVA: Resetear los valores actuales ---
    function resetCurrentValues() {
        currentTempValue.textContent = '- °C';
        currentHumValue.textContent = '- %';
        currentPresValue.textContent = '- hPa';
        currentTempTime.textContent = '';
        currentHumTime.textContent = '';
        currentPresTime.textContent = '';
        currentTempCard.className = 'live-data-card';
        currentHumCard.className = 'live-data-card';
        currentPresCard.className = 'live-data-card';
    }

    function updateStats(stats) {
        if (!stats) return;

        updateStatCard('temperature', tempMin, tempMax, tempAvg, stats);
        updateStatCard('humidity', humMin, humMax, humAvg, stats);
        updateStatCard('pressure', presMin, presMax, presAvg, stats);
    }

    function updateStatCard(key, minEl, maxEl, avgEl, stats) {
        const statData = stats[key];
        if (statData) {
            minEl.textContent = statData.min.toFixed(2);
            maxEl.textContent = statData.max.toFixed(2);
            avgEl.textContent = statData.avg.toFixed(2);
        }
    }


    function populateTable(readings) {
        if (!readings || readings.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.textContent = 'No hay datos disponibles.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        readings.forEach((reading, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(reading.timestamp).toLocaleString()}</td>
                <td>${reading.location}</td>
                <td>${reading.sensorId}</td>
                <td>${reading.temperature.toFixed(2)}</td>
                <td>${reading.humidity.toFixed(2)}</td>
                <td>${reading.pressure.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function resetStats() {
        const allSpans = document.querySelectorAll('.stat-card span');
        allSpans.forEach(span => span.textContent = '-');
    }

    fetchButton.addEventListener('click', () => {
        const n = recordCountInput.value;
        fetchData(n);
    });

    // Carga inicial de datos al cargar la página
    fetchData(recordCountInput.value);
});