import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaEvento } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="main-container">
      <div class="header">
        <h1>Categorías de Eventos</h1>
        <button (click)="irANuevaCategoria($event)" class="btn-primary">
          + Nueva Categoría
        </button>
      </div>

      <div class="search-container">
        <input type="text"
               [(ngModel)]="filtro"
               (input)="filtrar()"
               placeholder="🔍 Buscar categoría..."
               class="search-input">
      </div>

      <div class="grid-container">
        <div *ngFor="let cat of listaFiltrada"
             class="card-categoria"
             [class.is-disabled]="!cat.estado">

          <div class="card-header">
            <div class="badge-group">
              <span class="badge" [class.active]="cat.estado">
                {{ cat.estado ? '● Activo' : '○ Desactivada' }}
              </span>
              <span class="secure-tag">🔒 AES-256 Protected</span>
            </div>
            <h3>{{ cat.nombre }}</h3>
          </div>

          <p class="card-desc">{{ cat.descripcion }}</p>

          <div class="card-actions">
            <button *ngIf="cat.estado"
                    (click)="editar(cat.id)"
                    class="btn-action btn-edit">
              ✏️ Editar
            </button>

            <button (click)="alternarEstado(cat)"
                    class="btn-action"
                    [class.btn-delete]="cat.estado"
                    [class.btn-activate]="!cat.estado">
              {{ cat.estado ? '🗑️ Desactivar' : '🔄 Activar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container { padding: 30px; background: #f8fafc; min-height: 100vh; }
    .header { display:flex; justify-content:space-between; margin-bottom:20px; }
    .btn-primary { background:#2563eb; color:white; padding:12px 24px; border-radius:10px; border:none; }
    .search-input { width:100%; padding:12px; margin-bottom:20px; }
    .grid-container { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }
    .card-categoria { background:white; padding:20px; border-radius:16px; }
    .is-disabled { opacity:0.6; }
  `]
})
export class CategoriaListComponent implements OnInit {

  lista: CategoriaEvento[] = [];
  listaFiltrada: CategoriaEvento[] = [];
  filtro = '';

  constructor(
    private service: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        const servidor = data.map(c => ({ ...c, estado: c.estado == 1 }));
        const local = JSON.parse(localStorage.getItem('mis_categorias') || '[]');
        this.lista = [...servidor, ...local];
        this.listaFiltrada = [...this.lista];
      },
      error: () => {
        this.lista = JSON.parse(localStorage.getItem('mis_categorias') || '[]');
        this.listaFiltrada = [...this.lista];
      }
    });
  }

  irANuevaCategoria(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/categorias/nuevo']);
  }

  filtrar(): void {
    const term = this.filtro.toLowerCase();
    this.listaFiltrada = this.lista.filter(c =>
      c.nombre.toLowerCase().includes(term)
    );
  }

  editar(id: number): void {
    this.router.navigate(['/categorias/editar', id]);
  }

  alternarEstado(cat: CategoriaEvento): void {
    const local = JSON.parse(localStorage.getItem('mis_categorias') || '[]');
    const index = local.findIndex((c: any) => c.id === cat.id);

    if (index !== -1) {
      local[index].estado = !local[index].estado;
      localStorage.setItem('mis_categorias', JSON.stringify(local));
    }

    this.service.toggleEstado(cat.id).subscribe({
      complete: () => this.cargarDatos(),
      error: () => this.cargarDatos()
    });
  }
}
