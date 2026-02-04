package es.iesjuanbosco.roberto.ReservasAulas.mapper;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.HorarioDTO;
import es.iesjuanbosco.roberto.ReservasAulas.dtos.HorarioRequest;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Horario;

public class HorarioMapper {
    public static HorarioDTO toDto(Horario horario) {
        if (horario == null) return null;

        HorarioDTO dto = new HorarioDTO();
        dto.setId(horario.getId());
        dto.setDiaSemana(horario.getDiaSemana());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        return dto;
    }

    public static Horario toEntity(HorarioRequest request) {
        if (request == null) return null;

        Horario horario = new Horario();
        horario.setDiaSemana(request.getDiaSemana());
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());
        return horario;
    }

    public static void updateEntityFromRequest(Horario horario, HorarioRequest request) {
        if (horario == null || request == null) return;

        if (request.getDiaSemana() != null) {
            horario.setDiaSemana(request.getDiaSemana());
        }
        if (request.getHoraInicio() != null) {
            horario.setHoraInicio(request.getHoraInicio());
        }
        if (request.getHoraFin() != null) {
            horario.setHoraFin(request.getHoraFin());
        }
    }
}