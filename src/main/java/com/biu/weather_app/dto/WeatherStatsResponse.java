package com.biu.weather_app.dto;

import com.biu.weather_app.model.WeatherData;
import java.util.List;
import java.util.Map;

public class WeatherStatsResponse {

    private WeatherData currentReading; // <-- NUEVO CAMPO
    private List<WeatherData> readings;
    private Map<String, Map<String, Double>> stats;

    public WeatherStatsResponse(WeatherData currentReading, List<WeatherData> readings, Map<String, Map<String, Double>> stats) {
        this.currentReading = currentReading;
        this.readings = readings;
        this.stats = stats;
    }

    // Getters y Setters
        // --- NUEVO GETTER Y SETTER ---
        
    public WeatherData getCurrentReading() {
        return currentReading;
    }

    public void setCurrentReading(WeatherData currentReading) {
        this.currentReading = currentReading;
    }

    public List<WeatherData> getReadings() { return readings; }
    public void setReadings(List<WeatherData> readings) { this.readings = readings; }
    public Map<String, Map<String, Double>> getStats() { return stats; }
    public void setStats(Map<String, Map<String, Double>> stats) { this.stats = stats; }
}