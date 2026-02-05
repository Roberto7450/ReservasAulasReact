package es.iesjuanbosco.roberto.ReservasAulas.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Crear módulo de Java Time
        JavaTimeModule module = new JavaTimeModule();
        
        // Formatos personalizados
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        
        // Deserializadores (entrada - cuando recibe JSON)
        module.addDeserializer(LocalDate.class, 
            new LocalDateDeserializer(dateFormatter));
        module.addDeserializer(LocalTime.class, 
            new LocalTimeDeserializer(timeFormatter));
        
        // Serializadores (salida - cuando envía JSON)
        module.addSerializer(LocalDate.class, 
            new LocalDateSerializer(dateFormatter));
        module.addSerializer(LocalTime.class, 
            new LocalTimeSerializer(timeFormatter));
        
        mapper.registerModule(module);
        
        return mapper;
    }
}
