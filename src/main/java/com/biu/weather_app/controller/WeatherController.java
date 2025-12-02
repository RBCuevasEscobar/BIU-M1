package com.biu.weather_app.controller;

import com.biu.weather_app.dto.WeatherStatsResponse;
import com.biu.weather_app.model.WeatherData;
import com.biu.weather_app.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
// @CrossOrigin permite peticiones desde el frontend (si se aloja en otro dominio/puerto)
// Como lo serviremos desde el mismo backend, no es estrictamente necesario, pero es buena práctica.
@CrossOrigin(origins = "*") 
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    // 1. Endpoint para recibir datos del clima
    @PostMapping("/readings")
    public ResponseEntity<WeatherData> createReading(@RequestBody WeatherData weatherData) {
        WeatherData savedData = weatherService.saveReading(weatherData);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    // 5. Endpoint para el portal de consulta
    @GetMapping("/readings")
    public ResponseEntity<WeatherStatsResponse> getReadings(
            @RequestParam(defaultValue = "20") int n) {
        WeatherStatsResponse response = weatherService.getLatestReadingsAndStats(n);
        return ResponseEntity.ok(response);
    }
}