# AppEmisoras

Aplicación móvil Android para la gestión de emisoras de radio y sus programas, desarrollada en **Kodular Creator**.

- **Corte 1**: persistencia local en el dispositivo.
- **Corte 2** (estado actual de este repositorio): persistencia en una **API REST propia**, construida en
  **Node.js + Express con arquitectura hexagonal** (carpeta [`backend/`](./backend)), que internamente usa
  **Firebase Realtime Database** como motor de almacenamiento. Kodular ya no le habla a Firebase directamente:
  le habla a este backend, y es el backend el único que conoce a Firebase.

## Descripción

AppEmisoras permite:

- Registro de usuarios, inicio de sesión y recuperación de contraseña por correo electrónico.
- CRUD completo (crear, leer, actualizar, eliminar) de dos entidades relacionadas:
  - **Emisoras** (13 campos): id, nombre, canal, bandaFM, bandaAM, numLocutores, genero, horario, patrocinador, pais, descripcion, numPrograma, numCiudades.
  - **Programas** (10 campos): id, nombre, emisoraId (FK → Emisoras), conductor, horarioInicio, horarioFin, genero, duracionMinutos, descripcion, diasTransmision.
- 4 reportes parametrizados (2 por entidad):
  - Emisoras por país.
  - Emisoras con más de N locutores.
  - Programas de una emisora específica.
  - Programas por género.
- Uso de 2 sensores del dispositivo:
  - **LocationSensor** (GPS): autocompleta el campo "país" al registrar una emisora.
  - **AccelerometerSensor**: agitar el teléfono refresca la lista de emisoras/programas.

## Arquitectura

- **Kodular Creator**: entorno de desarrollo visual basado en MIT App Inventor (frontend móvil).
- **Backend propio** (`backend/`): Node.js + Express, **arquitectura hexagonal** (dominio / aplicación /
  infraestructura). Ver [`backend/README.md`](./backend/README.md) para el detalle completo de capas y endpoints.
- **Firebase Realtime Database**: motor de persistencia usado por el backend (no por Kodular directamente).
- **Render**: donde se despliega el backend, con auto-deploy en cada push a `main`.
- **Componente Web de Kodular**: ahora apunta a la URL pública del backend en Render, no a Firebase.

## Estructura del repositorio

```
AppEmisoras/
├── backend/                      # API REST (arquitectura hexagonal) — Corte 2
│   ├── src/domain/                entidades y puertos (contratos de persistencia)
│   ├── src/application/usecases/  casos de uso (CRUD + reportes + auth)
│   ├── src/infrastructure/        adaptadores Express (HTTP) y Firebase (persistencia)
│   ├── render.yaml                 configuración de despliegue en Render
│   └── README.md                   instrucciones de instalación y despliegue del backend
├── emisoras/
│   ├── AppEmisoras_corregido.aia  # Proyecto empaquetado, listo para importar en Kodular Creator
│   └── AppEmisoras_corregido.apk  # App instalable en Android (se agrega tras exportar desde Kodular)
├── src_kodular/                  # Proyecto Kodular sin comprimir (formato .aia extraído)
│   ├── src/io/kodular/.../AppEmisoras/
│   │   ├── Screen1.scm / .bky            (Login)
│   │   ├── Registro.scm / .bky           (Registro de usuario)
│   │   ├── RecuperarClave.scm / .bky     (Recuperación de contraseña)
│   │   ├── MenuPrincipal.scm / .bky      (Menú principal)
│   │   ├── EmisorasLista.scm / .bky      (Listado de emisoras)
│   │   ├── EmisoraFormulario.scm / .bky  (CRUD de una emisora)
│   │   ├── ProgramasLista.scm / .bky     (Listado de programas)
│   │   ├── ProgramaFormulario.scm / .bky (CRUD de un programa)
│   │   ├── ReporteEmisoras.scm / .bky    (Reportes de emisoras)
│   │   └── ReporteProgramas.scm / .bky   (Reportes de programas)
│   └── youngandroidproject/
└── README.md
```

## Cómo abrir el proyecto

1. Entra a [Kodular Creator](https://creator.kodular.io).
2. Menú **Project → Import project (.aia) from my computer**.
3. Selecciona el archivo `emisoras/AppEmisoras_corregido.aia` de este repositorio.

## Instalar la app directamente (sin Kodular)

Una vez el backend esté desplegado en Render, exporta el `.apk` desde Kodular (**Build → App (provides QR code for .apk)**)
y colócalo también en `emisoras/` junto al `.aia`, para poder instalarlo directo en un dispositivo Android o en un
emulador como BlueStacks sin pasar por Kodular.

## Base de datos (Firebase)

```
appemisoras-e019e-default-rtdb/
├─ usuarios/{correo_normalizado} → { nombre, email, clave }
├─ emisoras/{id}                 → { 13 campos }
└─ programas/{id}                → { 10 campos, emisoraId (FK → emisoras/{id}) }
```

El correo se usa como llave del nodo `usuarios/`, normalizado reemplazando `@` por `_at_` y `.` por `_dot_` (Firebase no permite esos caracteres en las llaves).

## Backend y despliegue (Corte 2)

El backend completo, sus pruebas automáticas y las instrucciones de despliegue en Render están en
[`backend/README.md`](./backend/README.md). Puntos clave:

- Como `render.yaml` vive dentro de `backend/` (no en la raíz del repo), al crear el servicio en Render
  hay que configurar el **Root Directory** como `backend` (Render lo pide al conectar el repositorio).
- **Importante**: todas las pantallas de Kodular (`src_kodular/` y el `.aia` en `emisoras/`) ya apuntan a
  `https://appemisoras-backend.onrender.com` como URL del backend. Esa es la URL que debe quedar cuando
  se cree el servicio en Render (mismo nombre de servicio: `appemisoras-backend`, ya está en `render.yaml`).
  Si Render asigna un nombre distinto (por ejemplo porque ese ya estaba tomado), hay que reemplazar esa URL
  por la real en los 9 archivos `.bky` que usan `Web1` antes de volver a exportar el `.apk` — avísame la URL
  real y te regenero el `.aia` con el reemplazo ya hecho.

## Cuenta de prueba

- Correo: `prueba@correo.com`
- Contraseña: `Prueba123`

## Autor

Jesús Daniel Quintana Santander
