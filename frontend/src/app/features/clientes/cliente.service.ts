import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:5000/cliente';

  constructor(private http: HttpClient) {}

  // ===============================
  // OBTENER CLIENTES
  // ===============================
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lista`);
  }

  // ===============================
  // CREAR CLIENTE
  // ===============================
  crearCliente(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, data);
  }

  // ===============================
  // ACTUALIZAR CLIENTE (GENERAL)
  // ===============================
  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, data);
  }

  // ===============================
  // CAMBIAR ESTADO (ACTIVO / INACTIVO)
  // ===============================
  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${id}`,
      { estado }
    );
  }

  // ===============================
  // ELIMINAR CLIENTE
  // ===============================
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
