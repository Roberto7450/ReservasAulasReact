package es.iesjuanbosco.roberto.ReservasAulas.services;

import es.iesjuanbosco.roberto.ReservasAulas.entities.Horario;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioHorario;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ServiceHorario {

    private final RepositorioHorario repository;

    public List<Horario> obtenerTodas() {
        return repository.findAll();
    }

    public Horario guardar(Horario horario) {
        return repository.save(horario);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Horario obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    // ahora mismo el horario se crea al hacer una reserva pero lo que hay que hacer es crear los horarios de forma independiente y cuando creas una reserva, elegir uno de estos horarios
}
