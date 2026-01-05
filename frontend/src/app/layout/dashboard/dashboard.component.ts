import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  irCategorias(event: Event) {
    event.preventDefault();
    this.router.navigate(['/categorias']); // Esta es la línea mágica
  }

  irClientes(event: Event) {
    event.preventDefault();
    this.router.navigate(['/clientes']);
  }

  irEventos(event: Event) {
    event.preventDefault();
    this.router.navigate(['/eventos']);
  }
}