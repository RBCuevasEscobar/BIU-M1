package com.biu.weather_app.service;

import com.biu.weather_app.dto.WeatherStatsResponse;
import com.biu.weather_app.model.WeatherData;
import com.biu.weather_app.repository.WeatherDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.DoubleSummaryStatistics;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    public WeatherData saveReading(WeatherData weatherData) {
        return weatherDataRepository.save(weatherData);
    }

    public WeatherStatsResponse getLatestReadingsAndStats(int n) {
        
        // 1. Extraer el valor actual (el último registro)
        // .orElse(null) devolverá null si la base de datos está vacía.
        WeatherData currentReading = weatherDataRepository.findFirstByOrderByIdDesc().orElse(null);
        
        // 3. Extraer los últimos n registros
        List<WeatherData> lastNReadings = weatherDataRepository.findByOrderByIdDesc(PageRequest.of(0, n));

        // 4. Calcular valores máximos, mínimos y promedio
        Map<String, Map<String, Double>> stats = calculateStats(lastNReadings);

        return new WeatherStatsResponse(currentReading, lastNReadings, stats);
    }

    private Map<String, Map<String, Double>> calculateStats(List<WeatherData> readings) {
        Map<String, Map<String, Double>> allStats = new HashMap<>();

        if (readings == null || readings.isEmpty()) {
            return allStats;
        }

        // Estadísticas de Temperatura
        DoubleSummaryStatistics tempStats = readings.stream()
                .mapToDouble(WeatherData::getTemperature)
                .summaryStatistics();
        allStats.put("temperature", Map.of(
                "min", tempStats.getMin(),
                "max", tempStats.getMax(),
                "avg", tempStats.getAverage()
        ));

        // Estadísticas de Humedad
        DoubleSummaryStatistics humidityStats = readings.stream()
                .mapToDouble(WeatherData::getHumidity)
                .summaryStatistics();
        allStats.put("humidity", Map.of(
                "min", humidityStats.getMin(),
                "max", humidityStats.getMax(),
                "avg", humidityStats.getAverage()
        ));

        // Estadísticas de Presión
        DoubleSummaryStatistics pressureStats = readings.stream()
                .mapToDouble(WeatherData::getPressure)
                .summaryStatistics();
        allStats.put("pressure", Map.of(
                "min", pressureStats.getMin(),
                "max", pressureStats.getMax(),
                "avg", pressureStats.getAverage()
        ));

        return allStats;
    }
}