import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ClienteListComponent } from './features/clientes/cliente-list.component';
import { RegistroComponent } from './features/registro/registro.component';
import { EventosComponent } from './features/eventos/eventos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'eventos', component: EventosComponent },

  // Clientes
  { path: 'clientes', component: ClienteListComponent },
  { path: 'registro', component: RegistroComponent  },

  { path: '**', redirectTo: 'login' }
];
