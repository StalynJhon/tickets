import { Routes } from '@angular/router';

/* Layout / Base */
import { DashboardComponent } from '../layout/dashboard/dashboard.component';

/* Features principales */
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';

/* Movies */
import { MovieListComponent } from '../features/movies/pages/movie-list/movie-list.component';
import { MovieFormComponent } from '../features/movies/forms/movie-form/movie-form.component';

//Categoria
import { CategoriaComponent } from '../features/categoria/pages/categoria.component';

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

  // Movies
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/new', component: MovieFormComponent },
  { path: 'movies/edit/:id', component: MovieFormComponent },

  // Categorias
  { path: 'categorias', component: CategoriaComponent },

  // Cualquier ruta inválida
  { path: '**', redirectTo: 'dashboard' }
];
