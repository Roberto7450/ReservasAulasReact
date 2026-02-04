package es.iesjuanbosco.roberto.ReservasAulas.controllers;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.CambiarPasswordRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.LoginRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.RegisterRequest;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.UsuarioDTO;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioUsuario;
import es.iesjuanbosco.roberto.ReservasAulas.services.JwtService;
import es.iesjuanbosco.roberto.ReservasAulas.services.ServiceUsuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ControllerAuth {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RepositorioUsuario usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServiceUsuario serviceUsuario;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar al usuario con email y password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );

            // Si las credenciales son correctas, generar token
            String token = jwtService.generateToken(authentication);
            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error en el servidor"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Verificar si el email ya existe
            if (usuarioRepository.findByEmail(registerRequest.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El email ya está registrado"));
            }

            // Crear nuevo usuario
            Usuario usuario = new Usuario();
            usuario.setEmail(registerRequest.email());
            usuario.setPassword(passwordEncoder.encode(registerRequest.password()));  // Cifrar password

            // Asignar rol: si no se proporciona o no es ADMIN, asignar PROFESOR
            if (registerRequest.role() != null && registerRequest.role().equals("ROLE_ADMIN")) {
                usuario.setRoles("ROLE_ADMIN");
            } else {
                usuario.setRoles("ROLE_PROFESOR");
            }

            usuario.setEnabled(true);

            usuarioRepository.save(usuario);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuario registrado correctamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar usuario: " + e.getMessage()));
        }
    }

    // Cambiar contraseña (usuario autenticado)
    @PatchMapping("/cambiar-pass")
    public ResponseEntity<String> cambiarPass(@Valid @RequestBody CambiarPasswordRequest req,
                                              Authentication authentication) {
        String email = authentication.getName();
        if (!serviceUsuario.comprobarPasswordPorEmail(email, req.getPasswordActual())) {
            return ResponseEntity.status(400).body("Contraseña actual incorrecta");
        }
        serviceUsuario.cambiarPasswordPorEmail(email, req.getNuevaPassword());
        return ResponseEntity.ok("Contraseña cambiada correctamente");
    }

    // Obtener el perfil del usuario autenticado
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(Authentication authentication) {
        try {
            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Devolver DTO sin la contraseña
            UsuarioDTO dto = new UsuarioDTO();
            dto.setId(usuario.getId());
            dto.setEmail(usuario.getEmail());
            dto.setRoles(usuario.getRoles());
            dto.setEnabled(usuario.isEnabled());

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener el perfil"));
        }
    }
}
