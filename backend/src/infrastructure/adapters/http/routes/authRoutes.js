const { Router } = require("express");
const asyncHandler = require("../asyncHandler");

function authRoutes(usecases) {
  const router = Router();
  const { registrarUsuario, iniciarSesion, recuperarClave } = usecases;

  router.post(
    "/registro",
    asyncHandler(async (req, res) => {
      const usuario = await registrarUsuario.ejecutar(req.body);
      res.status(201).json(usuario);
    })
  );

  router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const usuario = await iniciarSesion.ejecutar(req.body);
      res.json(usuario);
    })
  );

  router.post(
    "/recuperar-clave",
    asyncHandler(async (req, res) => {
      const resultado = await recuperarClave.ejecutar(req.body.email);
      res.json(resultado);
    })
  );

  return router;
}

module.exports = authRoutes;
