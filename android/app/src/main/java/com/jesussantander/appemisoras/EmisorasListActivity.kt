package com.jesussantander.appemisoras

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.jesussantander.appemisoras.model.Emisora
import com.jesussantander.appemisoras.network.RetrofitClient
import com.jesussantander.appemisoras.sensors.ShakeDetector
import kotlinx.coroutines.launch

class EmisorasListActivity : AppCompatActivity() {

    private lateinit var adapter: EmisoraAdapter
    private lateinit var shakeDetector: ShakeDetector
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_emisoras_list)

        progressBar = findViewById(R.id.progressBar)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = EmisoraAdapter(
            items = emptyList(),
            onEdit = { emisora ->
                val intent = Intent(this, EmisoraFormActivity::class.java)
                intent.putExtra("emisoraId", emisora.id)
                startActivity(intent)
            },
            onDelete = { emisora -> confirmarEliminar(emisora) },
            onOpenProgramas = { emisora ->
                val intent = Intent(this, ProgramasListActivity::class.java)
                intent.putExtra("emisoraId", emisora.id)
                intent.putExtra("emisoraNombre", emisora.nombre)
                startActivity(intent)
            }
        )
        recyclerView.adapter = adapter

        findViewById<View>(R.id.btnNueva).setOnClickListener {
            startActivity(Intent(this, EmisoraFormActivity::class.java))
        }

        shakeDetector = ShakeDetector(this) {
            Toast.makeText(this, "Sensor acelerometro: agitaste el telefono, actualizando...", Toast.LENGTH_SHORT).show()
            cargarEmisoras()
        }
    }

    override fun onResume() {
        super.onResume()
        shakeDetector.start()
        cargarEmisoras()
    }

    override fun onPause() {
        super.onPause()
        shakeDetector.stop()
    }

    private fun cargarEmisoras() {
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val resp = RetrofitClient.api.listarEmisoras()
                if (resp.isSuccessful) {
                    val mapa = resp.body() ?: emptyMap()
                    adapter.actualizar(mapa.values.sortedBy { it.id })
                } else {
                    Toast.makeText(this@EmisorasListActivity, "Error al cargar emisoras", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@EmisorasListActivity, "Error de conexion: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun confirmarEliminar(emisora: Emisora) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar emisora")
            .setMessage("¿Eliminar ${emisora.nombre}?")
            .setPositiveButton("Eliminar") { _, _ ->
                lifecycleScope.launch {
                    try {
                        RetrofitClient.api.eliminarEmisora(emisora.id)
                        cargarEmisoras()
                    } catch (e: Exception) {
                        Toast.makeText(this@EmisorasListActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }
}
