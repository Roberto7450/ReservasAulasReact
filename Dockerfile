# ----------------------------------------------------
# STAGE 1: BUILDER - Compila el código (necesita JDK + Maven)
# ----------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS builder

# Instala Maven
RUN apk add --no-cache maven

# Directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para la compilación
# Ya que no incluyes 'target/' en Git, copiamos el código fuente (src) y pom.xml
COPY pom.xml .
COPY src /app/src

# Compila el proyecto y genera el JAR
RUN mvn clean package -DskipTests

# ----------------------------------------------------
# STAGE 2: FINAL - Ejecuta la aplicación (solo necesita JRE)
# ----------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

# Directorio de trabajo
WORKDIR /app

# Copia el JAR compilado de la etapa 'builder'
COPY --from=builder /app/target/*.jar app.jar

# Configuración del puerto para Render
ENV PORT=10000
EXPOSE 10000

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]