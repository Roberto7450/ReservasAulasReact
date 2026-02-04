package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservaDTO {
    private Long id;
    private LocalDate fecha;
    private String motivo;
    private Integer asistentes;
    private LocalDate fechaCreacion;

    // Información del aula
    private Long aulaId;
    private String aulaNombre;

    // Información del horario
    private Long horarioId;
    private String horarioDiaSemana;
    private String horarioHoraInicio;
    private String horarioHoraFin;

    // Información del usuario
    private Long usuarioId;
    private String usuarioEmail;
}