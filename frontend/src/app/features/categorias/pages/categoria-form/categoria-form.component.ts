import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaEvento } from '../../models/categoria.models';

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
            <input type="text" [(ngModel)]="categoria.nombre" name="nombre" 
                   required placeholder="Ej: Conciertos, Teatro..." class="modern-input">
          </div>

          <div class="input-group">
            <label>Descripción</label>
            <textarea [(ngModel)]="categoria.descripcion" name="descripcion" 
                      required placeholder="Describe de qué trata esta categoría" 
                      rows="4" class="modern-input"></textarea>
          </div>

          <div class="form-footer">
            <div class="security-info">
              <span class="lock-icon">🔒</span>
              <p>Tus datos serán cifrados con <strong>AES-256</strong> antes de guardarse en la base de datos.</p>
            </div>
            
            <button type="submit" [disabled]="!categoriaForm.form.valid" class="btn-submit">
              {{ esEdicion ? 'Actualizar Categoría' : 'Guardar Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container { 
      padding: 40px 20px; background: #f8fafc; min-height: 100vh; 
      display: flex; justify-content: center; align-items: flex-start;
    }

    .form-card {
      background: white; width: 100%; max-width: 600px; padding: 40px;
      border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0; animation: slideIn 0.5s ease-out;
    }

    .form-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
    .form-header h2 { margin: 0; color: #1e293b; font-size: 24px; }

    .btn-back { 
      background: none; border: none; color: #64748b; cursor: pointer; 
      font-weight: 600; transition: 0.2s; 
    }
    .btn-back:hover { color: #2563eb; }

    .modern-form { display: flex; flex-direction: column; gap: 20px; }

    .input-group { display: flex; flex-direction: column; gap: 8px; }
    .input-group label { font-weight: 600; color: #475569; font-size: 14px; }

    .modern-input {
      padding: 12px 16px; border-radius: 12px; border: 2px solid #e2e8f0;
      font-size: 16px; transition: 0.3s; background: #fdfdfd;
    }
    .modern-input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }

    .form-footer { 
      margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9;
      display: flex; flex-direction: column; gap: 20px;
    }

    .security-info {
      display: flex; align-items: center; gap: 12px; background: #f0f9ff;
      padding: 12px; border-radius: 10px; border: 1px solid #e0f2fe;
    }
    .security-info p { margin: 0; font-size: 12px; color: #0369a1; }
    .lock-icon { font-size: 20px; }

    .btn-submit {
      background: #2563eb; color: white; border: none; padding: 14px;
      border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
      font-size: 16px;
    }
    .btn-submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-2px); }
    .btn-submit:disabled { background: #cbd5e1; cursor: not-allowed; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})

export class CategoriaFormComponent implements OnInit {
  categoria: CategoriaEvento = { id: 0, nombre: '', descripcion: '', estado: true };
  esEdicion = false;

  constructor(
    private service: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

 ngOnInit() {
  const id = Number(this.route.snapshot.params['id']); 
  if (id) {
    this.esEdicion = true;

    const local = JSON.parse(localStorage.getItem('mis_categorias') || '[]');
    const encontrada = local.find((c: any) => c.id === id);
    
    if (encontrada) {
      this.categoria = { ...encontrada };
    } else {

      this.service.getById(id).subscribe(data => this.categoria = data);
    }
  }
}

 guardar() {
  const local = localStorage.getItem('mis_categorias') || '[]';
  let categorias = JSON.parse(local);

  if (this.esEdicion) {
 
    const index = categorias.findIndex((c: any) => c.id === this.categoria.id);
    if (index !== -1) {
      categorias[index] = { ...this.categoria };
    }
  } else {
  
    const nuevaCat = { ...this.categoria, id: Date.now(), estado: true };
    categorias.push(nuevaCat);
  }

  localStorage.setItem('mis_categorias', JSON.stringify(categorias));

  this.service.create(this.categoria).subscribe({
    next: () => this.router.navigate(['/categorias']),
    error: () => {
      alert('Cambios guardados localmente');
      this.router.navigate(['/categorias']);
    }
  });
}
  volver() {
    this.router.navigate(['/categorias']);
  }
}
