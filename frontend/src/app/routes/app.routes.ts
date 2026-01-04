import { Routes } from '@angular/router';
import { DashboardComponent } from '../layout/dashboard/dashboard.component';
import { ClienteListComponent } from '../features/clientes/pages/cliente-list.component';
import { EventosComponent } from '../features/eventos/pages/eventos.component';
import { PromocionesComponent } from '../features/promociones/page/promociones.component';
import { ConfiguracionGeneralComponent } from '../features/configuracion/pages/configuracion-general.component';

export const routes: Routes = [
  // Ruta principal → Dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'configuracion', component: ConfiguracionGeneralComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },

   // Promociones
   { path: 'promociones', component: PromocionesComponent},
   

  // Cualquier ruta inválida → Dashboard
  { path: '**', redirectTo: 'dashboard' }
];
