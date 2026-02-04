package es.iesjuanbosco.roberto.ReservasAulas.dtos;

import lombok.Data;

@Data
public class AulaDTO {
    private Long id;
    private String nombre;
    private Integer capacidad;
    private Boolean esOrdenadores;
}