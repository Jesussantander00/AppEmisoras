package com.jesussantander.appemisoras.model

data class LoginRequest(val email: String, val clave: String)
data class LoginResponse(val email: String = "", val nombre: String = "")
data class RegistroRequest(val email: String, val clave: String, val nombre: String)

data class Emisora(
    val id: String = "",
    val nombre: String = "",
    val canal: String = "",
    val bandaFM: String = "",
    val bandaAM: String = "",
    val numLocutores: String = "",
    val genero: String = "",
    val horario: String = "",
    val patrocinador: String = "",
    val pais: String = "",
    val descripcion: String = "",
    val numPrograma: String = "",
    val numCiudades: String = ""
)

data class Programa(
    val id: String = "",
    val nombre: String = "",
    val emisoraId: String = "",
    val conductor: String = "",
    val horarioInicio: String = "",
    val horarioFin: String = "",
    val genero: String = "",
    val duracionMinutos: String = "",
    val descripcion: String = "",
    val diasTransmision: String = ""
)
