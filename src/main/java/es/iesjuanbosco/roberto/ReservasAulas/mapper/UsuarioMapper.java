package es.iesjuanbosco.roberto.ReservasAulas.mapper;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.UsuarioDTO;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Usuario;

public class UsuarioMapper {
    public static UsuarioDTO toDto(Usuario usuario) {
        if (usuario == null) return null;

        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setRoles(usuario.getRoles());
        dto.setEnabled(usuario.isEnabled());
        return dto;
    }
}
