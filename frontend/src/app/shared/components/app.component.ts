import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  eventosSubmenuOpen = false; // controla el submenu de Eventos

  constructor(public router: Router) {}

  // Métodos de navegación (opcionales si sigues usando routerLink directo)
  irDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  irClientes(event: Event) {
    event.preventDefault();
    this.router.navigate(['/clientes']);
  }

  irEventos(event: Event) {
    event.preventDefault();
    this.router.navigate(['/eventos']);
  }

  irPromociones(event: Event) {
    event.preventDefault();
    this.router.navigate(['/promociones']);
  }

  irConfiguracion(event: Event) {
    event.preventDefault();
    this.router.navigate(['/configuracion']);
  }

  // Nuevo método para abrir/cerrar el submenu
  toggleEventosSubmenu(event: Event) {
    event.preventDefault(); // evita que el click recargue la página
    this.eventosSubmenuOpen = !this.eventosSubmenuOpen;
  }
}
