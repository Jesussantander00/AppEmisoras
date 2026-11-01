/**
 * Middleware final: traduce errores de dominio/aplicacion a respuestas HTTP.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || (/obligatorio|invalido|numerico/i.test(err.message) ? 400 : 500);
  res.status(status).json({ error: err.message || "Error interno del servidor" });
}

module.exports = errorHandler;
