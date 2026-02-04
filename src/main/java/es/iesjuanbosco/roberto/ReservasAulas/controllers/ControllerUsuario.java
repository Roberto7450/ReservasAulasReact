package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.CambiarPasswordRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.RegisterRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.UsuarioDTO;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import es.iesjuanbosco.roberto.ReservasAulas.mapper.UsuarioMapper;
import es.iesjuanbosco.roberto.ReservasAulas.services.ServiceUsuario;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ControllerUsuario {
    private final ServiceUsuario service;
    private final UsuarioMapper mapper = new UsuarioMapper();

    // Actualizar usuario (ADMIN o propio usuario). Aquí falta controlar autorización.
    @PutMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable Long id, @RequestBody Usuario cambios) {
        Usuario actualizado = service.updateUsuario(id, cambios);
        return ResponseEntity.ok(mapper.toDto(actualizado));
    }

    // Borrar usuario
    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        service.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
