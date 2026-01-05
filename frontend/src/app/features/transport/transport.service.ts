import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { TransportRoute } from '../../entities/transport/transport-route.model';
import { TransportVehicle } from '../../entities/transport/transport-vehicle.model';
import { TransportSchedule } from '../../entities/transport/transport-schedule.model';
import { TransportCompany } from '../../entities/transport/transport-company.model';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private api = inject(ApiService);
  private readonly ENDPOINT = '/transport';

  // ======== COMPANIES ========
  getCompanies(): Observable<TransportCompany[]> {
    return this.api.get<TransportCompany[]>(`${this.ENDPOINT}/empresas`);
  }

  createCompany(company: Partial<TransportCompany>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/empresas`, company);
  }

  // ======== ROUTES ========
  getRoutes(): Observable<TransportRoute[]> {
    return this.api.get<TransportRoute[]>(`${this.ENDPOINT}/rutas`);
  }

  searchRoutes(filters: any): Observable<TransportRoute[]> {
    return this.api.get<TransportRoute[]>(`${this.ENDPOINT}/rutas/buscar`, filters);
  }

  createRoute(route: Partial<TransportRoute>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/rutas`, route);
  }

  updateRoute(id: number, route: Partial<TransportRoute>): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/rutas/${id}`, route);
  }

  deleteRoute(id: number): Observable<any> {
    return this.api.delete(`${this.ENDPOINT}/rutas/${id}`);
  }

  // ======== VEHICLES ========
  getCompanyVehicles(companyId: number): Observable<TransportVehicle[]> {
    return this.api.get<TransportVehicle[]>(`${this.ENDPOINT}/empresas/${companyId}/vehiculos`);
  }

  createVehicle(companyId: number, vehicle: Partial<TransportVehicle>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/empresas/${companyId}/vehiculos`, vehicle);
  }

  updateVehicleStatus(vehicleId: number, status: string): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/vehiculos/${vehicleId}/estado`, { statusVehicle: status });
  }

  // ======== SCHEDULES ========
  getVehicleSchedules(vehicleId: number): Observable<TransportSchedule[]> {
    return this.api.get<TransportSchedule[]>(`${this.ENDPOINT}/vehiculos/${vehicleId}/horarios`);
  }

  createSchedule(schedule: Partial<TransportSchedule>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/horarios`, schedule);
  }

  updateScheduleStatus(scheduleId: number, status: string): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/horarios/${scheduleId}/estado`, { statusSchedule: status });
  }

  // ======== STATISTICS ========
  getStatistics(): Observable<any> {
    return this.api.get(`${this.ENDPOINT}/estadisticas`);
  }
}
