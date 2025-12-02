package com.biu.weather_app.dto;

import com.biu.weather_app.model.WeatherData;
import java.util.List;
import java.util.Map;

public class WeatherStatsResponse {

    private List<WeatherData> readings;
    private Map<String, Map<String, Double>> stats;

    public WeatherStatsResponse(List<WeatherData> readings, Map<String, Map<String, Double>> stats) {
        this.readings = readings;
        this.stats = stats;
    }

    // Getters y Setters
    public List<WeatherData> getReadings() { return readings; }
    public void setReadings(List<WeatherData> readings) { this.readings = readings; }
    public Map<String, Map<String, Double>> getStats() { return stats; }
    public void setStats(Map<String, Map<String, Double>> stats) { this.stats = stats; }
}