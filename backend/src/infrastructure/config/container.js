/**
 * Contenedor de dependencias (composition root).
 * Aqui, y solo aqui, se decide QUE adaptador de persistencia concreto se usa.
 * El resto del codigo (casos de uso, rutas) solo conoce los puertos.
 */
const FirebaseClient = require("../adapters/persistence/firebaseClient");
const FirebaseEmisoraRepository = require("../adapters/persistence/FirebaseEmisoraRepository");
const FirebaseProgramaRepository = require("../adapters/persistence/FirebaseProgramaRepository");
const FirebaseUsuarioRepository = require("../adapters/persistence/FirebaseUsuarioRepository");

const InMemoryEmisoraRepository = require("../adapters/persistence/InMemoryEmisoraRepository");
const InMemoryProgramaRepository = require("../adapters/persistence/InMemoryProgramaRepository");
const InMemoryUsuarioRepository = require("../adapters/persistence/InMemoryUsuarioRepository");

const GuardarEmisora = require("../../application/usecases/emisoras/GuardarEmisora");
const ListarEmisoras = require("../../application/usecases/emisoras/ListarEmisoras");
const ObtenerEmisora = require("../../application/usecases/emisoras/ObtenerEmisora");
const EliminarEmisora = require("../../application/usecases/emisoras/EliminarEmisora");
const ReportarEmisorasPorPais = require("../../application/usecases/emisoras/ReportarEmisorasPorPais");
const ReportarEmisorasPorNumLocutores = require("../../application/usecases/emisoras/ReportarEmisorasPorNumLocutores");

const GuardarPrograma = require("../../application/usecases/programas/GuardarPrograma");
const ListarProgramas = require("../../application/usecases/programas/ListarProgramas");
const ObtenerPrograma = require("../../application/usecases/programas/ObtenerPrograma");
const EliminarPrograma = require("../../application/usecases/programas/EliminarPrograma");
const ReportarProgramasPorEmisora = require("../../application/usecases/programas/ReportarProgramasPorEmisora");
const ReportarProgramasPorGenero = require("../../application/usecases/programas/ReportarProgramasPorGenero");

const RegistrarUsuario = require("../../application/usecases/auth/RegistrarUsuario");
const IniciarSesion = require("../../application/usecases/auth/IniciarSesion");
const RecuperarClave = require("../../application/usecases/auth/RecuperarClave");

/**
 * @param {"firebase"|"memoria"} modoPersistencia
 */
function construirContenedor(modoPersistencia = "firebase") {
  let emisoraRepository;
  let programaRepository;
  let usuarioRepository;

  if (modoPersistencia === "memoria") {
    emisoraRepository = new InMemoryEmisoraRepository();
    programaRepository = new InMemoryProgramaRepository();
    usuarioRepository = new InMemoryUsuarioRepository();
  } else {
    const client = new FirebaseClient(process.env.FIREBASE_BASE_URL);
    emisoraRepository = new FirebaseEmisoraRepository(client);
    programaRepository = new FirebaseProgramaRepository(client);
    usuarioRepository = new FirebaseUsuarioRepository(client);
  }

  const emisorasUsecases = {
    guardarEmisora: new GuardarEmisora(emisoraRepository),
    listarEmisoras: new ListarEmisoras(emisoraRepository),
    obtenerEmisora: new ObtenerEmisora(emisoraRepository),
    eliminarEmisora: new EliminarEmisora(emisoraRepository),
    reportarEmisorasPorPais: new ReportarEmisorasPorPais(emisoraRepository),
    reportarEmisorasPorNumLocutores: new ReportarEmisorasPorNumLocutores(emisoraRepository),
  };

  const programasUsecases = {
    guardarPrograma: new GuardarPrograma(programaRepository, emisoraRepository),
    listarProgramas: new ListarProgramas(programaRepository),
    obtenerPrograma: new ObtenerPrograma(programaRepository),
    eliminarPrograma: new EliminarPrograma(programaRepository),
    reportarProgramasPorEmisora: new ReportarProgramasPorEmisora(programaRepository),
    reportarProgramasPorGenero: new ReportarProgramasPorGenero(programaRepository),
  };

  const authUsecases = {
    registrarUsuario: new RegistrarUsuario(usuarioRepository),
    iniciarSesion: new IniciarSesion(usuarioRepository),
    recuperarClave: new RecuperarClave(usuarioRepository),
  };

  return {
    emisoraRepository,
    programaRepository,
    usuarioRepository,
    emisorasUsecases,
    programasUsecases,
    authUsecases,
  };
}

module.exports = construirContenedor;
