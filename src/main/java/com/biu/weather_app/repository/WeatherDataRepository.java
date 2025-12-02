package com.biu.weather_app.repository;

import com.biu.weather_app.model.WeatherData;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    // Spring Data JPA crea automáticamente la implementación de este método.
    // Busca los registros ordenados por ID en orden descendente y toma los 'n' primeros.
    List<WeatherData> findByOrderByIdDesc(Pageable pageable);
}
