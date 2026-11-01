package com.jesussantander.appemisoras

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.jesussantander.appemisoras.model.Emisora

class EmisoraAdapter(
    private var items: List<Emisora>,
    private val onEdit: (Emisora) -> Unit,
    private val onDelete: (Emisora) -> Unit,
    private val onOpenProgramas: (Emisora) -> Unit
) : RecyclerView.Adapter<EmisoraAdapter.VH>() {

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvNombre: TextView = view.findViewById(R.id.tvNombre)
        val tvInfo: TextView = view.findViewById(R.id.tvInfo)
        val btnEditar: View = view.findViewById(R.id.btnEditar)
        val btnEliminar: View = view.findViewById(R.id.btnEliminar)
        val btnProgramas: View = view.findViewById(R.id.btnProgramas)
    }

    override fun onCreateViewHolder(parent: ViewGroup, position: Int): VH {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_emisora, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val e = items[position]
        holder.tvNombre.text = "${e.nombre} (${e.id})"
        holder.tvInfo.text = "Pais: ${e.pais} · Genero: ${e.genero} · Locutores: ${e.numLocutores}"
        holder.btnEditar.setOnClickListener { onEdit(e) }
        holder.btnEliminar.setOnClickListener { onDelete(e) }
        holder.btnProgramas.setOnClickListener { onOpenProgramas(e) }
    }

    override fun getItemCount() = items.size

    fun actualizar(nuevos: List<Emisora>) {
        items = nuevos
        notifyDataSetChanged()
    }
}
