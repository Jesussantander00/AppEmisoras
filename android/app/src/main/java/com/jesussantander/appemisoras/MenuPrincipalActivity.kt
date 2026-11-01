package com.jesussantander.appemisoras

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MenuPrincipalActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu_principal)

        findViewById<Button>(R.id.btnEmisoras).setOnClickListener {
            startActivity(Intent(this, EmisorasListActivity::class.java))
        }
        findViewById<Button>(R.id.btnProgramas).setOnClickListener {
            startActivity(Intent(this, ProgramasListActivity::class.java))
        }
    }
}
