document.addEventListener('DOMContentLoaded', () => {
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
            updateStats(data.stats);
            populateTable(data.readings);
        } catch (error) {
            console.error('No se pudo obtener los datos:', error);
            alert('Error al cargar los datos. Verifique la consola para más detalles.');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
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
            cell.colSpan = 6;
            cell.textContent = 'No hay datos disponibles.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        readings.forEach(reading => {
            const row = document.createElement('tr');
            row.innerHTML = `
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