import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  private apiUrl = 'http://localhost:5000/concert';

  constructor(private http: HttpClient) {}

  // 🎤 ARTISTAS
  getArtistas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/artistas`);
  }

  crearArtista(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/artistas`, data);
  }

  actualizarEstadoArtista(id: number, statusArtist: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/artistas/${id}/estado`, { statusArtist });
  }

  // 🏟️ VENUES
  getVenues(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/venues`);
  }

  crearVenue(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/venues`, data);
  }

  // 🎶 CONCIERTOS
  getConciertos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conciertos`);
  }

  crearConcierto(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/conciertos`, data);
  }

  // 📊 ESTADÍSTICAS
  getEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`);
  }
}
