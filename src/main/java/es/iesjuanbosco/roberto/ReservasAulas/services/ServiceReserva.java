package es.iesjuanbosco.roberto.ReservasAulas.services;

import es.iesjuanbosco.roberto.ReservasAulas.beans.CopiarClase;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.ReservaRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Aula;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Horario;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioAula;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioHorario;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioReserva;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioUsuario;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ServiceReserva {

    private final RepositorioReserva repository;
    private final RepositorioAula repositorioAula;
    private final RepositorioHorario repositorioHorario;
    private final RepositorioUsuario repositorioUsuario;

    private final CopiarClase copiarClase = new CopiarClase();

    private void validarReserva(Reserva reserva) {
        // Validación 2: No permitir reservas en el pasado
        if (reserva.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("No se pueden hacer reservas en el pasado.");
        }

        // Validación 3: Número de asistentes no puede superar la capacidad del aula
        if (reserva.getAsistentes() > reserva.getAula().getCapacidad()) {
            throw new IllegalArgumentException("El número de asistentes supera la capacidad del aula.");
        }

        // Validación 1: No permitir reservas solapadas en el mismo aula y horario
        List<Reserva> reservasAula = repository.getReservaByAula_Id(reserva.getAula().getId());

        for (Reserva rExistente : reservasAula) {
            // ignorar misma reserva (en caso de actualización)
            if (reserva.getId() != null && reserva.getId().equals(rExistente.getId())) continue;

            if (rExistente.getFecha().isEqual(reserva.getFecha())) {
                Horario hExistente = rExistente.getHorario();
                Horario hNuevo = reserva.getHorario();

                if (hExistente != null && hNuevo != null) {
                    if (hNuevo.seSolapaCon(hExistente)) {
                        throw new IllegalArgumentException("La reserva se solapa con otra reserva existente en el mismo aula y horario.");
                    }
                }
            }
        }
    }

    @SneakyThrows
    public Reserva actualizar(Reserva reservaModificada, Long id) {
        Optional<Reserva> reservaOptional = obtenerPorId(id);

        if (reservaOptional.isPresent()) {
            copiarClase.copyProperties(reservaOptional.get(), reservaModificada);
            validarReserva(reservaOptional.get());
            return repository.save(reservaOptional.get());
        }

        return reservaModificada;
    }

    public List<Reserva> obtenerTodas() {
        return repository.findAll();
    }

    public Reserva guardar(ReservaRequest request) {
        Reserva reserva = new Reserva();

        Aula aula = repositorioAula.findById(request.getAulaId())
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada con id: " + request.getAulaId()));

        Horario horario = repositorioHorario.findById(request.getHorarioId())
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + request.getHorarioId()));

        reserva.setAula(aula);
        reserva.setHorario(horario);
        reserva.setFecha(request.getFecha());
        reserva.setMotivo(request.getMotivo());
        reserva.setAsistentes(request.getAsistentes());

        // validar
        if (reserva.getAsistentes() > aula.getCapacidad()) {
            throw new IllegalArgumentException("El número de asistentes supera la capacidad del aula.");
        }

        if (repository.existsSolapamiento(request.getAulaId(), request.getHorarioId(), request.getFecha())) {
            throw new IllegalArgumentException("La reserva se solapa con otra reserva existente en el mismo aula y horario.");
        }

        return repository.save(reserva);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Reserva> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Reserva guardarConUsuario(ReservaRequest request, String emailUsuario) {
        Reserva reserva = new Reserva();

        Aula aula = repositorioAula.findById(request.getAulaId())
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada con id: " + request.getAulaId()));

        Horario horario = repositorioHorario.findById(request.getHorarioId())
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + request.getHorarioId()));

        // Buscar usuario por email (el autenticado)
        Usuario usuario = repositorioUsuario.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con email: " + emailUsuario));

        reserva.setAula(aula);
        reserva.setHorario(horario);
        reserva.setUsuario(usuario);
        reserva.setFecha(request.getFecha());
        reserva.setMotivo(request.getMotivo());
        reserva.setAsistentes(request.getAsistentes());

        // Validaciones
        if (reserva.getAsistentes() > aula.getCapacidad()) {
            throw new IllegalArgumentException("El número de asistentes supera la capacidad del aula.");
        }

        if (repository.existsSolapamiento(request.getAulaId(), request.getHorarioId(), request.getFecha())) {
            throw new IllegalArgumentException("La reserva se solapa con otra reserva existente en el mismo aula y horario.");
        }

        return repository.save(reserva);
    }
}
