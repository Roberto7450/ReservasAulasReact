package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String email;
    private String roles;
    private boolean enabled;
}
