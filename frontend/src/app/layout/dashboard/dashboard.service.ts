import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:5000/admin/dashboard';

  constructor(private http: HttpClient) {}

  getEstadisticasGenerales(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/estadisticas`);
  }

  getProximosEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/eventos/proximos`);
  }

  getClientesRecientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/clientes/recientes`);
  }
}
