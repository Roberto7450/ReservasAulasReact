package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import es.iesjuanbosco.roberto.ReservasAulas.enums.DiaSemana;
import lombok.Data;

import java.time.LocalTime;

@Data
public class HorarioDTO {
    private Long id;
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}