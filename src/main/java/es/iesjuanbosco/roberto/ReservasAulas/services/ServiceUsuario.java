package es.iesjuanbosco.roberto.ReservasAulas.services;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.RegisterRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioUsuario;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceUsuario {
    private final RepositorioUsuario repo;
    private final PasswordEncoder passwordEncoder;

    public Usuario registrar(RegisterRequest req) {
        if (repo.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        Usuario u = new Usuario();
        u.setEmail(req.email());
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setRoles("ROLE_PROFESOR"); // rol por defecto
        u.setEnabled(true);

        return repo.save(u);
    }

    public Optional<Usuario> findById(Long id) {
        return repo.findById(id);
    }

    public Optional<Usuario> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Usuario updateUsuario(Long id, Usuario cambios) {
        Usuario u = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (cambios.getEmail() != null) u.setEmail(cambios.getEmail());
        if (cambios.getRoles() != null) u.setRoles(cambios.getRoles());
        u.setEnabled(cambios.isEnabled());
        return repo.save(u);
    }

    public void deleteUsuario(Long id) {
        repo.deleteById(id);
    }

    public boolean comprobarPasswordPorEmail(String email, String passwordPlain) {
        Usuario u = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return passwordEncoder.matches(passwordPlain, u.getPassword());
    }

    public Usuario cambiarPasswordPorEmail(String email, String nuevaPwd) {
        Usuario u = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setPassword(passwordEncoder.encode(nuevaPwd));
        return repo.save(u);
    }
}
