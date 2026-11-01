package com.jesussantander.appemisoras

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.jesussantander.appemisoras.model.Programa
import com.jesussantander.appemisoras.network.RetrofitClient
import kotlinx.coroutines.launch

class ProgramaFormActivity : AppCompatActivity() {

    private var programaId: String? = null

    private lateinit var etId: EditText
    private lateinit var etNombre: EditText
    private lateinit var etEmisoraId: EditText
    private lateinit var etConductor: EditText
    private lateinit var etHorarioInicio: EditText
    private lateinit var etHorarioFin: EditText
    private lateinit var etGenero: EditText
    private lateinit var etDuracionMinutos: EditText
    private lateinit var etDescripcion: EditText
    private lateinit var etDiasTransmision: EditText
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_programa_form)

        etId = findViewById(R.id.etId)
        etNombre = findViewById(R.id.etNombre)
        etEmisoraId = findViewById(R.id.etEmisoraId)
        etConductor = findViewById(R.id.etConductor)
        etHorarioInicio = findViewById(R.id.etHorarioInicio)
        etHorarioFin = findViewById(R.id.etHorarioFin)
        etGenero = findViewById(R.id.etGenero)
        etDuracionMinutos = findViewById(R.id.etDuracionMinutos)
        etDescripcion = findViewById(R.id.etDescripcion)
        etDiasTransmision = findViewById(R.id.etDiasTransmision)
        progressBar = findViewById(R.id.progressBar)

        programaId = intent.getStringExtra("programaId")
        val emisoraPreseleccionada = intent.getStringExtra("emisoraIdPreseleccionada")
        if (emisoraPreseleccionada != null) {
            etEmisoraId.setText(emisoraPreseleccionada)
        }

        if (programaId != null) {
            etId.setText(programaId)
            etId.isEnabled = false
            cargarPrograma(programaId!!)
        }

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            guardarPrograma()
        }
    }

    private fun cargarPrograma(id: String) {
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val resp = RetrofitClient.api.obtenerPrograma(id)
                if (resp.isSuccessful && resp.body() != null) {
                    val p = resp.body()!!
                    etNombre.setText(p.nombre)
                    etEmisoraId.setText(p.emisoraId)
                    etConductor.setText(p.conductor)
                    etHorarioInicio.setText(p.horarioInicio)
                    etHorarioFin.setText(p.horarioFin)
                    etGenero.setText(p.genero)
                    etDuracionMinutos.setText(p.duracionMinutos)
                    etDescripcion.setText(p.descripcion)
                    etDiasTransmision.setText(p.diasTransmision)
                }
            } catch (e: Exception) {
                Toast.makeText(this@ProgramaFormActivity, "Error al cargar: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun guardarPrograma() {
        val id = etId.text.toString().trim().ifEmpty { "PR-" + System.currentTimeMillis().toString().takeLast(6) }
        val nombre = etNombre.text.toString().trim()
        val emisoraIdTexto = etEmisoraId.text.toString().trim()
        if (nombre.isEmpty()) {
            Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
            return
        }
        if (emisoraIdTexto.isEmpty()) {
            Toast.makeText(this, "El ID de la emisora es obligatorio", Toast.LENGTH_SHORT).show()
            return
        }
        val programa = Programa(
            id = id,
            nombre = nombre,
            emisoraId = emisoraIdTexto,
            conductor = etConductor.text.toString(),
            horarioInicio = etHorarioInicio.text.toString(),
            horarioFin = etHorarioFin.text.toString(),
            genero = etGenero.text.toString(),
            duracionMinutos = etDuracionMinutos.text.toString(),
            descripcion = etDescripcion.text.toString(),
            diasTransmision = etDiasTransmision.text.toString()
        )

        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val resp = if (programaId != null) {
                    RetrofitClient.api.actualizarPrograma(id, programa)
                } else {
                    RetrofitClient.api.crearPrograma(programa)
                }
                if (resp.isSuccessful) {
                    Toast.makeText(this@ProgramaFormActivity, "Programa guardado", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@ProgramaFormActivity, "Error al guardar (${resp.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ProgramaFormActivity, "Error de conexion: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }
}
