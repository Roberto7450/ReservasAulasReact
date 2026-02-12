# 🏫 Sistema de Reservas de Aulas - Full Stack

**Aplicación completa** para gestionar las reservas de aulas comunes en un centro educativo. Incluye backend API REST con Spring Boot, frontend SPA con React, autenticación JWT, sistema de roles (ADMIN y PROFESOR), y validaciones de negocio completas.

**Repositorio GitHub:** [https://github.com/Roberto7450/ReservasAulasReact](https://github.com/Roberto7450/ReservasAulasReact)

---

## 🚀 Tecnologías Utilizadas

### Backend (Spring Boot)
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

### Frontend (React)
- **React 18.3** - Librería para crear interfaces de usuario
- **React Router DOM 7.1** - Navegación entre páginas (SPA)
- **Vite 6.0** - Build tool y dev server ultra rápido
- **Tailwind CSS 4.0** - Framework de CSS con clases de utilidad
- **Axios 1.7** - Cliente HTTP para conectar con el backend
- **JavaScript ES6+** - Arrow functions, destructuring, spread operator, async/await

- **Axios 1.7** - Cliente HTTP para conectar con el backend
- **JavaScript ES6+** - Arrow functions, destructuring, spread operator, async/await

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │          REACT FRONTEND (Vite + Tailwind)         │  │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────┐      │  │
│  │  │ Pages   │  │Components│  │   Services   │      │  │
│  │  │ - Login │  │ - Navbar │  │ - authService│      │  │
│  │  │ - Aulas │  │ - Forms  │  │ - aulaService│      │  │
│  │  │ - Reserv│  │ - Cards  │  │ - axios/api  │      │  │
│  │  └─────────┘  └──────────┘  └──────────────┘      │  │
│  │               ↕ React Router                      │  │
│  │               ↕ Context API (Auth)                │  │
│  └───────────────────────────────────────────────────┘  │
│                        ↕ HTTP/JSON + JWT                │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│              SPRING BOOT BACKEND (API REST)             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Controllers → Services → Repositories → MySQL    │  │
│  │     ↑              ↑            ↑                 │  │
│  │  DTOs       Entities/Logic   JPA/Hibernate        │  │
│  │                                                   │  │
│  │  Security: JWT + BCrypt + Role-Based Access       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Comunicación:**
- Frontend (puerto 5173) ↔ Backend (puerto 8080)
- Autenticación: JWT en header `Authorization: Bearer {token}`
- Datos: JSON en requests y responses

---

## 📱 Características del Frontend React

### ✨ Funcionalidades Implementadas

**🔐 Autenticación y Seguridad:**
- Login y registro de usuarios
- Almacenamiento de token JWT en `localStorage`
- Contexto global de autenticación (`AuthContext`)
- Rutas protegidas que verifican autenticación
- Logout con limpieza de token
- Decodificación de token para extraer email y roles

**🏠 Páginas Principales:**
- **Home** - Página de inicio con renderizado condicional
- **Login** - Formulario de inicio de sesión
- **Register** - Formulario de registro
- **Aulas** - CRUD completo con filtros (capacidad, ordenadores)
- **Horarios** - CRUD completo de horarios
- **Reservas** - CRUD completo con filtros por rol

**🧩 Componentes Reutilizables:**
- `Navbar` - Barra de navegación con info del usuario
- `ProtectedRoute` - HOC que protege rutas privadas
- `FormularioAula/Horario/Reserva` - Formularios con validación
- `TarjetaAula/Horario/Reserva` - Tarjetas de visualización

**🎨 Diseño y UX:**
- Diseño responsive con Tailwind CSS
- Clases de utilidad: `bg-`, `text-`, `p-`, `m-`, `flex`, `grid`, `rounded-`, `hover:`
- Notificaciones de éxito y error
- Confirmaciones antes de eliminar
- Estados de carga (`loading`)

**⚛️ Conceptos React Utilizados:**
- **Componentes funcionales** - Toda la app usa function components
- **Hooks:**
  - `useState` - Gestión de estado local
  - `useEffect` - Carga de datos al montar componentes
  - `useContext` - Acceso al contexto de autenticación
  - `useNavigate` - Navegación programática
- **Props** - Paso de datos entre componentes
- **Context API** - Estado global de autenticación
- **React Router** - Navegación SPA sin recargar página
- **Renderizado condicional** - Muestra contenido según estado
- **Listas con `.map()`** - Renderizado dinámico de arrays
- **Eventos** - `onClick`, `onChange`, `onSubmit`
- **Formularios controlados** - Inputs vinculados al estado

**🔌 Conexión con Backend:**
- Cliente HTTP configurado con Axios
- Interceptores que añaden token JWT automáticamente
- Interceptores que redirigen al login si token expira (401)
- Servicios organizados por entidad (aulaService, horarioService, etc.)
- Formateo de fechas y horas para el backend

---

## 📦 Estructura del Proyecto

```
ReservasAulasReact/
├── frontend/                          # Aplicación React
│   ├── src/
│   │   ├── pages/                    # Páginas de la aplicación
│   │   │   ├── Home.jsx             # Página de inicio
│   │   │   ├── Login.jsx            # Formulario de login
│   │   │   ├── Register.jsx         # Formulario de registro
│   │   │   ├── Aulas.jsx            # Gestión de aulas
│   │   │   ├── Horarios.jsx         # Gestión de horarios
│   │   │   └── Reservas.jsx         # Gestión de reservas
│   │   │
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── Navbar.jsx           # Barra de navegación
│   │   │   ├── ProtectedRoute.jsx   # Rutas protegidas
│   │   │   ├── FormularioAula.jsx   # Formulario crear/editar aula
│   │   │   ├── FormularioHorario.jsx
│   │   │   ├── FormularioReserva.jsx
│   │   │   ├── TarjetaAula.jsx      # Tarjeta de información
│   │   │   ├── TarjetaHorario.jsx
│   │   │   └── TarjetaReserva.jsx
│   │   │
│   │   ├── context/                  # Estado global
│   │   │   └── AuthContext.jsx      # Contexto de autenticación
│   │   │
│   │   ├── services/                 # Servicios HTTP
│   │   │   ├── authService.js       # Login, registro
│   │   │   ├── aulaService.js       # CRUD aulas
│   │   │   ├── horarioService.js    # CRUD horarios
│   │   │   └── reservaService.js    # CRUD reservas
│   │   │
│   │   ├── utils/                    # Utilidades
│   │   │   └── api.js               # Config axios + interceptores
│   │   │
│   │   ├── App.jsx                   # Componente principal (rutas)
│   │   ├── main.jsx                  # Punto de entrada
│   │   ├── App.css                   # Estilos adicionales (vacío)
│   │   └── index.css                 # Importa Tailwind CSS
│   │
│   ├── public/                       # Recursos estáticos
│   ├── index.html                    # HTML base
│   ├── package.json                  # Dependencias npm
│   ├── vite.config.js               # Configuración Vite
│   ├── tailwind.config.js           # Configuración Tailwind
│   └── eslint.config.js             # Configuración ESLint
│
├── src/main/java/.../ReservasAulas/ # Backend Spring Boot
│   ├── config/                       # Configuración
│   │   ├── SecurityConfig.java      # Spring Security + JWT
│   │   ├── CorsConfig.java          # CORS para frontend
│   │   └── JacksonConfig.java       # Deserialización fechas
│   │
│   ├── controllers/                  # Controladores REST
│   │   ├── ControllerAuth.java      # /auth/** (login, register)
│   │   ├── ControllerAula.java      # /aulas/**
│   │   ├── ControllerHorario.java   # /horarios/**
│   │   ├── ControllerReserva.java   # /reservas/**
│   │   └── ControllerUsuario.java   # /usuario/**
│   │
│   ├── services/                     # Lógica de negocio
│   ├── repositories/                 # Acceso a datos JPA
│   ├── entities/                     # Entidades JPA
│   ├── dtos/                         # DTOs request/response
│   ├── mapper/                       # Conversión Entity ↔ DTO
│   ├── enums/                        # Enumeraciones
│   └── exceptions/                   # Manejo de errores
│
├── src/main/resources/
│   ├── application.properties       # Config BD y servidor
│   └── data.sql                     # Datos iniciales
│
├── pom.xml                          # Dependencias Maven
├── README.md                        # Este archivo
└── API_Reservas_Aulas.json         # Colección Postman
```

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

**Backend:**
- ✅ **Java 21** o superior
- ✅ **MySQL 8.0** o superior  
- ✅ **Maven 3.6** o superior

**Frontend:**
- ✅ **Node.js 18** o superior (incluye npm)
- ✅ **Git** (para clonar)

**Opcional:**
- ✅ **Postman** (para probar API)
- ✅ **VS Code** o **IntelliJ IDEA** (editores recomendados)

---

### 2️⃣ Clonar el repositorio

```bash
git clone https://github.com/Roberto7450/ReservasAulasReact.git
cd ReservasAulasReact
```

---

### 3️⃣ Configurar y ejecutar el BACKEND

#### a) Crear la base de datos MySQL

```sql
CREATE DATABASE reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### b) Configurar `application.properties`

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
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

**⚠️ Importante:** Cambia `TU_PASSWORD_MYSQL` por tu contraseña real.

#### c) Compilar y ejecutar

```bash
# Desde la raíz del proyecto
mvn clean install
mvn spring-boot:run
```

**✅ El backend estará disponible en:** `http://localhost:8080`

---

### 4️⃣ Configurar y ejecutar el FRONTEND

#### a) Instalar dependencias

```bash
cd frontend
npm install
```

Esto instalará:
- React 18.3
- React Router DOM 7.1
- Axios 1.7
- Tailwind CSS 4.0
- Vite 6.0

#### b) Ejecutar servidor de desarrollo

```bash
npm run dev
```

**✅ El frontend estará disponible en:** `http://localhost:5173`

#### c) Comandos útiles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Preview de build de producción
npm run lint     # Ejecuta ESLint
```

---

### 5️⃣ Crear usuarios iniciales

⚠️ **El proyecto NO usa `data.sql` para usuarios** - Se crean mediante la API.

#### Crear el primer ADMIN:

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iesjuanbosco.es",
    "password": "password123"
  }'
```

Luego, **manualmente** cambiar el rol en la base de datos:

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

**💡 También puedes registrarte desde el frontend:** Abre `http://localhost:5173/register`

---

### 6️⃣ Insertar datos de prueba (opcional)

Ejecuta el script `data.sql` para crear aulas y horarios:

```sql
-- Ejecutar manualmente en MySQL
INSERT INTO aulas (nombre, capacidad, es_ordenadores) VALUES 
  ('Aula 101', 30, false),
  ('Aula 102', 25, false),
  ('Aula Informática 1', 20, true);

INSERT INTO horarios (dia_semana, hora_inicio, hora_fin) VALUES 
  ('LUNES', '08:00:00', '09:00:00'),
  ('LUNES', '09:00:00', '10:00:00'),
  ('MARTES', '10:00:00', '11:00:00');
```

---

### 7️⃣ Probar la aplicación

#### Opción 1: Usar el Frontend React

1. Abre `http://localhost:5173`
2. Haz clic en "Registrarse" o "Iniciar sesión"
3. Navega por las secciones: Aulas, Horarios, Reservas
4. Los administradores verán botones para crear/editar/eliminar
5. Los profesores solo podrán crear reservas y editar las suyas

#### Opción 2: Usar Postman

1. Importa la colección: `API_Reservas_Aulas.json`
2. Configura `{{baseUrl}}` = `http://localhost:8080`
3. Ejecuta "Login - ADMIN" para obtener tu token
4. El token se guarda automáticamente en variables de colección
5. Prueba los demás endpoints

---

### 8️⃣ Configuración de CORS (ya configurada)

El backend tiene CORS configurado en `CorsConfig.java` para permitir:
- Origen: `http://localhost:5173` (frontend React)
- Métodos: GET, POST, PUT, DELETE, OPTIONS
- Headers: Authorization, Content-Type
- Credentials: true

Si cambias el puerto del frontend, actualiza `CorsConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:NUEVO_PUERTO"));
```

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

## 🌐 Frontend React - Características Detalladas

### 📄 Páginas

**Home.jsx**
- Renderizado condicional según autenticación
- Panel de control para usuarios autenticados
- Página de bienvenida para visitantes
- Tarjetas de navegación (grid responsive)

**Login.jsx**
- Formulario controlado con validación
- Manejo de errores del backend
- Estados de carga
- Navegación programática tras login exitoso

**Register.jsx**
- Formulario con confirmación de contraseña
- Selector de rol (Profesor/Admin)
- Validación en tiempo real
- Redirección automática tras registro

**Aulas.jsx**
- CRUD completo (Create, Read, Update, Delete)
- Filtros por capacidad mínima
- Filtro por aulas con ordenadores
- Formulario modal para crear/editar
- Grid responsive de tarjetas
- Verificación de rol para mostrar botones

**Horarios.jsx**
- Gestión de tramos horarios
- Selector de día de la semana
- Inputs de tipo time para horas
- Validación de horarios

**Reservas.jsx**
- Filtro automático por día de semana
- Solo muestra horarios del día seleccionado
- Validación de capacidad vs asistentes
- Control de propiedad (profesores solo ven/editan las suyas)

### 🧩 Componentes

**Navbar.jsx**
- Responsive (menú hamburguesa en móvil)
- Muestra email y rol del usuario
- Badge de Admin/Profesor
- Logout con confirmación

**ProtectedRoute.jsx**
- Higher-Order Component (HOC)
- Verifica token JWT
- Redirige a login si no autenticado
- Pantalla de carga mientras verifica

**Formularios (FormularioAula, FormularioHorario, FormularioReserva)**
- Inputs controlados vinculados a useState
- Validación antes de enviar
- Manejo de errores del backend
- Limpieza de formulario tras guardar
- Botones de Guardar y Cancelar

**Tarjetas (TarjetaAula, TarjetaHorario, TarjetaReserva)**
- Diseño con Tailwind (shadow, rounded, hover)
- Botones de editar y eliminar (solo para admins)
- Confirmación antes de eliminar
- Formateo de datos (fechas, horas, días)

### 🔧 Utilidades y Servicios

**api.js**
- Cliente axios configurado
- URL dinámica (localhost o producción)
- Interceptor request: añade token JWT
- Interceptor response: redirige al login si 401
- Funciones de formateo de fechas y horas

**authService.js**
- login(email, password)
- register(email, password, role)
- changePassword(passwordActual, nuevaPassword)

**aulaService.js, horarioService.js, reservaService.js**
- obtenerTodas() / obtenerTodos()
- obtenerPorId(id)
- crear(datos)
- actualizar(id, datos)
- eliminar(id)

**AuthContext.jsx**
- Estado global: token, user, loading
- Funciones: login(), logout()
- Variables: isAuthenticated, isAdmin
- Decodificación de token JWT
- Persistencia en localStorage

### 🎨 Estilos con Tailwind CSS

**Ejemplos de clases usadas:**
```jsx
// Layout
className="flex justify-between items-center"
className="grid grid-cols-1 md:grid-cols-3 gap-6"

// Espaciado
className="p-4 m-2 px-6 py-3"

// Colores y fondos
className="bg-gray-50 text-white border-gray-200"
className="bg-blue-600 hover:bg-blue-700"

// Tamaños
className="min-h-screen w-full max-w-7xl"

// Bordes y sombras
className="rounded-lg shadow-sm border"

// Responsive
className="hidden md:flex"  // Oculto en móvil, flex en desktop

// Estados
className="hover:shadow-lg transition"
className="focus:outline-none focus:ring-2"
```

### 🔄 Flujo de Autenticación Frontend

```
1. Usuario va a /login
2. Introduce credenciales
3. authService.login() → POST /auth/login
4. Backend devuelve token JWT
5. AuthContext.login(token) → Guarda en localStorage
6. Decodifica token → Extrae email y roles
7. Actualiza estado: isAuthenticated = true
8. navigate('/') → Redirige a Home
9. Home renderiza panel de control
10. Cada petición incluye: Authorization: Bearer {token}
```

### 🔒 Protección de Rutas

```jsx
// En App.jsx
<Route
  path="/aulas"
  element={
    <ProtectedRoute>
      <Aulas />
    </ProtectedRoute>
  }
/>
```

**ProtectedRoute verifica:**
1. ¿Hay token en localStorage?
2. ¿El token es válido?
3. Si NO → `<Navigate to="/login" />`
4. Si SÍ → Renderiza `<Aulas />`

---

## 📚 Documentación Técnica

### Backend:
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html/)
- [JJWT (Java JWT)](https://github.com/jwtk/jjwt)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Bean Validation](https://beanvalidation.org/2.0/spec/)

### Frontend:
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com/docs/intro)
- [Vite](https://vite.dev/)

### Guías útiles:
- [JWT con Spring Boot - Baeldung](https://www.baeldung.com/spring-security-oauth-jwt)
- [Spring Security Architecture](https://spring.io/guides/topicals/spring-security-architecture)
- [React Hooks Guide](https://react.dev/reference/react)
- [Context API Guide](https://react.dev/learn/passing-data-deeply-with-context)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎓 Aprendizajes del Proyecto

### Backend (Spring Boot)
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
✅ **CORS** - Configuración para permitir frontend

### Frontend (React)
✅ **React 18** - Librería para crear interfaces de usuario  
✅ **Componentes funcionales** - Function components en lugar de class  
✅ **Hooks** - useState, useEffect, useContext, useNavigate  
✅ **React Router** - Navegación SPA sin recargar página  
✅ **Context API** - Estado global de autenticación  
✅ **Props** - Paso de datos entre componentes  
✅ **Renderizado condicional** - Mostrar contenido según estado  
✅ **Formularios controlados** - Inputs vinculados al estado  
✅ **Eventos** - onClick, onChange, onSubmit  
✅ **Listas con .map()** - Renderizado dinámico de arrays  
✅ **Axios** - Cliente HTTP para conectar con backend  
✅ **Interceptores** - Añadir token JWT automáticamente  
✅ **Tailwind CSS** - Framework de CSS con clases de utilidad  
✅ **Vite** - Build tool moderno y rápido  
✅ **JavaScript ES6+** - Arrow functions, destructuring, spread, async/await

---

## 🚀 Próximas Mejoras

Posibles extensiones del proyecto:

**Backend:**
- [ ] Roles desde BD - Tabla separada de roles
- [ ] Notificaciones email - Confirmar reservas por correo
- [ ] API de disponibilidad - Endpoint para ver horarios libres
- [ ] Sistema de aprobación - Reservas que requieren autorización
- [ ] Logs con SLF4J - Sistema de auditoría

**Frontend:**
- [ ] Calendario visual - Ver disponibilidad en calendario
- [ ] Estadísticas - Dashboard con gráficas
- [ ] Exportar datos - Descargar PDF o Excel
- [ ] Notificaciones en tiempo real - WebSockets
- [ ] Dark mode - Tema oscuro con Tailwind
- [ ] Paginación - Para listas largas
- [ ] Búsqueda avanzada - Filtros múltiples combinados
- [ ] Perfil de usuario - Página para editar datos

---

**¡Gracias por revisar este proyecto!** 🚀

**Desarrollado por:** Roberto  
**GitHub:** [https://github.com/Roberto7450/ReservasAulasReact](https://github.com/Roberto7450/ReservasAulasReact)  

Si tienes dudas o sugerencias, abre un issue en GitHub.
