import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html'
})
export class AppComponent {

  // 👇 CLAVE: router debe ser PUBLIC
  constructor(public router: Router) {}

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
}
