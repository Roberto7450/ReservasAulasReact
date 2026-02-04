package es.iesjuanbosco.roberto.ReservasAulas.services;

import es.iesjuanbosco.roberto.ReservasAulas.beans.CopiarClase;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Aula;
import es.iesjuanbosco.roberto.ReservasAulas.entities.Reserva;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioAula;
import es.iesjuanbosco.roberto.ReservasAulas.repositories.RepositorioReserva;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ServiceAula {

    private final RepositorioAula repository;
    private final CopiarClase copiarClase = new CopiarClase();
    private final RepositorioReserva repositoryReserva;

    public List<Aula> obtenerTodas() {
        return repository.findAll();
    }

    public Aula guardar(Aula aula) {
        return repository.save(aula);
    }

    @SneakyThrows
    public Aula actualizar(Aula aulaModificada, Long id) {
        Optional<Aula> aula = obtenerPorId(id);

        if(aula.isPresent()){
            copiarClase.copyProperties(aula.get(), aulaModificada);
            return repository.save(aula.get());
        }

        return aulaModificada;
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Aula> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public List<Aula> obtenerPorCapacidad(Integer capacidad) {
        return repository.findByCapacidadGreaterThanEqual(capacidad);
    }

    public List<Aula> obtenerAulasConOrdenador(boolean esOrdenador) {
        return repository.findByEsOrdenadores(esOrdenador);
    }

    public List<Reserva> obtenerReservasAula(Long id) {
        return repositoryReserva.getReservaByAula_Id(id);
    }
}
