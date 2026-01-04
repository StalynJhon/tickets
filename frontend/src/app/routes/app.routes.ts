import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ClienteListComponent } from './features/clientes/pages/cliente-list.component';
import { EventosComponent } from './features/eventos/pages/eventos.component';
// TUS IMPORTACIONES
import { CategoriaListComponent } from './features/categorias/pages/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './features/categorias/pages/categoria-form/categoria-form.component';

export const routes: Routes = [
  // Ruta principal
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'clientes', component: ClienteListComponent },

  // --- TUS RUTAS DE CATEGORÍAS ---
  { path: 'categorias', component: CategoriaListComponent },           // Listar y filtrar
  { path: 'categorias/nuevo', component: CategoriaFormComponent },      // Crear nueva
  { path: 'categorias/editar/:id', component: CategoriaFormComponent }, // Editar existente
  
  // Cualquier ruta inválida -> Dashboard
  { path: '**', redirectTo: 'dashboard' }
];