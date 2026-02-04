package es.iesjuanbosco.roberto.ReservasAulas.repositories;

import es.iesjuanbosco.roberto.ReservasAulas.entities.Aula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositorioAula extends JpaRepository<Aula, Long> {
    List<Aula> findByCapacidad(Integer capacidad);

    List<Aula> findByCapacidadGreaterThanEqual(Integer capacidadIsGreaterThan);

    List<Aula> findByEsOrdenadores(Boolean esOrdenadores);
}
