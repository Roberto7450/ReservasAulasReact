package es.iesjuanbosco.roberto.ReservasAulas.repositories;

import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RepositorioReserva extends JpaRepository<Reserva, Long> {
    List<Reserva> getReservaByAula_Id(Long id);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
           "FROM Reserva r " +
           "WHERE r.aula.id = :aulaId " +
           "AND r.horario.id = :horarioId " +
           "AND r.fecha = :fecha")
    boolean existsSolapamiento(Long aulaId, Long horarioId, LocalDate fecha);
}
