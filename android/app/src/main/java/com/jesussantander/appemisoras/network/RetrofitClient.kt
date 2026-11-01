package com.jesussantander.appemisoras.network

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // Mismo backend desplegado en Render usado por la app Kodular del Corte 2.
    // El plan gratis de Render "duerme" tras ~15 min sin trafico; por eso los
    // timeouts son generosos (la primera peticion puede tardar en despertar).
    private const val BASE_URL = "https://appemisoras-backend.onrender.com/"

    val api: ApiService by lazy {
        val client = OkHttpClient.Builder()
            .connectTimeout(40, TimeUnit.SECONDS)
            .readTimeout(40, TimeUnit.SECONDS)
            .writeTimeout(40, TimeUnit.SECONDS)
            .build()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
