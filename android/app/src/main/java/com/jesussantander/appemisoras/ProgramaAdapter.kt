package com.jesussantander.appemisoras

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.jesussantander.appemisoras.model.Programa

class ProgramaAdapter(
    private var items: List<Programa>,
    private val onEdit: (Programa) -> Unit,
    private val onDelete: (Programa) -> Unit
) : RecyclerView.Adapter<ProgramaAdapter.VH>() {

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvNombre: TextView = view.findViewById(R.id.tvNombre)
        val tvInfo: TextView = view.findViewById(R.id.tvInfo)
        val btnEditar: View = view.findViewById(R.id.btnEditar)
        val btnEliminar: View = view.findViewById(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, position: Int): VH {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_programa, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val p = items[position]
        holder.tvNombre.text = "${p.nombre} (${p.id})"
        holder.tvInfo.text = "Emisora: ${p.emisoraId} · ${p.horarioInicio}-${p.horarioFin} · ${p.genero}"
        holder.btnEditar.setOnClickListener { onEdit(p) }
        holder.btnEliminar.setOnClickListener { onDelete(p) }
    }

    override fun getItemCount() = items.size

    fun actualizar(nuevos: List<Programa>) {
        items = nuevos
        notifyDataSetChanged()
    }
}
