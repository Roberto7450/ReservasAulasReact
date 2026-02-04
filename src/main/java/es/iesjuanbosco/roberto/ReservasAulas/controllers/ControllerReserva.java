package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.ReservaDTO;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.ReservaRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import es.iesjuanbosco.roberto.ReservasAulas.mapper.ReservaMapper;
import es.iesjuanbosco.roberto.ReservasAulas.services.ServiceReserva;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerReserva {

    private final ServiceReserva serviceReserva;

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> getReservas() {
        List<Reserva> reservas = serviceReserva.obtenerTodas();
        List<ReservaDTO> reservasDto = reservas.stream()
                .map(ReservaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservasDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservaById(@PathVariable Long id) {
        Optional<Reserva> reservaOpt = serviceReserva.obtenerPorId(id);

        if (reservaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Reserva no encontrada con id: " + id));
        }

        return ResponseEntity.ok(ReservaMapper.toDto(reservaOpt.get()));
    }

    @PostMapping
    public ResponseEntity<?> createReserva(
            @RequestBody @Valid ReservaRequest request,
            Authentication authentication) {
        try {
            // Obtener el email del usuario autenticado
            String emailUsuario = authentication.getName();

            Reserva creada = serviceReserva.guardarConUsuario(request, emailUsuario);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ReservaMapper.toDto(creada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error de validación: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la reserva: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReserva(
            @RequestBody Reserva reserva,
            @PathVariable Long id,
            Authentication authentication) {
        try {
            // Verificar que la reserva existe
            Reserva reservaExistente = serviceReserva.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            // Obtener email y roles del usuario autenticado
            String emailUsuario = authentication.getName();
            boolean esAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            // Verificar propiedad: solo el creador o un ADMIN pueden editar
            if (!esAdmin && !reservaExistente.getUsuario().getEmail().equals(emailUsuario)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Solo puedes editar tus propias reservas");
            }

            reserva.setId(id);
            Reserva actualizada = serviceReserva.actualizar(reserva, id);
            return ResponseEntity.ok(ReservaMapper.toDto(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error de validación: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la reserva: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReserva(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            // Verificar que la reserva existe
            Reserva reserva = serviceReserva.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            // Obtener email y roles del usuario autenticado
            String emailUsuario = authentication.getName();
            boolean esAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            // Verificar propiedad: solo el creador o un ADMIN pueden eliminar
            if (!esAdmin && !reserva.getUsuario().getEmail().equals(emailUsuario)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Solo puedes eliminar tus propias reservas");
            }

            serviceReserva.eliminar(id);
            return ResponseEntity.ok().body("Reserva eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la reserva: " + e.getMessage());
        }
    }
}