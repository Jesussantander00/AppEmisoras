const express = require("express");
const cors = require("cors");

const emisorasRoutes = require("../adapters/http/routes/emisorasRoutes");
const programasRoutes = require("../adapters/http/routes/programasRoutes");
const authRoutes = require("../adapters/http/routes/authRoutes");
const errorHandler = require("../adapters/http/errorHandler");

function construirApp(contenedor) {
  const app = express();
  app.use(cors());
  // El componente Web de Kodular no siempre envia Content-Type: application/json
  // (PutText/PostText suelen mandar text/plain). Aceptamos cualquier body como
  // JSON en vez de exigir el header exacto, para no depender de como Kodular
  // arme la peticion.
  app.use(express.json({ type: () => true }));

  app.get("/", (req, res) => {
    res.json({
      app: "AppEmisoras backend",
      arquitectura: "hexagonal",
      endpoints: ["/api/emisoras", "/api/programas", "/api/auth"],
    });
  });

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/emisoras", emisorasRoutes(contenedor.emisorasUsecases));
  app.use("/api/programas", programasRoutes(contenedor.programasUsecases));
  app.use("/api/auth", authRoutes(contenedor.authUsecases));

  app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
  app.use(errorHandler);

  return app;
}

module.exports = construirApp;
