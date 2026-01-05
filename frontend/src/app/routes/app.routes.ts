import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { MovieListComponent } from '../features/movies/pages/movie-list/movie-list.component';
import { MovieFormComponent } from '../features/movies/forms/movie-form/movie-form.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';
import { ProductsListComponent } from '../features/products/pages/products-list.component';
import { TransportRoutesComponent } from '../features/transport/pages/transport-routes.component';

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

  // Products
  { path: 'products', component: ProductsListComponent },
  { path: 'products/new', component: ProductsListComponent },
  { path: 'products/edit/:id', component: ProductsListComponent },

  // Transport
  { path: 'transport', component: TransportRoutesComponent },
  { path: 'transport/rutas', component: TransportRoutesComponent },

  // Cualquier ruta inválida
  { path: '**', redirectTo: 'dashboard' }
];
