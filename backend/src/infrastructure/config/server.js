require("dotenv").config();

const construirContenedor = require("./container");
const construirApp = require("./app");

const modoPersistencia = process.env.PERSISTENCIA || "firebase";
const contenedor = construirContenedor(modoPersistencia);
const app = construirApp(contenedor);

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`AppEmisoras backend escuchando en puerto ${PUERTO} (persistencia: ${modoPersistencia})`);
});
