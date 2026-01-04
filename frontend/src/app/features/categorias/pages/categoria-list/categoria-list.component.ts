import { Component } from '@angular/core';
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
        <input type="text" [(ngModel)]="filtro" (input)="filtrar()" 
               placeholder="🔍 Buscar categoría..." class="search-input">
      </div>

      <div class="grid-container">
        <div *ngFor="let cat of listaFiltrada" 
             class="card-categoria" 
             [class.is-disabled]="!cat.estado"> 
          
          <div class="card-header">
            <div class="badge-group">
              <span class="badge" [class.active]="cat.estado">
                {{cat.estado ? '● Activo' : '○ Desactivada'}}
              </span>
              <span class="secure-tag">🔒 AES-256 Protected</span>
            </div>
            <h3>{{cat.nombre}}</h3>
          </div>

          <p class="card-desc">{{cat.descripcion}}</p>

          <div class="card-actions">
            <button *ngIf="cat.estado" (click)="editar(cat.id)" class="btn-action btn-edit">
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
    .main-container { padding: 30px; background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
    
    .header { 
      display: flex; justify-content: space-between; align-items: center; 
      margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;
    }

    .btn-primary {
      background: #2563eb; color: white; border: none; padding: 12px 24px;
      border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s;
    }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); }

    .search-input {
      width: 100%; padding: 12px 20px; border-radius: 12px; border: 2px solid #e2e8f0;
      margin-bottom: 25px; transition: 0.3s;
    }
    .search-input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

    .grid-container {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;
    }

    .card-categoria {
      background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;
      animation: entrance 0.5s ease-out forwards;
    }

    .card-categoria:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .card-categoria.is-disabled { opacity: 0.7; background: #f1f5f9; }

    .badge-group { display: flex; gap: 8px; margin-bottom: 12px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge.active { background: #dcfce7; color: #166534; }
    .badge:not(.active) { background: #fee2e2; color: #991b1b; }

    .secure-tag { background: #f1f5f9; color: #475569; font-size: 10px; padding: 4px 10px; border-radius: 20px; font-weight: 600; }

    .card-desc { color: #64748b; line-height: 1.6; margin: 15px 0; min-height: 48px; }

    .card-actions { display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    
    .btn-action { 
      border: none; padding: 10px; border-radius: 10px; cursor: pointer;
      font-weight: 600; transition: 0.2s; display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center;
    }
    .btn-edit { background: #eff6ff; color: #2563eb; }
    .btn-delete { background: #fef2f2; color: #dc2626; }
    .btn-activate { background: #f0fdf4; color: #16a34a; }
    .btn-action:hover { filter: brightness(0.95); transform: scale(1.03); }

    @keyframes entrance {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CategoriaListComponent {
  lista: CategoriaEvento[] = [];
  listaFiltrada: CategoriaEvento[] = [];
  filtro = '';

  constructor(private service: CategoriaService, private router: Router) {
    this.service.getAll().subscribe(data => {
      this.lista = data.map(c => ({ ...c, estado: c.estado == 1 }));
      this.listaFiltrada = [...this.lista];
    });
  }

  irANuevaCategoria(event: Event) {
    event.preventDefault();
    this.router.navigate(['/categorias/nuevo']);
  }

  filtrar() {
    const term = this.filtro.toLowerCase();
    this.listaFiltrada = this.lista.filter(c => 
      c.nombre.toLowerCase().includes(term)
    );
  }

  editar(id: number) { 
    this.router.navigate(['/categorias/editar', id]); 
  }

  alternarEstado(cat: CategoriaEvento) {
    this.service.toggleEstado(cat.id).subscribe({
      next: () => {
        alert(`¡Estado de ${cat.nombre} actualizado!`);
        this.service.getAll().subscribe(data => {
          this.lista = data.map(c => ({ ...c, estado: c.estado == 1 }));
          this.listaFiltrada = [...this.lista];
        });
      },
      error: (err) => alert("Error: " + err.message)
    });
  }
}