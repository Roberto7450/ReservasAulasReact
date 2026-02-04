package es.iesjuanbosco.roberto.ReservasAulas.mapper;

import es.iesjuanbosco.roberto.ReservasAulas.dtos.ReservaDTO;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;

public class ReservaMapper {
    public static ReservaDTO toDto(Reserva reserva) {
        if (reserva == null) return null;

        ReservaDTO dto = new ReservaDTO();
        dto.setId(reserva.getId());
        dto.setFecha(reserva.getFecha());
        dto.setMotivo(reserva.getMotivo());
        dto.setAsistentes(reserva.getAsistentes());
        dto.setFechaCreacion(reserva.getFechaCreacion());

        // Información del aula
        if (reserva.getAula() != null) {
            dto.setAulaId(reserva.getAula().getId());
            dto.setAulaNombre(reserva.getAula().getNombre());
        }

        // Información del horario
        if (reserva.getHorario() != null) {
            dto.setHorarioId(reserva.getHorario().getId());
            dto.setHorarioDiaSemana(reserva.getHorario().getDiaSemana().toString());
            dto.setHorarioHoraInicio(reserva.getHorario().getHoraInicio().toString());
            dto.setHorarioHoraFin(reserva.getHorario().getHoraFin().toString());
        }

        // Información del usuario
        if (reserva.getUsuario() != null) {
            dto.setUsuarioId(reserva.getUsuario().getId());
            dto.setUsuarioEmail(reserva.getUsuario().getEmail());
        }

        return dto;
    }
}
