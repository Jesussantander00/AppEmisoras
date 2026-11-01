package com.jesussantander.appemisoras

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.jesussantander.appemisoras.model.LoginRequest
import com.jesussantander.appemisoras.network.RetrofitClient
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etClave = findViewById<EditText>(R.id.etClave)
        val btnLogin = findViewById<Button>(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val clave = etClave.text.toString()
            if (email.isEmpty() || clave.isEmpty()) {
                Toast.makeText(this, "Ingresa correo y clave", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            btnLogin.isEnabled = false
            lifecycleScope.launch {
                try {
                    val resp = RetrofitClient.api.login(LoginRequest(email, clave))
                    if (resp.isSuccessful && resp.body() != null) {
                        val usuario = resp.body()!!
                        Toast.makeText(this@LoginActivity, "Bienvenido ${usuario.nombre}", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@LoginActivity, MenuPrincipalActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Correo o clave incorrectos", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@LoginActivity, "Error de conexion: ${e.message}", Toast.LENGTH_LONG).show()
                } finally {
                    btnLogin.isEnabled = true
                }
            }
        }
    }
}
