package com.jesussantander.appemisoras

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.jesussantander.appemisoras.model.Programa
import com.jesussantander.appemisoras.network.RetrofitClient
import com.jesussantander.appemisoras.sensors.ShakeDetector
import kotlinx.coroutines.launch

class ProgramasListActivity : AppCompatActivity() {

    private lateinit var adapter: ProgramaAdapter
    private lateinit var shakeDetector: ShakeDetector
    private lateinit var progressBar: ProgressBar
    private var emisoraId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_programas_list)

        emisoraId = intent.getStringExtra("emisoraId")
        val emisoraNombre = intent.getStringExtra("emisoraNombre")
        findViewById<TextView>(R.id.tvTitulo).text =
            if (emisoraNombre != null) "Programas de $emisoraNombre" else "Todos los programas"

        progressBar = findViewById(R.id.progressBar)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = ProgramaAdapter(
            items = emptyList(),
            onEdit = { programa ->
                val intent = Intent(this, ProgramaFormActivity::class.java)
                intent.putExtra("programaId", programa.id)
                startActivity(intent)
            },
            onDelete = { programa -> confirmarEliminar(programa) }
        )
        recyclerView.adapter = adapter

        findViewById<View>(R.id.btnNuevo).setOnClickListener {
            val intent = Intent(this, ProgramaFormActivity::class.java)
            if (emisoraId != null) intent.putExtra("emisoraIdPreseleccionada", emisoraId)
            startActivity(intent)
        }

        shakeDetector = ShakeDetector(this) {
            Toast.makeText(this, "Sensor acelerometro: agitaste el telefono, actualizando...", Toast.LENGTH_SHORT).show()
            cargarProgramas()
        }
    }

    override fun onResume() {
        super.onResume()
        shakeDetector.start()
        cargarProgramas()
    }

    override fun onPause() {
        super.onPause()
        shakeDetector.stop()
    }

    private fun cargarProgramas() {
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val lista: List<Programa> = if (emisoraId != null) {
                    val resp = RetrofitClient.api.programasPorEmisora(emisoraId!!)
                    if (resp.isSuccessful) resp.body()?.values?.toList() ?: emptyList() else emptyList()
                } else {
                    val resp = RetrofitClient.api.listarProgramas()
                    if (resp.isSuccessful) resp.body()?.values?.toList() ?: emptyList() else emptyList()
                }
                adapter.actualizar(lista.sortedBy { it.id })
            } catch (e: Exception) {
                Toast.makeText(this@ProgramasListActivity, "Error de conexion: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun confirmarEliminar(programa: Programa) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar programa")
            .setMessage("¿Eliminar ${programa.nombre}?")
            .setPositiveButton("Eliminar") { _, _ ->
                lifecycleScope.launch {
                    try {
                        RetrofitClient.api.eliminarPrograma(programa.id)
                        cargarProgramas()
                    } catch (e: Exception) {
                        Toast.makeText(this@ProgramasListActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }
}
