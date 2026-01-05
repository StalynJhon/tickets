import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TransportService } from '../transport.service';
import { TransportRoute } from '../../../entities/transport/transport-route.model';
import { TransportCompany } from '../../../entities/transport/transport-company.model';

@Component({
  selector: 'app-transport-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transport-routes.component.html',
  styleUrl: './transport-routes.component.css'
})
export class TransportRoutesComponent implements OnInit {
  private transportService = inject(TransportService);

  routes = signal<TransportRoute[]>([]);
  companies = signal<TransportCompany[]>([]);
  filteredRoutes = signal<TransportRoute[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editMode = signal(false);

  // Filter properties
  filterOrigin = signal('');
  filterDestination = signal('');
  filterType = signal('');

  // Form data
  currentRoute: Partial<TransportRoute> = this.getEmptyRoute();

  transportTypes = [
    { value: 'bus', label: '🚌 Bus' },
    { value: 'metro', label: '🚇 Metro' },
    { value: 'flight', label: '✈️ Vuelo' },
    { value: 'train', label: '🚂 Tren' },
    { value: 'taxi', label: '🚕 Taxi' },
    { value: 'boat', label: '⛵ Barco' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    let operacionesPendientes = 2; // rutas y empresas
    
    const marcarOperacionCompleta = () => {
      operacionesPendientes--;
      if (operacionesPendientes <= 0) {
        this.loading.set(false);
      }
    };
    
    // Cargar rutas
    this.transportService.getRoutes().subscribe({
      next: (data) => {
        // Asegurarse de que data sea un array y no null/undefined
        if (Array.isArray(data)) {
          this.routes.set(data);
          this.filteredRoutes.set(data);
        } else {
          console.warn('Datos de rutas no válidos:', data);
          this.routes.set([]);
          this.filteredRoutes.set([]);
        }
        marcarOperacionCompleta();
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        // Mostrar un mensaje más específico para rutas también
        let errorMessage = 'No se pudieron cargar las rutas';
        if (error.status === 0) {
          errorMessage += ': No se puede conectar con el servidor. Asegúrate de que el backend esté corriendo.';
        } else {
          errorMessage += ': ' + (error.error?.message || error.message || 'Error desconocido');
        }
        Swal.fire('Error', errorMessage, 'error');
        marcarOperacionCompleta(); // Aún marcar como completada para que se detenga el loading
      }
    });

    // Cargar empresas
    this.transportService.getCompanies().subscribe({
      next: (data) => {
        // Asegurarse de que data sea un array y no null/undefined
        if (Array.isArray(data)) {
          this.companies.set(data);
        } else {
          console.warn('Datos de empresas no válidos:', data);
          this.companies.set([]);
        }
        marcarOperacionCompleta();
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        // Mostrar un mensaje más específico
        let errorMessage = 'No se pudieron cargar las empresas';
        if (error.status === 0) {
          errorMessage += ': No se puede conectar con el servidor. Asegúrate de que el backend esté corriendo.';
        } else {
          errorMessage += ': ' + (error.error?.message || error.message || 'Error desconocido');
        }
        Swal.fire('Error', errorMessage, 'error');
        marcarOperacionCompleta(); // Aún marcar como completada para que se detenga el loading
      }
    });
  }

  applyFilters() {
    let filtered = this.routes();

    if (this.filterOrigin()) {
      filtered = filtered.filter(r => 
        r.origin.toLowerCase().includes(this.filterOrigin().toLowerCase())
      );
    }

    if (this.filterDestination()) {
      filtered = filtered.filter(r => 
        r.destination.toLowerCase().includes(this.filterDestination().toLowerCase())
      );
    }

    if (this.filterType()) {
      filtered = filtered.filter(r => r.transportType === this.filterType());
    }

    this.filteredRoutes.set(filtered);
  }

  clearFilters() {
    this.filterOrigin.set('');
    this.filterDestination.set('');
    this.filterType.set('');
    this.filteredRoutes.set(this.routes());
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentRoute = this.getEmptyRoute();
    this.showModal.set(true);
  }

  openEditModal(route: TransportRoute) {
    this.editMode.set(true);
    this.currentRoute = { ...route };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.currentRoute = this.getEmptyRoute();
  }

  saveRoute() {
    if (!this.validateRoute()) {
      return;
    }

    this.loading.set(true);

    // Crear una copia del currentRoute para no modificar el original
    const routeToSave = { ...this.currentRoute };
    
    // Si no se seleccionó empresa, remover el campo para que sea opcional
    if (!routeToSave.companyId || routeToSave.companyId === 0) {
      delete routeToSave.companyId;
    }

    if (this.editMode()) {
      this.transportService.updateRoute(this.currentRoute.idTransportRoute!, routeToSave)
        .subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Ruta actualizada correctamente', 'success');
            this.closeModal();
            this.loadData();
          },
          error: (error) => {
            console.error('Error al actualizar ruta:', error);
            this.loading.set(false);
            Swal.fire('Error', 'No se pudo actualizar la ruta: ' + (error.error?.message || 'Error desconocido'), 'error');
          }
        });
    } else {
      this.transportService.createRoute(routeToSave).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Ruta creada correctamente', 'success');
          this.closeModal();
          this.loadData();
        },
        error: (error) => {
          console.error('Error al crear ruta:', error);
          this.loading.set(false);
          Swal.fire('Error', 'No se pudo crear la ruta: ' + (error.error?.message || 'Error desconocido'), 'error');
        }
      });
    }
  }

  deleteRoute(route: TransportRoute) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la ruta ${route.routeName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transportService.deleteRoute(route.idTransportRoute!).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La ruta ha sido eliminada', 'success');
            this.loadData();
          }
        });
      }
    });
  }



  private validateRoute(): boolean {
    if (!this.currentRoute.routeName || !this.currentRoute.origin || 
        !this.currentRoute.destination || !this.currentRoute.transportType) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return false;
    }
    return true;
  }

  private getEmptyRoute(): Partial<TransportRoute> {
    return {
      routeName: '',
      origin: '',
      destination: '',
      transportType: 'bus',
      distanceKm: 0,
      estimatedDuration: 0,
      routeCode: '',
      tollCosts: 0,
      statusRoute: 'active'
    };
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'suspended': return 'badge-warning';
      case 'maintenance': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'suspended': return 'Suspendido';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  }
}
