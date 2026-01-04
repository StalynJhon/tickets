import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { MovieListComponent } from '../features/movies/pages/movie-list/movie-list.component';
import { MovieFormComponent } from '../features/movies/forms/movie-form/movie-form.component';
export const routes: Routes = [
  // Ruta principal → Dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },

   // Promociones
   { path: 'promociones', component: PromocionesComponent},
   { path: 'movies', component: MovieListComponent },
   { path: 'movies/new', component: MovieFormComponent},
   { path: 'movies/edit/:id', component: MovieFormComponent},
   // Cualquier ruta inválida → Dashboard
  { path: '**', redirectTo: 'dashboard' }
];
