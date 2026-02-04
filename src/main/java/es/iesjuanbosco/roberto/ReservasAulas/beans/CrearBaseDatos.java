package es.iesjuanbosco.roberto.ReservasAulas.beans;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;

@Slf4j
@Configuration
public class CrearBaseDatos {

    @Bean
    CommandLineRunner initDatabase(DataSource dataSource) {
        return args -> {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

            // 1. Contamos cuántos registros hay en una tabla principal (ejemplo: 'usuarios')
            // Cambia 'usuarios' por el nombre de tu tabla real
            Integer numFilas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM horarios", Integer.class);

            // 2. Si está vacía (0 filas), ejecutamos el script de datos de ejemplo
            if (numFilas != null && numFilas == 0) {
                log.info("La tabla está vacía. Insertando datos de ejemplo...");

                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.addScript(new ClassPathResource("data.sql"));
                populator.execute(dataSource);

                log.info("Datos de ejemplo cargados con éxito.");
            } else {
                log.info("La tabla ya contiene datos. Se omite la carga de ejemplos.");
            }
        };
    }
}