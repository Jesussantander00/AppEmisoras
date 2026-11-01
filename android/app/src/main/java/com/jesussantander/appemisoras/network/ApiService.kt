package com.jesussantander.appemisoras.network

import com.jesussantander.appemisoras.model.Emisora
import com.jesussantander.appemisoras.model.LoginRequest
import com.jesussantander.appemisoras.model.LoginResponse
import com.jesussantander.appemisoras.model.Programa
import com.jesussantander.appemisoras.model.RegistroRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Contrato de la API REST ya desplegada en Render (backend Node/Express del
 * Corte 2, carpeta backend/ del repositorio). La app nativa de Android
 * Studio (Corte 3) consume estos mismos endpoints: no se tocó el backend.
 */
interface ApiService {

    @POST("api/auth/login")
    suspend fun login(@Body body: LoginRequest): Response<LoginResponse>

    @POST("api/auth/registro")
    suspend fun registrar(@Body body: RegistroRequest): Response<LoginResponse>

    @GET("api/emisoras")
    suspend fun listarEmisoras(): Response<Map<String, Emisora>>

    @GET("api/emisoras/{id}")
    suspend fun obtenerEmisora(@Path("id") id: String): Response<Emisora>

    @POST("api/emisoras")
    suspend fun crearEmisora(@Body body: Emisora): Response<Emisora>

    @PUT("api/emisoras/{id}")
    suspend fun actualizarEmisora(@Path("id") id: String, @Body body: Emisora): Response<Emisora>

    @DELETE("api/emisoras/{id}")
    suspend fun eliminarEmisora(@Path("id") id: String): Response<Map<String, Any>>

    @GET("api/programas")
    suspend fun listarProgramas(): Response<Map<String, Programa>>

    @GET("api/programas/{id}")
    suspend fun obtenerPrograma(@Path("id") id: String): Response<Programa>

    @POST("api/programas")
    suspend fun crearPrograma(@Body body: Programa): Response<Programa>

    @PUT("api/programas/{id}")
    suspend fun actualizarPrograma(@Path("id") id: String, @Body body: Programa): Response<Programa>

    @DELETE("api/programas/{id}")
    suspend fun eliminarPrograma(@Path("id") id: String): Response<Map<String, Any>>

    @GET("api/programas/reportes/por-emisora")
    suspend fun programasPorEmisora(@Query("emisoraId") emisoraId: String): Response<Map<String, Programa>>
}
