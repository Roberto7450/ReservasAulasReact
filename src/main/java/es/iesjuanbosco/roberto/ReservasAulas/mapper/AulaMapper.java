package es.iesjuanbosco.roberto.ReservasAulas.mapper;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.AulaDTO;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.AulaRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Aula;

public class AulaMapper {
    public static AulaDTO toDto(Aula aula) {
        if (aula == null) return null;

        AulaDTO dto = new AulaDTO();
        dto.setId(aula.getId());
        dto.setNombre(aula.getNombre());
        dto.setCapacidad(aula.getCapacidad());
        dto.setEsOrdenadores(aula.getEsOrdenadores());
        return dto;
    }

    public static Aula toEntity(AulaRequest request) {
        if (request == null) return null;

        Aula aula = new Aula();
        aula.setNombre(request.getNombre());
        aula.setCapacidad(request.getCapacidad());
        aula.setEsOrdenadores(request.getEsOrdenadores());
        return aula;
    }

    public static void updateEntityFromRequest(Aula aula, AulaRequest request) {
        if (aula == null || request == null) return;

        if (request.getNombre() != null) {
            aula.setNombre(request.getNombre());
        }
        if (request.getCapacidad() != null) {
            aula.setCapacidad(request.getCapacidad());
        }
        if (request.getEsOrdenadores() != null) {
            aula.setEsOrdenadores(request.getEsOrdenadores());
        }
    }
}
