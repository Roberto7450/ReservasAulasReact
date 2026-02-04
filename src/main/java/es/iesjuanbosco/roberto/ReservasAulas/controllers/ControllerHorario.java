package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.HorarioDTO;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.HorarioRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Horario;
import es.iesjuanbosco.roberto.ReservasAulas.mapper.HorarioMapper;
import es.iesjuanbosco.roberto.ReservasAulas.services.ServiceHorario;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/horarios")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerHorario {

    private final ServiceHorario serviceHorario;

    @GetMapping
    public ResponseEntity<List<HorarioDTO>> getHorarios() {
        List<Horario> horarios = serviceHorario.obtenerTodas();
        List<HorarioDTO> horariosDto = horarios.stream()
                .map(HorarioMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(horariosDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHorarioById(@PathVariable Long id) {
        Horario horario = serviceHorario.obtenerPorId(id);
        if (horario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Horario no encontrado con id: " + id);
        }
        return ResponseEntity.ok(HorarioMapper.toDto(horario));
    }

    @PostMapping
    public ResponseEntity<?> createHorario(@Valid @RequestBody HorarioRequest request) {
        try {
            Horario horario = HorarioMapper.toEntity(request);
            Horario horarioGuardado = serviceHorario.guardar(horario);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(HorarioMapper.toDto(horarioGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el horario: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHorario(
            @PathVariable Long id,
            @Valid @RequestBody HorarioRequest request) {
        try {
            Horario horario = serviceHorario.obtenerPorId(id);
            if (horario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Horario no encontrado con id: " + id);
            }

            HorarioMapper.updateEntityFromRequest(horario, request);
            Horario horarioActualizado = serviceHorario.guardar(horario);
            return ResponseEntity.ok(HorarioMapper.toDto(horarioActualizado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el horario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHorario(@PathVariable Long id) {
        try {
            Horario horario = serviceHorario.obtenerPorId(id);
            if (horario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Horario no encontrado con id: " + id);
            }
            serviceHorario.eliminar(id);
            return ResponseEntity.ok().body("Horario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el horario: " + e.getMessage());
        }
    }
}