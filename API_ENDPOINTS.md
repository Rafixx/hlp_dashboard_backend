# API Endpoints - HLP Dashboard Backend

Esta documentación describe todos los endpoints disponibles en la API del HLP Dashboard Backend, organizados por módulos funcionales.

## Configuración Base

**URL Base:** `http://localhost:3000/api`

**Headers requeridos:**
```
Content-Type: application/json
Authorization: Bearer <token> (para endpoints protegidos)
```

---

## 🔐 Autenticación

### POST /api/login
**Descripción:** Autenticar usuario en el sistema
**Método:** POST
**Parámetros del body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Respuesta exitosa:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "number",
    "username": "string",
    "rol": "string"
  }
}
```

---

## 👥 Gestión de Usuarios

### GET /api/usuarios
**Descripción:** Obtener lista de todos los usuarios
**Método:** GET
**Respuesta:** Array de objetos usuario

### GET /api/usuarios/:id
**Descripción:** Obtener usuario por ID
**Método:** GET
**Parámetros:** 
- `id` (path): ID del usuario

### POST /api/usuarios
**Descripción:** Crear nuevo usuario
**Método:** POST
**Body:** Objeto con datos del usuario

### PUT /api/usuarios/:id
**Descripción:** Actualizar usuario existente
**Método:** PUT
**Parámetros:** 
- `id` (path): ID del usuario

### DELETE /api/usuarios/:id
**Descripción:** Eliminar usuario
**Método:** DELETE
**Parámetros:** 
- `id` (path): ID del usuario

---

## 📊 ADX - Administración y Gestión

### GET /api/adx/propuestasCitados/:nhc
**Descripción:** Obtener propuestas de citas para pacientes citados
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Lista de propuestas con información de citas, prestaciones y técnicas

### GET /api/adx/propuestasDadosDeAlta/:nhc
**Descripción:** Obtener propuestas para pacientes dados de alta
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Lista de propuestas con hospitales destino, servicios, fechas y gestores

### GET /api/adx/propuestasTramitadas/:nhc
**Descripción:** Obtener propuestas tramitadas por NHC
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Lista de propuestas en tramitación con información de origen, destino y estado

### GET /api/adx/altasXDpto
**Descripción:** Obtener altas por departamento en un rango de fechas
**Método:** GET
**Query Parameters:**
- `desde` (required): Fecha desde (YYYY-MM-DD)
- `hasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de altas con SIP, paciente, hospital, fecha de alta y destino

### GET /api/adx/pacientesIngresados
**Descripción:** Obtener lista de pacientes actualmente ingresados
**Método:** GET
**Respuesta:** Lista de pacientes con NHC, SIP, cama, paciente, municipio, médico, servicio y fecha de ingreso

### GET /api/adx/pendientesCita
**Descripción:** Obtener pacientes pendientes de cita
**Método:** GET
**Respuesta:** Lista de pacientes con información de cama, servicio destino, prestación y estado

### GET /api/adx/prestamosHC
**Descripción:** Obtener información sobre préstamos de historias clínicas
**Método:** GET
**Respuesta:** Lista de préstamos con datos de demora en días

### GET /api/adx/prestamosPdtes
**Descripción:** Obtener préstamos pendientes
**Método:** GET
**Respuesta:** Lista de números de historia clínica con préstamos pendientes

---

## 🏥 ENF - Enfermería

### GET /api/enf/lesionesUPP
**Descripción:** Obtener lesiones por Úlceras Por Presión (UPP)
**Método:** GET
**Respuesta:** Lista de lesiones con información detallada:
```json
[
  {
    "NHC": "string",
    "cama": "string",
    "FECHA_REGISTRO": "YYYY/MM/DD",
    "tip_ulc_enf": "string",
    "les_localizacion": "string",
    "ulcera_lado": "string",
    "grado": "string",
    "les_procedencia": "string",
    "SERV_MED": "string"
  }
]
```

---

## 🏃‍♂️ FISIO - Fisioterapia

### GET /api/fisio/intColabFisioPaciente/:nhc
**Descripción:** Obtener intervenciones de colaboración de fisioterapia por paciente
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Lista de intervenciones de fisioterapia para el paciente específico

### GET /api/fisio/intColabFisio
**Descripción:** Obtener todas las intervenciones de colaboración de fisioterapia
**Método:** GET
**Respuesta:** Lista completa de intervenciones de fisioterapia

---

## 🏥 GEN - General

### GET /api/gen/cuidadores
**Descripción:** Obtener lista de cuidadores
**Método:** GET
**Respuesta:** Lista de cuidadores con información de contacto:
```json
[
  {
    "PLANTA": "string",
    "CAMA": "string",
    "NHC": "string",
    "SIP": "string",
    "PACIENTE": "string",
    "CUIDADOR": "string",
    "TELF_1": "string",
    "TELF_2": "string",
    "TELF_3": "string"
  }
]
```

### GET /api/gen/problemasAsociados/:nhc
**Descripción:** Obtener problemas asociados a un paciente
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Lista de problemas médicos, de enfermería y transversales del paciente

### GET /api/gen/escalasRealizadas/:numicu
**Descripción:** Obtener escalas realizadas por episodio
**Método:** GET
**Parámetros:**
- `numicu` (path): Número de episodio
**Respuesta:** Lista de escalas con resultados e interpretaciones

### GET /api/gen/heridas
**Descripción:** Obtener información sobre heridas/lesiones
**Método:** GET
**Respuesta:** Lista de heridas con información detallada:
```json
[
  {
    "numicu": "string",
    "cama": "string",
    "fecha_registro": "YYYY/MM/DD",
    "clase_herida": "string",
    "tipo": "string",
    "localizacion": "string",
    "lateralidad": "string",
    "grado": "string",
    "procedencia": "string",
    "seccion_realizadora": "string",
    "profesioal": "string",
    "perfil_profesional": "string"
  }
]
```

### GET /api/gen/lesiones
**Descripción:** Obtener informes de lesiones
**Método:** GET
**Respuesta:** Lista de informes de lesiones con fechas de creación, modificación y valoración

### GET /api/gen/procedimientos
**Descripción:** Obtener procedimientos médicos realizados
**Método:** GET
**Respuesta:** Lista de procedimientos con códigos CIE, fechas de registro y profesional responsable

### GET /api/gen/terapeutica
**Descripción:** Obtener tratamientos terapéuticos activos
**Método:** GET
**Respuesta:** Lista de tratamientos con nemónicos, estados, prescripciones y tipos de medicación

### GET /api/gen/aisladosAhora
**Descripción:** Obtener pacientes actualmente aislados
**Método:** GET
**Respuesta:** Lista de pacientes aislados con tipo de aislamiento:
```json
[
  {
    "NHC": "string",
    "SIP": "string",
    "nombre": "string",
    "cama": "string",
    "tipo_aislamiento": "string"
  }
]
```

### GET /api/gen/escalas
**Descripción:** Obtener escalas realizadas en un rango de fechas
**Método:** GET
**Query Parameters:**
- `dtDesde` (required): Fecha desde (YYYY-MM-DD)
- `dtHasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de escalas con resultados, puntuaciones e interpretaciones

---

## 💊 MED - Medicina

### GET /api/med/informeTerapeutica/:nhc
**Descripción:** Obtener informe terapéutico por paciente
**Método:** GET
**Parámetros:**
- `nhc` (path): Número de Historia Clínica
**Respuesta:** Información terapéutica detallada del paciente

---

## 👨‍⚕️ TSC - Trabajo Social Clínico

### GET /api/tsc/listadoIngresados
**Descripción:** Obtener listado de pacientes ingresados para trabajo social
**Método:** GET
**Respuesta:** Lista de pacientes ingresados con información relevante para trabajo social

---

## 🛡️ PREVE - Medicina Preventiva

### GET /api/preve/aislaIncidencias
**Descripción:** Obtener incidencias de aislamiento por rango de fechas
**Método:** GET
**Query Parameters:**
- `dtDesde` (required): Fecha desde (YYYY-MM-DD)
- `dtHasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de incidencias de aislamiento en el período especificado

### GET /api/preve/aislaPrevalencia
**Descripción:** Obtener prevalencia de aislamientos por rango de fechas
**Método:** GET
**Query Parameters:**
- `dtDesde` (required): Fecha desde (YYYY-MM-DD)
- `dtHasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de datos de prevalencia de aislamientos

### GET /api/preve/colonoPrevalente
**Descripción:** Obtener datos de colonización prevalente por rango de fechas
**Método:** GET
**Query Parameters:**
- `dtDesde` (required): Fecha desde (YYYY-MM-DD)
- `dtHasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de datos de colonización prevalente

### GET /api/preve/frotisPendientes
**Descripción:** Obtener frotis pendientes de procesamiento
**Método:** GET
**Respuesta:** Lista de frotis pendientes con información de pacientes y fechas

### GET /api/preve/heridas
**Descripción:** Obtener información sobre heridas desde medicina preventiva
**Método:** GET
**Respuesta:** Lista de heridas con datos relevantes para medicina preventiva

### GET /api/preve/infecciones
**Descripción:** Obtener información sobre infecciones activas
**Método:** GET
**Respuesta:** Lista de infecciones con detalles clínicos y epidemiológicos

### GET /api/preve/intervencioinesColaboracion
**Descripción:** Obtener intervenciones de colaboración en medicina preventiva
**Método:** GET
**Respuesta:** Lista de intervenciones colaborativas entre servicios

### GET /api/preve/vacunas
**Descripción:** Obtener información de vacunas administradas por rango de fechas
**Método:** GET
**Query Parameters:**
- `dtDesde` (required): Fecha desde (YYYY-MM-DD)
- `dtHasta` (required): Fecha hasta (YYYY-MM-DD)
**Respuesta:** Lista de vacunas administradas en el período especificado

### GET /api/preve/vacunasFechaInicio
**Descripción:** Obtener vacunas programadas por fecha de inicio
**Método:** GET
**Respuesta:** Lista de vacunas con sus fechas de inicio programadas

### GET /api/preve/vacunasPendientes
**Descripción:** Obtener vacunas pendientes de administración
**Método:** GET
**Respuesta:** Lista de vacunas pendientes con información de pacientes y fechas programadas

---

## ⚠️ Manejo de Errores

Todos los endpoints devuelven errores en el siguiente formato:

```json
{
  "error": "Descripción del error",
  "message": "Mensaje detallado",
  "statusCode": 400
}
```

### Códigos de estado comunes:
- **200**: Operación exitosa
- **400**: Error en la solicitud (parámetros faltantes o inválidos)
- **401**: No autorizado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## 📝 Notas Importantes

1. **Formatos de fecha:** Usar formato YYYY-MM-DD para parámetros de fecha
2. **Parámetros requeridos:** Los parámetros marcados como `(required)` son obligatorios
3. **Autenticación:** Algunos endpoints pueden requerir autenticación
4. **Paginación:** Consultar con el equipo de backend si se requiere implementar paginación para listas grandes
5. **Filtros adicionales:** Algunos endpoints podrían soportar filtros adicionales no documentados

---

## 🚀 Ejemplos de Uso

### Obtener cuidadores
```javascript
fetch('http://localhost:3000/api/gen/cuidadores')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Obtener escalas por rango de fechas
```javascript
fetch('http://localhost:3000/api/gen/escalas?dtDesde=2024-01-01&dtHasta=2024-12-31')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Obtener altas por departamento
```javascript
fetch('http://localhost:3000/api/adx/altasXDpto?desde=2024-01-01&hasta=2024-01-31')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Obtener vacunas por rango de fechas
```javascript
fetch('http://localhost:3000/api/preve/vacunas?dtDesde=2024-01-01&dtHasta=2024-12-31')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Obtener frotis pendientes
```javascript
fetch('http://localhost:3000/api/preve/frotisPendientes')
  .then(response => response.json())
  .then(data => console.log(data));
```