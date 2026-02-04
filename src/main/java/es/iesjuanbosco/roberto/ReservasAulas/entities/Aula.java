package es.iesjuanbosco.roberto.ReservasAulas.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "aulas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private Integer capacidad;
    private Boolean esOrdenadores;

    @OneToMany(mappedBy = "aula", cascade = {CascadeType.ALL, CascadeType.REMOVE}, orphanRemoval = true)
    @JsonIgnore
    private List<Reserva> reservas;
}
