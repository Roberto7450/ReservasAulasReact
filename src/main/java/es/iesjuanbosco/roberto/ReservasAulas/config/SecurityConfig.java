package es.iesjuanbosco.roberto.ReservasAulas.config;

import es.iesjuanbosco.roberto.ReservasAulas.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Permite usar @PreAuthorize en controladores
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (no necesario en APIs REST con JWT)
                .csrf(AbstractHttpConfigurer::disable)

                // Configurar autorización de peticiones HTTP
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas (sin autenticación)
                        .requestMatchers("/auth/**").permitAll()

                        // AULAS - Solo ADMIN puede crear/editar/eliminar
                        .requestMatchers(HttpMethod.GET, "/aulas/**").hasAnyRole("PROFESOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/aulas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/aulas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/aulas/**").hasRole("ADMIN")

                        // HORARIOS - Solo ADMIN puede crear/editar/eliminar
                        .requestMatchers(HttpMethod.GET, "/horarios/**").hasAnyRole("PROFESOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/horarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/horarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/horarios/**").hasRole("ADMIN")

                        // RESERVAS - Todos pueden ver y crear, pero solo ADMIN puede eliminar cualquiera
                        // (La lógica de "solo borrar sus propias reservas" la manejamos en el controlador)
                        .requestMatchers(HttpMethod.GET, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/reservas").hasAnyRole("PROFESOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")

                        // USUARIOS - Solo ADMIN
                        .requestMatchers("/usuario/**").hasRole("ADMIN")

                        // Todo lo demás requiere autenticación
                        .requestMatchers("/", "/index.html", "/static/**", "/frontend/**").permitAll()
                        .anyRequest().authenticated()

                )

                // Configurar validación automática de tokens JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )

                // Sin sesiones (stateless)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Configura cómo validar los tokens JWT con la clave secreta
        return NimbusJwtDecoder.withSecretKey(jwtService.getSecretKey()).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Configura cómo extraer los roles del token
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("roles");  // Buscar en claim "roles"
        authoritiesConverter.setAuthorityPrefix("");             // Sin prefijo adicional

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return jwtConverter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt para cifrar contraseñas en la base de datos
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        // Necesario para validar email/password en el login
        return authConfig.getAuthenticationManager();
    }
}