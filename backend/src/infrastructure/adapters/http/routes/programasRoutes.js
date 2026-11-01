const { Router } = require("express");
const asyncHandler = require("../asyncHandler");
const listaAObjeto = require("../listaAObjeto");

function programasRoutes(usecases) {
  const router = Router();
  const {
    listarProgramas,
    obtenerPrograma,
    guardarPrograma,
    eliminarPrograma,
    reportarProgramasPorEmisora,
    reportarProgramasPorGenero,
  } = usecases;

  router.get(
    "/reportes/por-emisora",
    asyncHandler(async (req, res) => {
      const resultado = await reportarProgramasPorEmisora.ejecutar(req.query.emisoraId);
      res.json(listaAObjeto(resultado));
    })
  );

  router.get(
    "/reportes/por-genero",
    asyncHandler(async (req, res) => {
      const resultado = await reportarProgramasPorGenero.ejecutar(req.query.genero);
      res.json(listaAObjeto(resultado));
    })
  );

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      res.json(listaAObjeto(await listarProgramas.ejecutar()));
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      res.json(await obtenerPrograma.ejecutar(req.params.id));
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const programa = await guardarPrograma.ejecutar(req.body);
      res.status(201).json(programa);
    })
  );

  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const programa = await guardarPrograma.ejecutar({ ...req.body, id: req.params.id });
      res.json(programa);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      res.json(await eliminarPrograma.ejecutar(req.params.id));
    })
  );

  return router;
}

module.exports = programasRoutes;
