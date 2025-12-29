import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  private apiUrl = 'http://localhost:5000/promotions';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas las promociones
  getPromociones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔹 Crear promoción
  crearPromocion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 🔹 Actualizar promoción
  actualizarPromocion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // 🔹 Eliminar promoción
  eliminarPromocion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
