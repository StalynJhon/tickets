import { Injectable } from '@angular/core';

export interface CategoriaEvento {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categorias: CategoriaEvento[] = [
    { id: 1, nombre: 'Película', descripcion: 'Eventos de cine', estado: true },
    { id: 2, nombre: 'Concierto', descripcion: 'Eventos musicales', estado: true }
  ];

  private contadorId = 3;

  getCategorias(): CategoriaEvento[] {
    return [...this.categorias];
  }

  crearCategoria(categoria: CategoriaEvento) {
    this.categorias.push({ ...categoria, id: this.contadorId++ });
  }

  actualizarCategoria(categoriaEditada: CategoriaEvento) {
    this.categorias = this.categorias.map(c =>
      c.id === categoriaEditada.id ? { ...categoriaEditada } : c
    );
  }

  cambiarEstadoCategoria(id: number) {
    this.categorias = this.categorias.map(c =>
      c.id === id ? { ...c, estado: !c.estado } : c
    );
  }
}


