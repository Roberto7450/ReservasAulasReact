package es.iesjuanbosco.roberto.ReservasAulas.entities;


import es.iesjuanbosco.roberto.ReservasAulas.enums.DiaSemana;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "horarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;

    private LocalTime horaInicio;
    private LocalTime horaFin;

    public boolean seSolapaCon(Horario otro) {
        // Comprobar si es el mismo dia de la semana y el horario se solapa
        if (this.diaSemana != otro.diaSemana) {
            return false;
        }

        return this.horaInicio.isBefore(otro.horaFin) && otro.horaInicio.isBefore(this.horaFin);
    }
}
