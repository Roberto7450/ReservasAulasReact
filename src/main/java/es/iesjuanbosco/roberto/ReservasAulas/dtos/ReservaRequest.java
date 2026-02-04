package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservaRequest {
    @NotNull(message = "El ID del horario no puede ser nulo")
    @Positive(message = "El ID del horario debe ser mayor que 0")
    private Long horarioId; // reserva -> horario

    @NotNull(message = "El ID del aula no puede ser nulo")
    @Positive(message = "El ID del aula debe ser mayor que 0")
    private Long aulaId; // reserva -> aula

    @NotBlank(message = "El motivo no puede estar vacío")
    @Size(min = 3, max = 200, message = "El motivo debe tener entre 3 y 200 caracteres")
    private String motivo;

    @NotNull(message = "El número de asistentes no puede ser nulo")
    @Positive(message = "El número de asistentes debe ser un valor positivo")
    private Integer asistentes;

    @NotNull(message = "La fecha es obligatoria")
    @FutureOrPresent(message = "No se pueden hacer reservas en el pasado")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate fecha;
}
