package com.jesussantander.appemisoras

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.location.Geocoder
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.jesussantander.appemisoras.model.Emisora
import com.jesussantander.appemisoras.network.RetrofitClient
import kotlinx.coroutines.launch
import java.util.Locale

/**
 * Sensor 2: GPS (FusedLocationProviderClient + Geocoder).
 * Equivalente nativo del bloque LocationSensor de Kodular (Corte 2):
 * autocompleta el campo "pais" al registrar/editar una emisora.
 */
class EmisoraFormActivity : AppCompatActivity() {

    private var emisoraId: String? = null
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private lateinit var etId: EditText
    private lateinit var etNombre: EditText
    private lateinit var etCanal: EditText
    private lateinit var etBandaFM: EditText
    private lateinit var etBandaAM: EditText
    private lateinit var etNumLocutores: EditText
    private lateinit var etGenero: EditText
    private lateinit var etHorario: EditText
    private lateinit var etPatrocinador: EditText
    private lateinit var etPais: EditText
    private lateinit var etDescripcion: EditText
    private lateinit var etNumPrograma: EditText
    private lateinit var etNumCiudades: EditText
    private lateinit var progressBar: ProgressBar

    companion object {
        private const val REQ_LOCATION = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_emisora_form)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        etId = findViewById(R.id.etId)
        etNombre = findViewById(R.id.etNombre)
        etCanal = findViewById(R.id.etCanal)
        etBandaFM = findViewById(R.id.etBandaFM)
        etBandaAM = findViewById(R.id.etBandaAM)
        etNumLocutores = findViewById(R.id.etNumLocutores)
        etGenero = findViewById(R.id.etGenero)
        etHorario = findViewById(R.id.etHorario)
        etPatrocinador = findViewById(R.id.etPatrocinador)
        etPais = findViewById(R.id.etPais)
        etDescripcion = findViewById(R.id.etDescripcion)
        etNumPrograma = findViewById(R.id.etNumPrograma)
        etNumCiudades = findViewById(R.id.etNumCiudades)
        progressBar = findViewById(R.id.progressBar)

        emisoraId = intent.getStringExtra("emisoraId")
        if (emisoraId != null) {
            etId.setText(emisoraId)
            etId.isEnabled = false
            cargarEmisora(emisoraId!!)
        }

        findViewById<Button>(R.id.btnUbicacion).setOnClickListener {
            obtenerPaisPorGPS()
        }

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            guardarEmisora()
        }
    }

    private fun cargarEmisora(id: String) {
        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val resp = RetrofitClient.api.obtenerEmisora(id)
                if (resp.isSuccessful && resp.body() != null) {
                    val e = resp.body()!!
                    etNombre.setText(e.nombre)
                    etCanal.setText(e.canal)
                    etBandaFM.setText(e.bandaFM)
                    etBandaAM.setText(e.bandaAM)
                    etNumLocutores.setText(e.numLocutores)
                    etGenero.setText(e.genero)
                    etHorario.setText(e.horario)
                    etPatrocinador.setText(e.patrocinador)
                    etPais.setText(e.pais)
                    etDescripcion.setText(e.descripcion)
                    etNumPrograma.setText(e.numPrograma)
                    etNumCiudades.setText(e.numCiudades)
                }
            } catch (e: Exception) {
                Toast.makeText(this@EmisoraFormActivity, "Error al cargar: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun obtenerPaisPorGPS() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
                REQ_LOCATION
            )
            return
        }
        leerUbicacionActual()
    }

    @SuppressLint("MissingPermission")
    private fun leerUbicacionActual() {
        progressBar.visibility = View.VISIBLE
        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                try {
                    val geocoder = Geocoder(this, Locale.getDefault())
                    @Suppress("DEPRECATION")
                    val direcciones = geocoder.getFromLocation(location.latitude, location.longitude, 1)
                    val pais = direcciones?.firstOrNull()?.countryName
                    if (pais != null) {
                        etPais.setText(pais)
                        Toast.makeText(this, "Sensor GPS: pais detectado -> $pais", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this, "No se pudo determinar el pais", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this, "Error de geocodificacion: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this, "Ubicacion no disponible (activa el GPS)", Toast.LENGTH_SHORT).show()
            }
            progressBar.visibility = View.GONE
        }.addOnFailureListener {
            progressBar.visibility = View.GONE
            Toast.makeText(this, "Error al obtener ubicacion: ${it.message}", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_LOCATION && grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            leerUbicacionActual()
        }
    }

    private fun guardarEmisora() {
        val id = etId.text.toString().trim().ifEmpty { "EM-" + System.currentTimeMillis().toString().takeLast(6) }
        val nombre = etNombre.text.toString().trim()
        if (nombre.isEmpty()) {
            Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
            return
        }
        val emisora = Emisora(
            id = id,
            nombre = nombre,
            canal = etCanal.text.toString(),
            bandaFM = etBandaFM.text.toString(),
            bandaAM = etBandaAM.text.toString(),
            numLocutores = etNumLocutores.text.toString(),
            genero = etGenero.text.toString(),
            horario = etHorario.text.toString(),
            patrocinador = etPatrocinador.text.toString(),
            pais = etPais.text.toString(),
            descripcion = etDescripcion.text.toString(),
            numPrograma = etNumPrograma.text.toString(),
            numCiudades = etNumCiudades.text.toString()
        )

        progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val resp = if (emisoraId != null) {
                    RetrofitClient.api.actualizarEmisora(id, emisora)
                } else {
                    RetrofitClient.api.crearEmisora(emisora)
                }
                if (resp.isSuccessful) {
                    Toast.makeText(this@EmisoraFormActivity, "Emisora guardada", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@EmisoraFormActivity, "Error al guardar (${resp.code()})", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@EmisoraFormActivity, "Error de conexion: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }
}
