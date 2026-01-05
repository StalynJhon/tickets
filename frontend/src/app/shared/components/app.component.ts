import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationStart, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <div *ngIf="cargando" class="loading-bar"></div>

      <nav class="sidebar">
        <div class="sidebar-header">
          <span class="logo-icon">🎟️</span>
          <h2>Tickets Master</h2>
        </div>
        
        <ul class="nav-links">
          <li><a (click)="irDashboard($event)" [class.active]="router.url === '/dashboard'">🏠 Inicio</a></li>
          <li><a (click)="irClientes($event)" [class.active]="router.url === '/clientes'">👥 Clientes</a></li>
          <li><a (click)="irEventos($event)" [class.active]="router.url === '/eventos'">🎭 Eventos</a></li>
          <li><a (click)="irCategorias($event)" [class.active]="router.url.includes('/categorias')">📁 Categorías</a></li>
        </ul>

        <div class="sidebar-footer">
          <div class="security-badge">🔒 AES-256 Enabled</div>
        </div>
      </nav>

      <div class="main-wrapper">
        <header class="topbar">
          <div class="topbar-left">
            <span class="breadcrumb">Administración / <b>{{ obtenerTitulo() }}</b></span>
          </div>
          <div class="topbar-right">
            <div class="user-pill">
              <span class="status-dot"></span>
              Admin Sistema
            </div>
          </div>
        </header>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --sidebar-width: 260px; 
      --primary-blue: #2563eb; 
      --cyan-bright: #00f2fe;
      --topbar-height: 70px; 
    }

    .app-layout { display: flex; height: 100vh; width: 100vw; background: #f8fafc; overflow: hidden; position: relative; }

    /* Estilo de la barra de carga neón */
    .loading-bar {
      position: fixed;
      top: 0;
      left: var(--sidebar-width);
      right: 0;
      height: 6px;
      background: var(--cyan-bright);
      box-shadow: 0 0 15px var(--cyan-bright);
      z-index: 9999;
      animation: loadingAnim 2s infinite ease-in-out;
    }

    @keyframes loadingAnim {
      0% { width: 0%; left: var(--sidebar-width); }
      50% { width: 100%; left: var(--sidebar-width); }
      100% { width: 0%; left: 100%; }
    }

    .sidebar { width: var(--sidebar-width); background: #1e293b; color: white; display: flex; flex-direction: column; height: 100vh; flex-shrink: 0; z-index: 200; }
    .sidebar-header { padding: 30px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #334155; }
    .nav-links { list-style: none; padding: 20px 10px; margin: 0; flex-grow: 1; }
    .nav-links a { display: flex; align-items: center; gap: 12px; padding: 12px 15px; color: #94a3b8; text-decoration: none; border-radius: 10px; cursor: pointer; transition: 0.3s; }
    .nav-links a.active { background: var(--primary-blue); color: white; }
    .sidebar-footer { padding: 20px; border-top: 1px solid #334155; }
    .security-badge { background: #0f172a; padding: 10px; border-radius: 8px; font-size: 11px; color: #38bdf8; text-align: center; font-weight: 600; }

    .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; height: 100vh; }
    .topbar { height: var(--topbar-height); background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
    .user-pill { background: #f1f5f9; padding: 8px 16px; border-radius: 50px; font-size: 13px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }

    .main-content { flex-grow: 1; overflow-y: auto; padding: 40px; background: #f8fafc; scroll-behavior: smooth; }
  `]
})
export class AppComponent {
  title = 'frontend-ticket';
  cargando = false;

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cargando = true;
      } else if (event instanceof NavigationEnd) {
        // Mantenemos 2 segundos para que confirmes que la ves
        setTimeout(() => this.cargando = false, 2000);
      }
    });
  }

  obtenerTitulo(): string {
    const url = this.router.url;
    if (url.includes('/categorias')) return 'Categorías de Eventos';
    if (url.includes('/clientes')) return 'Gestión de Clientes';
    if (url.includes('/eventos')) return 'Lista de Eventos';
    return 'Panel de Control';
  }

  irDashboard(event: Event) { event.preventDefault(); this.router.navigate(['/dashboard']); }
  irClientes(event: Event) { event.preventDefault(); this.router.navigate(['/clientes']); }
  irEventos(event: Event) { event.preventDefault(); this.router.navigate(['/eventos']); }
  irCategorias(event: Event) { event.preventDefault(); this.router.navigate(['/categorias']); }
}