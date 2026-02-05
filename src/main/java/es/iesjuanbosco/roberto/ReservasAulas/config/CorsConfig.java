package es.iesjuanbosco.roberto.ReservasAulas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Permitir todos los orígenes
                .allowedOrigins("*")
                // Permitir todos los métodos HTTP
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                // Permitir todos los headers
                .allowedHeaders("*")
                // Permitir el header Authorization
                .exposedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With", "Cache-Control")
                // Tiempo máximo de cache (1 hora)
                .maxAge(3600);
    }
}
