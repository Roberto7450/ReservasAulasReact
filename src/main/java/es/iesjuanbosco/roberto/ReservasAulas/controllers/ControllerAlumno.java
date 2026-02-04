package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumnos")
public class ControllerAlumno {

    // Solo administradores pueden eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        // Lógica de eliminación
        return ResponseEntity.ok("Alumno eliminado");
    }

    // Cualquier usuario autenticado puede listar
    @GetMapping
    public ResponseEntity<?> listar() {
        // Lógica de listado
        return ResponseEntity.ok("Lista de alumnos");
    }

    // Solo profesores o admins pueden actualizar notas
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @PutMapping("/{id}/notas")
    public ResponseEntity<?> actualizarNotas(@PathVariable Long id) {
        // Lógica de actualización
        return ResponseEntity.ok("Notas actualizadas");
    }
}
