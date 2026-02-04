# 🏫 Sistema de Reservas de Aulas

API REST desarrollada con Spring Boot para gestionar las reservas de aulas comunes en un centro educativo. Incluye autenticación JWT, sistema de roles (ADMIN y PROFESOR), y validaciones de negocio completas.

**Repositorio GitHub:** [https://github.com/Roberto7450/ReservasAulas2](https://github.com/Roberto7450/ReservasAulas2)

---

## 🚀 Tecnologías Utilizadas

- **Java 21**
- **Spring Boot 3.5.6**
  - Spring Security (JWT OAuth2 Resource Server)
  - Spring Data JPA
  - Spring Web
  - Spring Validation
- **MySQL** - Base de datos relacional
- **JWT (JJWT 0.12.6)** - Autenticación stateless con tokens
- **BCrypt** - Cifrado seguro de contraseñas
- **Lombok** - Reducción de código boilerplate
- **Maven** - Gestión de dependencias
- **Apache Commons BeanUtils 1.11.0** - Utilidades para actualización parcial de entidades

---

## 📋 Entidades del Sistema

### 📚 Aula
Representa las aulas disponibles en el centro educativo.

**Atributos:**
- `id` (Long) - Identificador único, generado automáticamente
- `nombre` (String) - Nombre del aula (ej: "Aula 101", "Aula Informática 1")
- `capacidad` (Integer) - Número máximo de personas
- `esOrdenadores` (Boolean) - Indica si el aula tiene ordenadores
- `reservas` (List<Reserva>) - Reservas asociadas al aula (relación OneToMany)

**Anotaciones JPA:**
- `@Entity` - Tabla "aulas"
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` - ID autogenerado
- Cascade ALL + orphanRemoval para eliminar reservas automáticamente

---

### ⏰ Horario
Define los tramos horarios disponibles para las reservas.

**Atributos:**
- `id` (Long) - Identificador único
- `diaSemana` (DiaSemana) - Enum: LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO
- `horaInicio` (LocalTime) - Hora de inicio del tramo
- `horaFin` (LocalTime) - Hora de fin del tramo

**Método importante:**
```java
public boolean seSolapaCon(Horario otro)
```
Verifica si dos horarios se solapan en el mismo día. Usado para validar reservas.

**Anotaciones:**
- `@Enumerated(EnumType.STRING)` - Almacena el enum como String en BD

---

### 📅 Reserva
Representa una reserva de un aula en un horario específico.

**Atributos:**
- `id` (Long) - Identificador único
- `fecha` (LocalDate) - Fecha de la reserva
- `motivo` (String) - Razón de la reserva
- `asistentes` (Integer) - Número de personas que asistirán
- `fechaCreacion` (LocalDate) - Fecha de creación (automática con `@CreationTimestamp`)
- `aula` (Aula) - Aula reservada (ManyToOne)
- `horario` (Horario) - Tramo horario reservado (ManyToOne)
- `usuario` (Usuario) - Profesor que realizó la reserva (ManyToOne con FetchType.LAZY)

**Relaciones:**
- `@ManyToOne` con Aula, Horario y Usuario
- `@JoinColumn(name = "horario_id", nullable = false)`
- `@JoinColumn(name = "usuario_id", nullable = false)`

---

### 👤 Usuario
Representa los usuarios del sistema (profesores y administradores).

**Atributos:**
- `id` (Long) - Identificador único
- `email` (String) - Email único (usado como username)
- `password` (String) - Contraseña cifrada con BCrypt
- `roles` (String) - Roles separados por comas (ej: "ROLE_PROFESOR" o "ROLE_ADMIN")
- `enabled` (Boolean) - Indica si la cuenta está activa

**Implementa:** `UserDetails` de Spring Security para integración con JWT

**Método importante:**
```java
public Collection<? extends GrantedAuthority> getAuthorities()
```
Convierte los roles de String a `SimpleGrantedAuthority` para Spring Security.

---

## 📦 DTOs (Data Transfer Objects)

### Request DTOs (Entrada de datos):

**LoginRequest** (record)
- `email` - Validado como email
- `password` - No puede estar vacío

**RegisterRequest** (record)
- `email` - Obligatorio, formato email válido
- `password` - Obligatorio, mínimo 6 caracteres

**CambiarPasswordRequest**
- `passwordActual` - Obligatorio
- `nuevaPassword` - Obligatorio, mínimo 6 caracteres

**AulaRequest**
- `nombre` - Obligatorio, entre 2 y 50 caracteres
- `capacidad` - Obligatorio, mínimo 1
- `esOrdenadores` - Obligatorio (true/false)

**HorarioRequest**
- `diaSemana` - Obligatorio, valor del enum DiaSemana
- `horaInicio` - Obligatorio, formato LocalTime
- `horaFin` - Obligatorio, formato LocalTime

**ReservaRequest**
- `aulaId` - Obligatorio, debe existir
- `horarioId` - Obligatorio, debe existir
- `fecha` - Obligatorio, formato dd/MM/yyyy, no puede ser pasado
- `motivo` - Obligatorio, entre 3 y 200 caracteres
- `asistentes` - Obligatorio, valor positivo
- ❌ **NO incluye usuarioId** - Se obtiene automáticamente del token JWT

### Response DTOs (Salida de datos):

**UsuarioDTO**
- Incluye: id, email, roles, enabled
- **Excluye:** password (seguridad)

**AulaDTO**
- Información básica: id, nombre, capacidad, esOrdenadores

**HorarioDTO**
- Información completa: id, diaSemana, horaInicio, horaFin

**ReservaDTO**
- Información completa de la reserva
- Incluye datos relacionados (aula, horario, usuario) sin exponer entidades completas

---

## 👥 Roles y Permisos

### 🔑 ROLE_ADMIN
- ✅ Acceso total a todos los endpoints
- ✅ Crear, editar y eliminar **aulas**
- ✅ Crear, editar y eliminar **horarios**
- ✅ Ver todas las reservas
- ✅ Eliminar **cualquier reserva** (incluso de otros usuarios)
- ✅ Gestionar usuarios (actualizar, eliminar)

### 👨‍🏫 ROLE_PROFESOR
- ✅ Ver aulas (GET)
- ✅ Ver horarios (GET)
- ✅ Ver todas las reservas (GET)
- ✅ Crear sus propias reservas
- ✅ Editar **SOLO sus propias reservas**
- ✅ Eliminar **SOLO sus propias reservas**
- ✅ Cambiar su propia contraseña
- ❌ NO puede crear/editar/eliminar aulas
- ❌ NO puede crear/editar/eliminar horarios
- ❌ NO puede gestionar usuarios

**Validación de propiedad:** Implementada en `ControllerReserva` verificando el email del usuario autenticado vs el creador de la reserva.

---

## 🛡️ Validaciones de Negocio Implementadas

### En Reservas (`ServiceReserva`):

**1. ✅ No se pueden hacer reservas en el pasado**
```java
if (reserva.getFecha().isBefore(LocalDate.now()))
```
Validación: `@FutureOrPresent` en DTO + validación en servicio

**2. ✅ No se permite solapamiento de reservas**
```java
@Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
       "FROM Reserva r " +
       "WHERE r.aula.id = :aulaId " +
       "AND r.horario.id = :horarioId " +
       "AND r.fecha = :fecha")
boolean existsSolapamiento(Long aulaId, Long horarioId, LocalDate fecha);
```
No puede existir otra reserva para la misma aula, mismo horario y misma fecha.

**3. ✅ El número de asistentes no puede superar la capacidad del aula**
```java
if (reserva.getAsistentes() > aula.getCapacidad())
```

**4. ✅ Solo el creador o un ADMIN pueden editar/eliminar una reserva**
```java
boolean esAdmin = authentication.getAuthorities().stream()
    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

if (!esAdmin && !reservaExistente.getUsuario().getEmail().equals(emailUsuario)) {
    return 403 Forbidden
}
```

### Validaciones de Campos (Jakarta Validation):

Todas las validaciones usan anotaciones `@Valid` y son capturadas por `GlobalExceptionHandler`:

- `@NotNull` - Campo obligatorio
- `@NotBlank` - String no vacío
- `@Email` - Formato email válido
- `@Size(min, max)` - Longitud de cadena
- `@Min(value)` - Valor mínimo
- `@Positive` - Número positivo
- `@FutureOrPresent` - Fecha presente o futura

---

## 🔒 Sistema de Seguridad

### Arquitectura:

1. **Stateless Authentication** - Sin sesiones en el servidor
2. **JWT con HMAC-SHA256** - Tokens firmados con clave secreta de 256 bits
3. **BCrypt (strength 10)** - Hash de contraseñas con salt automático
4. **Expiración: 24 horas** - Configurado en `JwtService`
5. **OAuth2 Resource Server** - Validación automática de tokens

### Configuración de Seguridad (`SecurityConfig`):

**Rutas públicas:**
```java
.requestMatchers("/auth/**").permitAll()
```

**Aulas:**
```java
.requestMatchers(HttpMethod.GET, "/aulas/**").hasAnyRole("PROFESOR", "ADMIN")
.requestMatchers(HttpMethod.POST, "/aulas/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/aulas/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/aulas/**").hasRole("ADMIN")
```

**Horarios:**
```java
.requestMatchers(HttpMethod.GET, "/horarios/**").hasAnyRole("PROFESOR", "ADMIN")
.requestMatchers(HttpMethod.POST, "/horarios/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/horarios/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/horarios/**").hasRole("ADMIN")
```

**Reservas:**
```java
.requestMatchers(HttpMethod.GET, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")
.requestMatchers(HttpMethod.POST, "/reservas").hasAnyRole("PROFESOR", "ADMIN")
.requestMatchers(HttpMethod.PUT, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")
.requestMatchers(HttpMethod.DELETE, "/reservas/**").hasAnyRole("PROFESOR", "ADMIN")
```
*(La validación de propiedad se hace en el controlador)*

**Usuarios:**
```java
.requestMatchers("/usuario/**").hasRole("ADMIN")
```

### Flujo de Autenticación:

```
1. POST /auth/login {email, password}
2. AuthenticationManager valida credenciales con BCrypt
3. Si correctas → JwtService genera token firmado
4. Token devuelto al cliente
5. Cliente incluye token en header: Authorization: Bearer {token}
6. JwtDecoder valida firma y expiración automáticamente
7. JwtAuthenticationConverter extrae email y roles del payload
8. SecurityContext guarda Authentication
9. @PreAuthorize o reglas HTTP verifican permisos
10. Si autorizado → ejecuta acción, sino → 403 Forbidden
```

---

## ⚙️ Instalación y Configuración

### 1️⃣ Requisitos Previos

- ✅ **Java 21** o superior
- ✅ **MySQL 8.0** o superior  
- ✅ **Maven 3.6** o superior
- ✅ **Git** (para clonar)
- ✅ **Postman** (opcional, para pruebas)

---

### 2️⃣ Clonar el repositorio

```bash
git clone https://github.com/Roberto7450/ReservasAulas2.git
cd ReservasAulas2
```

---

### 3️⃣ Crear la base de datos MySQL

```sql
CREATE DATABASE reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 4️⃣ Configurar `application.properties`

Edita `src/main/resources/application.properties`:

```properties
spring.application.name=ReservasAulas

# Configuración de MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/reservas?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_MYSQL

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Opcional: Dialecto de Hibernate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

**Importante:**
- `spring.jpa.hibernate.ddl-auto=update` - Crea/actualiza tablas automáticamente
- Cambia `TU_PASSWORD_MYSQL` por tu contraseña real

---

### 5️⃣ Compilar y ejecutar

```bash
# Compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

**La API estará disponible en:** `http://localhost:8080`

---

### 6️⃣ Crear usuarios iniciales

⚠️ **El proyecto NO usa `data.sql`** - Los usuarios se crean mediante la API.

#### Crear el primer ADMIN:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iesjuanbosco.es",
    "password": "password123"
  }'
```

Luego, **manualmente** debes cambiar el rol en la base de datos:

```sql
UPDATE usuarios 
SET roles = 'ROLE_ADMIN' 
WHERE email = 'admin@iesjuanbosco.es';
```

#### Crear profesores:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profesor1@iesjuanbosco.es",
    "password": "password123"
  }'
```

Los profesores se crean automáticamente con rol `ROLE_PROFESOR`.

---

### 7️⃣ Insertar datos de prueba (opcional)

Ejecuta el script `data.sql` incluido en el proyecto para crear aulas y horarios de prueba:

```sql
-- Copiar y ejecutar manualmente desde data.sql
INSERT INTO aulas (nombre, capacidad, es_ordenadores) VALUES ...
INSERT INTO horarios (dia_semana, hora_inicio, hora_fin) VALUES ...
```

---

### 8️⃣ Probar con Postman

1. Importa la colección: `API_Reservas_Aulas.postman_collection.json`
2. Configura `{{baseUrl}}` = `http://localhost:8080`
3. Ejecuta "Login - ADMIN" para obtener tu token
4. El token se guarda automáticamente en variables de colección
5. Prueba los demás endpoints

---

## 📡 Endpoints de la API

### 🔐 Autenticación (`/auth`)

#### 1. Registrar nuevo usuario (PROFESOR por defecto)

```http
POST /auth/register
Content-Type: application/json

{
  "email": "nuevo@iesjuanbosco.es",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado correctamente"
}
```

**Errores:**
- `400` - Email ya registrado o validación fallida
- `500` - Error del servidor

---

#### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@iesjuanbosco.es",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBpZXNqdWFuYm9zY28uZXMi..."
}
```

**Errores:**
- `401` - Credenciales incorrectas

---

#### 3. Obtener perfil del usuario autenticado

```http
GET /auth/perfil
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "email": "admin@iesjuanbosco.es",
  "roles": "ROLE_ADMIN",
  "enabled": true
}
```

---

#### 4. Cambiar contraseña

```http
PATCH /auth/cambiar-pass
Authorization: Bearer {token}
Content-Type: application/json

{
  "passwordActual": "password123",
  "nuevaPassword": "newPassword456"
}
```

**Respuesta (200):**
```
"Contraseña cambiada correctamente"
```

---

### 🏢 Aulas (`/aulas`)

**Roles permitidos:**
- GET: PROFESOR, ADMIN
- POST/PUT/DELETE: ADMIN

#### 1. Listar todas las aulas

```http
GET /aulas
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombre": "Aula 101",
    "capacidad": 30,
    "esOrdenadores": false
  }
]
```

---

#### 2. Obtener aula por ID

```http
GET /aulas/1
Authorization: Bearer {token}
```

---

#### 3. Filtrar por capacidad

```http
GET /aulas?capacidad=25
Authorization: Bearer {token}
```

Devuelve aulas con capacidad **≥ 25**.

---

#### 4. Filtrar por ordenadores

```http
GET /aulas?esOrdenadores=true
Authorization: Bearer {token}
```

---

#### 5. Crear aula (ADMIN)

```http
POST /aulas
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Aula 202",
  "capacidad": 35,
  "esOrdenadores": false
}
```

**Respuesta (201):**
```json
{
  "id": 6,
  "nombre": "Aula 202",
  "capacidad": 35,
  "esOrdenadores": false
}
```

---

#### 6. Actualizar aula (ADMIN)

```http
PUT /aulas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Aula 101 Renovada",
  "capacidad": 40,
  "esOrdenadores": true
}
```

---

#### 7. Eliminar aula (ADMIN)

```http
DELETE /aulas/1
Authorization: Bearer {token}
```

---

#### 8. Ver reservas de un aula

```http
GET /aulas/1/reservas
Authorization: Bearer {token}
```

---

### ⏰ Horarios (`/horarios`)

**Roles permitidos:**
- GET: PROFESOR, ADMIN
- POST/PUT/DELETE: ADMIN

#### 1. Listar todos los horarios

```http
GET /horarios
Authorization: Bearer {token}
```

---

#### 2. Obtener horario por ID

```http
GET /horarios/1
Authorization: Bearer {token}
```

---

#### 3. Crear horario (ADMIN)

```http
POST /horarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "diaSemana": "LUNES",
  "horaInicio": "11:00:00",
  "horaFin": "12:00:00"
}
```

---

#### 4. Actualizar horario (ADMIN)

```http
PUT /horarios/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "diaSemana": "MARTES",
  "horaInicio": "12:00:00",
  "horaFin": "13:00:00"
}
```

---

#### 5. Eliminar horario (ADMIN)

```http
DELETE /horarios/1
Authorization: Bearer {token}
```

---

### 📅 Reservas (`/reservas`)

**Roles permitidos:**
- GET/POST/PUT/DELETE: PROFESOR (solo sus reservas), ADMIN (todas)

#### 1. Listar todas las reservas

```http
GET /reservas
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "fecha": "2025-01-15",
    "motivo": "Clase de Matemáticas",
    "asistentes": 25,
    "fechaCreacion": "2025-01-10",
    "aulaId": 1,
    "aulaNombre": "Aula 101",
    "horarioId": 1,
    "horarioDiaSemana": "LUNES",
    "horarioHoraInicio": "08:00:00",
    "horarioHoraFin": "09:00:00",
    "usuarioId": 2,
    "usuarioEmail": "profesor1@iesjuanbosco.es"
  }
]
```

---

#### 2. Obtener reserva por ID

```http
GET /reservas/1
Authorization: Bearer {token}
```

---

#### 3. Crear reserva

```http
POST /reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "aulaId": 1,
  "horarioId": 1,
  "fecha": "20/01/2025",
  "motivo": "Clase de Matemáticas",
  "asistentes": 25
}
```

⚠️ **IMPORTANTE:** NO envíes `usuarioId` - Se obtiene automáticamente del token JWT.

**Respuesta (201):**
```json
{
  "id": 5,
  "fecha": "2025-01-20",
  "motivo": "Clase de Matemáticas",
  "asistentes": 25,
  ...
}
```

**Errores:**
- `400` - Solapamiento, capacidad excedida, o fecha pasada
- `404` - Aula u horario no encontrado

---

#### 4. Actualizar reserva

```http
PUT /reservas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "aula": {...},
  "horario": {...},
  "fecha": "21/01/2025",
  "motivo": "Clase de Física",
  "asistentes": 20
}
```

⚠️ Solo el creador o ADMIN pueden editar.

---

#### 5. Eliminar reserva

```http
DELETE /reservas/1
Authorization: Bearer {token}
```

⚠️ Solo el creador o ADMIN pueden eliminar.

**Respuesta (200):**
```
"Reserva eliminada correctamente"
```

**Errores:**
- `403` - "Solo puedes eliminar tus propias reservas"
- `404` - Reserva no encontrada

---

### 👤 Usuarios (`/usuario`)

**Roles permitidos:** ADMIN

#### 1. Actualizar usuario

```http
PUT /usuario/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "nuevoEmail@iesjuanbosco.es",
  "roles": "ROLE_ADMIN",
  "enabled": true
}
```

---

#### 2. Eliminar usuario

```http
DELETE /usuario/1
Authorization: Bearer {token}
```

---

## ✅ Manejo Global de Errores

El `GlobalExceptionHandler` captura todas las excepciones:

### 1. Validación (400 Bad Request)
```json
{
  "mensaje": "Errores de validación",
  "errores": {
    "email": "El email debe ser válido",
    "password": "La contraseña debe tener al menos 6 caracteres"
  }
}
```

### 2. Credenciales incorrectas (401 Unauthorized)
```json
{
  "mensaje": "Credenciales incorrectas"
}
```

### 3. Sin permisos (403 Forbidden)
```json
{
  "mensaje": "No tienes permisos para realizar esta acción"
}
```

O específico:
```
"Solo puedes eliminar tus propias reservas"
```

### 4. Recurso no encontrado (404 Not Found)
```json
{
  "mensaje": "Aula no encontrada con id: 999"
}
```

### 5. Lógica de negocio (400 Bad Request)
```json
{
  "mensaje": "El número de asistentes supera la capacidad del aula."
}
```

O:
```json
{
  "mensaje": "La reserva se solapa con otra reserva existente en el mismo aula y horario."
}
```

### 6. Error del servidor (500 Internal Server Error)
```json
{
  "mensaje": "Error interno del servidor",
  "detalle": "Descripción técnica del error"
}
```

---

## 🧪 Casos de Prueba con Postman

### 1️⃣ Registro y Login

✅ **Registro exitoso:**
```
POST /auth/register → 201 Created
```

❌ **Email duplicado:**
```
POST /auth/register (mismo email) → 400 "El email ya está registrado"
```

✅ **Login correcto:**
```
POST /auth/login → 200 + token JWT
```

❌ **Credenciales incorrectas:**
```
POST /auth/login (password incorrecta) → 401 "Credenciales incorrectas"
```

---

### 2️⃣ Permisos por Rol

✅ **ADMIN puede crear aulas:**
```
POST /aulas (token ADMIN) → 201 Created
```

❌ **PROFESOR NO puede crear aulas:**
```
POST /aulas (token PROFESOR) → 403 "No tienes permisos"
```

✅ **PROFESOR puede ver aulas:**
```
GET /aulas (token PROFESOR) → 200 OK
```

---

### 3️⃣ Validaciones de Reservas

✅ **Crear reserva válida:**
```
POST /reservas → 201 Created
```

❌ **Reserva solapada:**
```
POST /reservas (misma aula, horario, fecha) → 400 "La reserva se solapa"
```

❌ **Asistentes > capacidad:**
```
POST /reservas (50 asistentes en aula de 30) → 400 "supera la capacidad"
```

❌ **Fecha en el pasado:**
```
POST /reservas (fecha pasada) → 400 "No se pueden hacer reservas en el pasado"
```

---

### 4️⃣ Propiedad de Reservas

✅ **PROFESOR elimina su propia reserva:**
```
1. Profesor1 crea reserva → 201
2. Profesor1 elimina su reserva → 200 "Reserva eliminada correctamente"
```

❌ **PROFESOR intenta eliminar reserva ajena:**
```
1. Profesor1 crea reserva
2. Profesor2 intenta eliminarla → 403 "Solo puedes eliminar tus propias reservas"
```

✅ **ADMIN puede eliminar cualquier reserva:**
```
DELETE /reservas/1 (token ADMIN) → 200 OK
```

---

### 5️⃣ Filtros

✅ **Filtrar aulas por capacidad:**
```
GET /aulas?capacidad=25 → Aulas con capacidad ≥ 25
```

✅ **Filtrar aulas con ordenadores:**
```
GET /aulas?esOrdenadores=true → Solo aulas con ordenadores
```

✅ **Ver reservas de un aula:**
```
GET /aulas/1/reservas → Todas las reservas del aula 1
```

---

## 📦 Estructura del Proyecto

```
src/main/java/es/iesjuanbosco/roberto/ReservasAulas/
├── beans/
│   └── CopiarClase.java              # Utilidad BeanUtils para copiar propiedades no nulas
│
├── config/
│   ├── SecurityConfig.java           # Configuración completa de Spring Security y JWT
│   └── CorsConfig.java               # Filtro CORS global para permitir peticiones del frontend
│
├── controllers/
│   ├── ControllerAlumno.java         # Ejemplo de uso de @PreAuthorize (no usado)
│   ├── ControllerAuth.java           # Login, register, perfil, cambiar contraseña
│   ├── ControllerAula.java           # CRUD aulas + filtros + reservas por aula
│   ├── ControllerHorario.java        # CRUD horarios
│   ├── ControllerReserva.java        # CRUD reservas con validación de propiedad
│   └── ControllerUsuario.java        # Gestión usuarios (solo ADMIN)
│
├── dtos/
│   ├── AulaDTO.java                  # Response DTO para aulas
│   ├── AulaRequest.java              # Request DTO para crear/actualizar aulas
│   ├── CambiarPasswordRequest.java   # DTO para cambio de contraseña
│   ├── HorarioDTO.java               # Response DTO para horarios
│   ├── HorarioRequest.java           # Request DTO para crear/actualizar horarios
│   ├── LoginRequest.java             # Record: email, password
│   ├── RegisterRequest.java          # Record: email, password
│   ├── ReservaDTO.java               # Response DTO con info completa
│   ├── ReservaRequest.java           # Request DTO (sin usuarioId - se obtiene del token)
│   └── UsuarioDTO.java               # Response DTO sin password
│
├── entities/
│   ├── Aula.java                     # Entidad JPA con relación OneToMany a Reserva
│   ├── Horario.java                  # Entidad JPA con método seSolapaCon()
│   ├── Reserva.java                  # Entidad JPA con ManyToOne a Aula, Horario, Usuario
│   └── Usuario.java                  # Entidad JPA que implementa UserDetails
│
├── enums/
│   └── DiaSemana.java                # Enum: LUNES...DOMINGO
│
├── exceptions/
│   └── GlobalExceptionHandler.java   # @RestControllerAdvice - Manejo centralizado
│
├── mapper/
│   ├── AulaMapper.java               # Conversión Aula ↔ AulaDTO
│   ├── HorarioMapper.java            # Conversión Horario ↔ HorarioDTO
│   ├── ReservaMapper.java            # Conversión Reserva ↔ ReservaDTO
│   └── UsuarioMapper.java            # Conversión Usuario ↔ UsuarioDTO
│
├── repositories/
│   ├── RepositorioAula.java          # Métodos: findByCapacidad, findByEsOrdenadores
│   ├── RepositorioHorario.java       # Repositorio básico JPA
│   ├── RepositorioReserva.java       # Query personalizada: existsSolapamiento
│   └── RepositorioUsuario.java       # Método: findByEmail
│
├── services/
│   ├── CustomUserDetailsService.java # Implementa UserDetailsService
│   ├── JwtService.java               # Generación de tokens JWT
│   ├── ServiceAula.java              # Lógica de negocio para aulas
│   ├── ServiceHorario.java           # Lógica de negocio para horarios
│   ├── ServiceReserva.java           # Validaciones + lógica reservas
│   └── ServiceUsuario.java           # Gestión usuarios y contraseñas
│
└── ReservasAulasApplication.java     # Clase principal Spring Boot

src/main/resources/
├── application.properties            # Configuración BD y JPA
└── data.sql                          # Script para insertar aulas y horarios de prueba

Frontend/
├── crud_reservas_aulas.html          # Interfaz web completa CON autenticación JWT
└── API_Reservas_Aulas.postman_collection.json  # Colección Postman
```

---

## 🌐 Frontend Web

El proyecto incluye una interfaz web en `crud_reservas_aulas.html`.

### Características:

✅ **Gestión de Aulas**
- Crear, editar, eliminar aulas
- Filtrar por capacidad y ordenadores
- Ver reservas de cada aula

✅ **Gestión de Horarios**
- Crear, editar, eliminar horarios
- Visualización de tramos horarios

✅ **Gestión de Reservas**
- Crear reservas
- Ver todas las reservas
- Editar y eliminar reservas

✅ **Características técnicas**
- Sistema de pestañas (Aulas, Horarios, Reservas)
- Conexión configurable al backend
- Notificaciones visuales
- Modal de confirmación para eliminar

### Cómo usar:

1. Asegúrate de que el backend esté corriendo en `http://localhost:8080`
2. Abre `crud_reservas_aulas.html` en tu navegador
3. Configura la URL si es necesaria
4. Haz clic en "Probar Conexión"
5. Navega entre las pestañas

---

## 🚀 Próximas Mejoras

Posibles extensiones del proyecto:

- [ ] **Roles desde BD** - Tabla separada de roles
- [ ] **Notificaciones email** - Confirmar reservas
- [ ] **Calendario visual** - Ver disponibilidad
- [ ] **Estadísticas** - Panel de métricas
- [ ] **Exportar datos** - PDF o Excel
- [ ] **API de disponibilidad** - Ver horarios libres
- [ ] **Sistema de aprobación** - Reservas que requieren autorización

---

## 📚 Documentación Técnica

### Tecnologías y Frameworks:

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [JJWT (Java JWT)](https://github.com/jwtk/jjwt)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Bean Validation](https://beanvalidation.org/2.0/spec/)

### Guías útiles:

- [JWT con Spring Boot - Baeldung](https://www.baeldung.com/spring-security-oauth-jwt)
- [Spring Security Architecture](https://spring.io/guides/topicals/spring-security-architecture)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎓 Aprendizajes del Proyecto

Tecnologías y conceptos aplicados:

✅ **Spring Boot 3.5.6** - Framework moderno de Java  
✅ **Spring Security** - Autenticación y autorización  
✅ **JWT (JSON Web Tokens)** - Autenticación stateless  
✅ **Spring Data JPA** - Persistencia de datos  
✅ **Relaciones JPA** - OneToMany, ManyToOne con Lazy Loading  
✅ **DTOs y Mappers** - Separación de capas  
✅ **Validaciones** - Jakarta Validation con `@Valid`  
✅ **Manejo de excepciones** - GlobalExceptionHandler centralizado  
✅ **Control de acceso** - RBAC (Role-Based Access Control)  
✅ **API REST** - Diseño de endpoints RESTful  
✅ **BCrypt** - Hash de contraseñas seguro  
✅ **OAuth2 Resource Server** - Validación automática de tokens  

---

**¡Gracias por revisar este proyecto!** 🚀

Si tienes dudas o sugerencias, abre un issue en GitHub.
