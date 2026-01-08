import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { DashboardRefreshService } from './dashboard-refresh.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  stats: any;
  eventos: any[] = [];
  clientes: any[] = [];

  private chartEventos!: Chart;

  constructor(
    private dashboardService: DashboardService,
    private refreshService: DashboardRefreshService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();

    // Actualiza automáticamente cuando se crea cliente/evento
    this.refreshService.onRefresh().subscribe(() => {
      this.cargarDashboard();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  cargarDashboard() {
    this.dashboardService.getEstadisticasGenerales()
      .subscribe(res => {
        this.stats = res;
        this.actualizarChart();
      });

    this.dashboardService.getProximosEventos()
      .subscribe(res => this.eventos = res);

    this.dashboardService.getClientesRecientes()
      .subscribe(res => this.clientes = res);
  }

  initChart() {
    this.chartEventos = new Chart('eventosChart', {
      type: 'bar',
      data: {
        labels: ['Activos', 'Hoy', 'Esta Semana'],
        datasets: [{
          label: 'Eventos',
          data: [0, 0, 0],
          backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }

  actualizarChart() {
    if (!this.chartEventos || !this.stats) return;

    this.chartEventos.data.datasets[0].data = [
      this.stats.eventosActivos,
      this.stats.eventosHoy,
      this.stats.eventosSemana
    ];

    this.chartEventos.update();
  }
}
