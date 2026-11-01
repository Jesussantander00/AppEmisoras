# AppEmisoras — Backend (Corte 2)

Backend REST para la app **AppEmisoras**, construido en **Node.js + Express** siguiendo
**arquitectura hexagonal (puertos y adaptadores)**. Reemplaza las llamadas directas desde
Kodular a Firebase: ahora Kodular le habla a esta API, y esta API es la única que conoce a Firebase.

## Arquitectura

```
src/
├── domain/                     # Núcleo: no depende de nada externo
│   ├── entities/                Emisora, Programa, Usuario (con sus reglas de validación)
│   └── ports/                   Interfaces (contratos) que debe cumplir cualquier adaptador de persistencia
├── application/                 Casos de uso (orquestan el dominio, no saben de Express ni de Firebase)
│   └── usecases/
│       ├── emisoras/             Guardar, Listar, Obtener, Eliminar, 2 reportes
│       ├── programas/            Guardar, Listar, Obtener, Eliminar, 2 reportes
│       └── auth/                 Registrar, IniciarSesion, RecuperarClave
└── infrastructure/              Detalles técnicos, intercambiables
    ├── adapters/
    │   ├── persistence/          FirebaseXxxRepository (producción) e InMemoryXxxRepository (pruebas)
    │   └── http/                 Rutas Express (adaptador de entrada) + manejo de errores
    └── config/                   container.js (inyección de dependencias) y app.js/server.js (bootstrap)
```

La regla de la arquitectura hexagonal se cumple así: los casos de uso (`application/`) solo
conocen los **puertos** (`domain/ports/*Repository.js`), nunca una implementación concreta.
`container.js` es el único lugar donde se decide qué adaptador real se conecta (Firebase, o
en memoria para pruebas) — cambiar de Firebase a otra base de datos el día de mañana solo
implica escribir un nuevo adaptador que cumpla el mismo puerto, sin tocar casos de uso ni rutas.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Chequeo de salud |
| GET | `/api/emisoras` | Listar emisoras |
| GET | `/api/emisoras/:id` | Obtener una emisora |
| POST | `/api/emisoras` | Crear emisora (body JSON con los 13 campos) |
| PUT | `/api/emisoras/:id` | Actualizar emisora |
| DELETE | `/api/emisoras/:id` | Eliminar emisora |
| GET | `/api/emisoras/reportes/por-pais?pais=Colombia` | Reporte 1: emisoras de un país |
| GET | `/api/emisoras/reportes/por-locutores?minimo=5` | Reporte 2: emisoras con N o más locutores |
| GET | `/api/programas` | Listar programas |
| GET | `/api/programas/:id` | Obtener un programa |
| POST | `/api/programas` | Crear programa (valida que `emisoraId` exista) |
| PUT | `/api/programas/:id` | Actualizar programa |
| DELETE | `/api/programas/:id` | Eliminar programa |
| GET | `/api/programas/reportes/por-emisora?emisoraId=EM-101` | Reporte 1: programas de una emisora |
| GET | `/api/programas/reportes/por-genero?genero=Noticias` | Reporte 2: programas por género |
| POST | `/api/auth/registro` | Registrar usuario `{email, password, nombre}` |
| POST | `/api/auth/login` | Iniciar sesión `{email, password}` |
| POST | `/api/auth/recuperar-clave` | Recuperar clave `{email}` → devuelve la clave para que la app abra el correo del dispositivo |

## Correr en local

```bash
npm install
cp .env.example .env     # ajusta si hace falta
npm start                # usa Firebase por defecto (PERSISTENCIA=firebase)
```

Para correr las pruebas automáticas (no requieren red, usan un repositorio en memoria):

```bash
npm test
```

## Despliegue en Render (gratis, con auto-deploy)

1. Sube este proyecto a tu repositorio de GitHub (ver instrucciones en el README raíz del repo).
2. Entra a [render.com](https://render.com) y crea una cuenta (puedes usar "Sign in with GitHub").
3. **New +** → **Web Service** → conecta el repositorio de GitHub.
4. Render detecta automáticamente el archivo `render.yaml` incluido aquí y configura:
   - Build command: `npm install`
   - Start command: `npm start`
   - Variables de entorno `PERSISTENCIA` y `FIREBASE_BASE_URL`
5. Click **Create Web Service**. Al terminar el primer deploy, Render te da una URL pública como
   `https://appemisoras-backend.onrender.com`.
6. A partir de ahí, **cada `git push`/merge a la rama principal (`main`) vuelve a desplegar
   automáticamente** (esto es lo que Render llama *auto-deploy*, ya viene activado en `render.yaml`
   con `autoDeploy: true`) — no hay que configurar GitHub Actions aparte.

> Nota: el plan gratuito de Render "duerme" el servicio tras ~15 minutos sin tráfico; la primera
> petición después de dormido puede tardar unos segundos en responder mientras despierta. Es
> normal y no es un error de la app.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que escucha el servidor (Render la asigna sola) |
| `PERSISTENCIA` | `firebase` (producción) o `memoria` (pruebas locales sin red) |
| `FIREBASE_BASE_URL` | URL base de la Realtime Database (`https://appemisoras-e019e-default-rtdb.firebaseio.com`) |
