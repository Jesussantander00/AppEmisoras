/**
 * Pruebas de integracion ligeras, sin frameworks externos.
 * Usan el adaptador en memoria (PERSISTENCIA=memoria) para no depender de
 * red saliente hacia Firebase, que no es necesaria para validar que las
 * rutas, casos de uso y reglas de dominio funcionan correctamente.
 */
const fetch = require("node-fetch");
const construirContenedor = require("../src/infrastructure/config/container");
const construirApp = require("../src/infrastructure/config/app");

let fallos = 0;
let pruebas = 0;

function assert(cond, mensaje) {
  pruebas++;
  if (!cond) {
    fallos++;
    console.error(`FALLO: ${mensaje}`);
  } else {
    console.log(`OK: ${mensaje}`);
  }
}

async function main() {
  const contenedor = construirContenedor("memoria");
  const app = construirApp(contenedor);
  const server = app.listen(0);
  const puerto = server.address().port;
  const base = `http://localhost:${puerto}`;

  // --- Emisoras CRUD ---
  let res = await fetch(`${base}/api/emisoras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "T-001",
      nombre: "Radio Test",
      canal: "1",
      bandaFM: "100.0",
      bandaAM: "",
      numLocutores: "5",
      genero: "Test",
      horario: "24h",
      patrocinador: "N/A",
      pais: "Colombia",
      descripcion: "prueba",
      numPrograma: "1",
      numCiudades: "1",
    }),
  });
  assert(res.status === 201, "POST /api/emisoras crea una emisora (201)");

  res = await fetch(`${base}/api/emisoras/T-001`);
  let body = await res.json();
  assert(res.status === 200 && body.nombre === "Radio Test", "GET /api/emisoras/:id devuelve la emisora creada");

  res = await fetch(`${base}/api/emisoras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert(res.status === 400, "POST /api/emisoras sin id/nombre responde 400");

  res = await fetch(`${base}/api/emisoras/T-001`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Radio Test Editada", pais: "Colombia", numLocutores: "9" }),
  });
  body = await res.json();
  assert(res.status === 200 && body.nombre === "Radio Test Editada", "PUT /api/emisoras/:id actualiza la emisora");

  // --- Reportes de Emisoras (las respuestas vienen como objeto {id: {...}}, igual que Firebase) ---
  res = await fetch(`${base}/api/emisoras/reportes/por-pais?pais=Colombia`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1, "Reporte por pais filtra correctamente");

  res = await fetch(`${base}/api/emisoras/reportes/por-locutores?minimo=5`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1, "Reporte por numLocutores>=5 filtra correctamente");

  res = await fetch(`${base}/api/emisoras`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1 && body["T-001"], "GET /api/emisoras devuelve un objeto {id: {...}}");

  // --- Programas (requiere FK valida) ---
  res = await fetch(`${base}/api/programas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "PT-001",
      nombre: "Programa Test",
      emisoraId: "NO-EXISTE",
      conductor: "x",
      horarioInicio: "08:00",
      horarioFin: "09:00",
      genero: "Test",
      duracionMinutos: "60",
      descripcion: "",
      diasTransmision: "Lunes",
    }),
  });
  assert(res.status === 400, "POST /api/programas con emisoraId inexistente responde 400");

  res = await fetch(`${base}/api/programas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "PT-001",
      nombre: "Programa Test",
      emisoraId: "T-001",
      conductor: "x",
      horarioInicio: "08:00",
      horarioFin: "09:00",
      genero: "Noticias",
      duracionMinutos: "60",
      descripcion: "",
      diasTransmision: "Lunes",
    }),
  });
  assert(res.status === 201, "POST /api/programas con emisoraId valido crea el programa (201)");

  res = await fetch(`${base}/api/programas/reportes/por-emisora?emisoraId=T-001`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1, "Reporte de programas por emisora filtra correctamente");

  res = await fetch(`${base}/api/programas/reportes/por-genero?genero=Noticias`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1, "Reporte de programas por genero filtra correctamente");

  res = await fetch(`${base}/api/programas`);
  body = await res.json();
  assert(res.status === 200 && Object.keys(body).length === 1 && body["PT-001"], "GET /api/programas devuelve un objeto {id: {...}}");

  res = await fetch(`${base}/api/programas/PT-001`, { method: "DELETE" });
  assert(res.status === 200, "DELETE /api/programas/:id elimina el programa");

  res = await fetch(`${base}/api/emisoras/T-001`, { method: "DELETE" });
  assert(res.status === 200, "DELETE /api/emisoras/:id elimina la emisora");

  res = await fetch(`${base}/api/emisoras/T-001`);
  assert(res.status === 404, "GET /api/emisoras/:id tras eliminar responde 404");

  // --- Auth ---
  res = await fetch(`${base}/api/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "prueba@correo.com", clave: "Prueba123", nombre: "Usuario Prueba" }),
  });
  assert(res.status === 201, "POST /api/auth/registro crea el usuario (201)");

  res = await fetch(`${base}/api/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "prueba@correo.com", clave: "Prueba123" }),
  });
  assert(res.status === 409, "POST /api/auth/registro con correo repetido responde 409");

  res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "prueba@correo.com", clave: "incorrecta" }),
  });
  assert(res.status === 401, "POST /api/auth/login con clave incorrecta responde 401");

  res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "prueba@correo.com", clave: "Prueba123" }),
  });
  assert(res.status === 200, "POST /api/auth/login con credenciales correctas responde 200");

  res = await fetch(`${base}/api/auth/recuperar-clave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "prueba@correo.com" }),
  });
  body = await res.json();
  assert(res.status === 200 && body.clave === "Prueba123", "POST /api/auth/recuperar-clave devuelve la clave del usuario");

  server.close();

  console.log(`\n${pruebas - fallos}/${pruebas} pruebas pasaron.`);
  if (fallos > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error ejecutando las pruebas:", err);
  process.exit(1);
});
