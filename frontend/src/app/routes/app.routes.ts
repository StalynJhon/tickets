import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { MovieListComponent } from '../features/movies/pages/movie-list/movie-list.component';
import { MovieFormComponent } from '../features/movies/forms/movie-form/movie-form.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';
import { CategoriaListComponent } from '../features/categorias/pages/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from '../features/categorias/pages/categoria-form/categoria-form.component';

export const routes: Routes = [
  // Ruta principal
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Eventos
  { path: 'eventos', component: EventosComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },

  // Promociones
  { path: 'promociones', component: PromocionesComponent },

  // Configuración
  { path: 'configuracion', component: ConfiguracionGeneralComponent },

  // Movies (David)
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/new', component: MovieFormComponent },
  { path: 'movies/edit/:id', component: MovieFormComponent },
  
  //Categorias 
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/nuevo', component: CategoriaFormComponent },
  { path: 'categorias/editar/:id', component: CategoriaFormComponent },

  // Cualquier ruta inválida
  { path: '**', redirectTo: 'dashboard' }
];
