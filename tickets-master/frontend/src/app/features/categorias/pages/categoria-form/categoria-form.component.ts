import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaEvento } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="form-container">
      <div class="form-card">
        <div class="form-header">
          <button (click)="volver()" class="btn-back">← Volver</button>
          <h2>{{ esEdicion ? 'Editar' : 'Nueva' }} Categoría</h2>
        </div>

        <form (ngSubmit)="guardar()" #categoriaForm="ngForm" class="modern-form">
          <div class="input-group">
            <label>Nombre de la Categoría</label>
            <input
              type="text"
              [(ngModel)]="categoria.nombre"
              name="nombre"
              required
              placeholder="Ej: Conciertos, Teatro..."
              class="modern-input"
            />
          </div>

          <div class="input-group">
            <label>Descripción</label>
            <textarea
              [(ngModel)]="categoria.descripcion"
              name="descripcion"
              required
              placeholder="Describe de qué trata esta categoría"
              rows="4"
              class="modern-input"
            ></textarea>
          </div>

          <div class="form-footer">
            <div class="security-info">
              <span class="lock-icon">🔒</span>
              <p>
                Tus datos serán cifrados con <strong>AES-256</strong> antes de
                guardarse en la base de datos.
              </p>
            </div>

            <button
              type="submit"
              [disabled]="!categoriaForm.form.valid"
              class="btn-submit"
            >
              {{ esEdicion ? 'Actualizar Categoría' : 'Guardar Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* estilos intactos */
  `]
})
export class CategoriaFormComponent implements OnInit {

  categoria: CategoriaEvento = {
    id: 0,
    nombre: '',
    descripcion: '',
    estado: true
  };

  esEdicion = false;

  constructor(
    private service: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!id) return;

    this.esEdicion = true;

    // 1️⃣ Buscar primero en localStorage
    const local = JSON.parse(localStorage.getItem('mis_categorias') || '[]');
    const encontrada = local.find((c: CategoriaEvento) => c.id === id);

    if (encontrada) {
      this.categoria = { ...encontrada };
      return;
    }

    // 2️⃣ Si no está local, buscar en backend
    this.service.getById(id).subscribe(data => {
      this.categoria = { ...data, estado: data.estado == 1 };
    });
  }

  guardar(): void {
    const local = JSON.parse(localStorage.getItem('mis_categorias') || '[]');

    if (this.esEdicion) {
      const index = local.findIndex((c: CategoriaEvento) => c.id === this.categoria.id);
      if (index !== -1) {
        local[index] = { ...this.categoria };
      }
    } else {
      const nueva = {
        ...this.categoria,
        id: Date.now(),
        estado: true
      };
      local.push(nueva);
      this.categoria = nueva;
    }

    localStorage.setItem('mis_categorias', JSON.stringify(local));

    // Intentar guardar en backend
    const req = this.esEdicion
      ? this.service.update(this.categoria.id, this.categoria)
      : this.service.create(this.categoria);

    req.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: () => {
        alert('Cambios guardados localmente');
        this.router.navigate(['/categorias']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/categorias']);
  }
}
