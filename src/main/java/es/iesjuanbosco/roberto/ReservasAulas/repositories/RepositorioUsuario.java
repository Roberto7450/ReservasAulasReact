package es.iesjuanbosco.roberto.ReservasAulas.repositories;

import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositorioUsuario extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
