# AppEmisoras

Aplicación móvil Android para la gestión de emisoras de radio y sus programas, desarrollada en **Kodular Creator** con backend en **Firebase Realtime Database** (NoSQL).

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

## Arquitectura

- **Kodular Creator**: entorno de desarrollo visual basado en MIT App Inventor.
- **Firebase Realtime Database**: base de datos NoSQL en la nube.
- **Componente Web (REST)**: toda la comunicación con Firebase se hace mediante peticiones HTTP (GET/PUT/DELETE) al endpoint `https://<proyecto>.firebaseio.com/<ruta>.json`, construyendo y decodificando el JSON manualmente. Se usó este enfoque en lugar del componente nativo `FirebaseDB` porque este último está marcado como obsoleto en Kodular y bloquea la exportación del `.apk`.
- **TinyDB**: almacenamiento local para mantener la sesión iniciada.

## Estructura del repositorio

```
AppEmisoras/
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
├── AppEmisoras_corregido.aia      # Proyecto empaquetado, listo para importar en Kodular Creator
└── README.md
```

## Cómo abrir el proyecto

1. Entra a [Kodular Creator](https://creator.kodular.io).
2. Menú **Project → Import project (.aia) from my computer**.
3. Selecciona el archivo `AppEmisoras_corregido.aia` de este repositorio.

## Base de datos (Firebase)

```
appemisoras-e019e-default-rtdb/
├─ usuarios/{correo_normalizado} → { nombre, email, clave }
├─ emisoras/{id}                 → { 13 campos }
└─ programas/{id}                → { 10 campos, emisoraId (FK → emisoras/{id}) }
```

El correo se usa como llave del nodo `usuarios/`, normalizado reemplazando `@` por `_at_` y `.` por `_dot_` (Firebase no permite esos caracteres en las llaves).

## Cuenta de prueba

- Correo: `prueba@correo.com`
- Contraseña: `Prueba123`

## Autor

Jesús Daniel Quintana Santander
