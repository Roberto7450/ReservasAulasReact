package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CambiarPasswordRequest {
    @NotBlank
    private String passwordActual;

    @NotBlank
    @Size(min = 6)
    private String nuevaPassword;
}
