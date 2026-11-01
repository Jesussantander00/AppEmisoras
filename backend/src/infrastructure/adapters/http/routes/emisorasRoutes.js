const { Router } = require("express");
const asyncHandler = require("../asyncHandler");
const listaAObjeto = require("../listaAObjeto");

/**
 * Adaptador de entrada HTTP para Emisoras.
 * Recibe los casos de uso ya construidos (inyeccion de dependencias) y solo
 * traduce peticiones HTTP <-> llamadas a la capa de aplicacion.
 */
function emisorasRoutes(usecases) {
  const router = Router();
  const {
    listarEmisoras,
    obtenerEmisora,
    guardarEmisora,
    eliminarEmisora,
    reportarEmisorasPorPais,
    reportarEmisorasPorNumLocutores,
  } = usecases;

  // Reportes primero para que no choquen con /:id
  router.get(
    "/reportes/por-pais",
    asyncHandler(async (req, res) => {
      const resultado = await reportarEmisorasPorPais.ejecutar(req.query.pais);
      res.json(listaAObjeto(resultado));
    })
  );

  router.get(
    "/reportes/por-locutores",
    asyncHandler(async (req, res) => {
      const resultado = await reportarEmisorasPorNumLocutores.ejecutar(req.query.minimo);
      res.json(listaAObjeto(resultado));
    })
  );

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const emisoras = await listarEmisoras.ejecutar();
      // Se devuelve como objeto {id: {...}} para imitar el formato de
      // Firebase, que es el que ya esperan las pantallas de Kodular.
      res.json(listaAObjeto(emisoras));
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const emisora = await obtenerEmisora.ejecutar(req.params.id);
      res.json(emisora);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const emisora = await guardarEmisora.ejecutar(req.body);
      res.status(201).json(emisora);
    })
  );

  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const emisora = await guardarEmisora.ejecutar({ ...req.body, id: req.params.id });
      res.json(emisora);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const resultado = await eliminarEmisora.ejecutar(req.params.id);
      res.json(resultado);
    })
  );

  return router;
}

module.exports = emisorasRoutes;
