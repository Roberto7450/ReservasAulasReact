package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.AulaDTO;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.AulaRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.ReservaDTO;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Aula;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;
import es.iesjuanbosco.roberto.ReservasAulas.mapper.AulaMapper;
import es.iesjuanbosco.roberto.ReservasAulas.mapper.ReservaMapper;
import es.iesjuanbosco.roberto.ReservasAulas.services.ServiceAula;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/aulas")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerAula {

    private final ServiceAula serviceAula;

    @GetMapping
    public ResponseEntity<List<AulaDTO>> getAulas(
            @RequestParam(required = false) Integer capacidad,
            @RequestParam(required = false) Boolean esOrdenadores) {

        List<Aula> aulas;

        if (capacidad != null) {
            aulas = serviceAula.obtenerPorCapacidad(capacidad);
        } else if (esOrdenadores != null) {
            aulas = serviceAula.obtenerAulasConOrdenador(esOrdenadores);
        } else {
            aulas = serviceAula.obtenerTodas();
        }

        List<AulaDTO> aulasDto = aulas.stream()
                .map(AulaMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(aulasDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAulaPorId(@PathVariable Long id) {
        Optional<Aula> aulaOpt = serviceAula.obtenerPorId(id);

        if (aulaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Aula no encontrada con id: " + id));
        }

        return ResponseEntity.ok(AulaMapper.toDto(aulaOpt.get()));
    }

    @PostMapping
    public ResponseEntity<?> createAula(@Valid @RequestBody AulaRequest request) {
        try {
            Aula aula = AulaMapper.toEntity(request);
            Aula aulaGuardada = serviceAula.guardar(aula);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AulaMapper.toDto(aulaGuardada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el aula: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAula(
            @PathVariable Long id,
            @Valid @RequestBody AulaRequest request) {
        try {
            Aula aulaActualizada = serviceAula.actualizar(AulaMapper.toEntity(request), id);
            return ResponseEntity.ok(AulaMapper.toDto(aulaActualizada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el aula: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAula(@PathVariable Long id) {
        try {
            if (serviceAula.obtenerPorId(id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Aula no encontrada con id: " + id);
            }
            serviceAula.eliminar(id);
            return ResponseEntity.ok().body("Aula eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el aula: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/reservas")
    public ResponseEntity<List<ReservaDTO>> getReservasAula(@PathVariable Long id) {
        List<Reserva> reservas = serviceAula.obtenerReservasAula(id);
        List<ReservaDTO> reservasDto = reservas.stream()
                .map(ReservaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservasDto);
    }
}