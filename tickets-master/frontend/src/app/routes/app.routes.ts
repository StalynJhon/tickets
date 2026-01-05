import { Routes } from '@angular/router';

/* Layout / Base */
import { DashboardComponent } from '../layout/dashboard/dashboard.component';

/* Clientes */
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { ClienteFormComponent } from '../features/clientes/pages/cliente-form.component';

/* Features principales */
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';

/* Movies */
import { MovieListComponent } from '../features/movies/pages/movie-list/movie-list.component';
import { MovieFormComponent } from '../features/movies/forms/movie-form/movie-form.component';

/* Categorías */
import { CategoriaListComponent } from '../features/categorias/pages/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from '../features/categorias/pages/categoria-form/categoria-form.component';

export const routes: Routes = [
  // Ruta principal
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Eventos
  { path: 'eventos', component: EventosComponent },

  // =========================
  // CLIENTES (CRUD)
  // =========================
  { path: 'clientes', component: ClienteListComponent },
  { path: 'clientes/nuevo', component: ClienteFormComponent },
  { path: 'clientes/editar/:id', component: ClienteFormComponent },

  // Promociones
  { path: 'promociones', component: PromocionesComponent },

  // Configuración
  { path: 'configuracion', component: ConfiguracionGeneralComponent },

  // Movies
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/new', component: MovieFormComponent },
  { path: 'movies/edit/:id', component: MovieFormComponent },

  // Categorías
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/nuevo', component: CategoriaFormComponent },
  { path: 'categorias/editar/:id', component: CategoriaFormComponent },

  // Cualquier ruta inválida
  { path: '**', redirectTo: 'dashboard' }
];
