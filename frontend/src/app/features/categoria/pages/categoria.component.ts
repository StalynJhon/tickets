import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, CategoriaEvento } from '../categoria.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {

  categorias: CategoriaEvento[] = [];
  categoriasFiltradas: CategoriaEvento[] = [];

  categoriaForm: CategoriaEvento = {
    id: 0,
    nombre: '',
    descripcion: '',
    estado: true
  };

  editando = false;
  filtro: string = 'todos';

  constructor(private categoriaService: CategoriaService) {
    this.actualizarVista();
  }

  actualizarVista() {
    this.categorias = this.categoriaService.getCategorias();
    this.aplicarFiltro();
  }

  guardarCategoria() {
    if (this.editando) {
      this.categoriaService.actualizarCategoria(this.categoriaForm);
      this.editando = false;
    } else {
      this.categoriaService.crearCategoria(this.categoriaForm);
    }
    this.limpiarFormulario();
    this.actualizarVista();
  }

  editarCategoria(categoria: CategoriaEvento) {
    this.categoriaForm = { ...categoria };
    this.editando = true;
  }

  cambiarEstado(id: number) {
    this.categoriaService.cambiarEstadoCategoria(id);
    this.actualizarVista();
  }

  aplicarFiltro() {
    if (this.filtro === 'activos') {
      this.categoriasFiltradas = this.categorias.filter(c => c.estado);
    } else if (this.filtro === 'inactivos') {
      this.categoriasFiltradas = this.categorias.filter(c => !c.estado);
    } else {
      this.categoriasFiltradas = [...this.categorias];
    }
  }

  limpiarFormulario() {
    this.categoriaForm = {
      id: 0,
      nombre: '',
      descripcion: '',
      estado: true
    };
  }
}


