package es.iesjuanbosco.roberto.ReservasAulas.repositories;

import es.iesjuanbosco.roberto.ReservasAulas.entities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioHorario extends JpaRepository<Horario, Long> {
}
