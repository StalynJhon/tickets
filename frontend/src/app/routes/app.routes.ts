import { Routes } from '@angular/router';

/* Layout / Base */
import { DashboardComponent } from '../layout/dashboard/dashboard.component';

/* Features principales */
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/movies/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';

/* Categorías */
import { CategoriaComponent } from '../features/categoria/pages/categoria.component';

/* Products */
import { ProductsListComponent } from '../features/products/pages/products-list.component';

/* Transport */
import { TransportRoutesComponent } from '../features/transport/pages/transport-routes.component';

export const routes: Routes = [
  // Ruta principal
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },

  // Eventos
  { path: 'eventos', component: EventosComponent },

  // Promociones
  { path: 'promociones', component: PromocionesComponent },

  // Configuración
  { path: 'configuracion', component: ConfiguracionGeneralComponent },

  // Categorías
  { path: 'categorias', component: CategoriaComponent },

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
