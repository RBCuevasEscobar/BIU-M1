package com.biu.weather_app.repository;

import com.biu.weather_app.model.WeatherData;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    // Este método busca los registros ordenados por ID en orden descendente y toma los 'n' primeros.

    List<WeatherData> findByOrderByIdDesc(Pageable pageable);

    // Este método buscará el primer registro ordenando por ID de forma descendente,
    // es decir, el último registro insertado.
    // Usamos Optional<WeatherData> para manejar de forma segura el caso en que la tabla esté vacía.

    Optional<WeatherData> findFirstByOrderByIdDesc();

}
