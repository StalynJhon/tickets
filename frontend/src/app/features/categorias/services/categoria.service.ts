import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaEvento } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private API_URL = 'http://localhost:3000/api/categorias';
  // ⬆️ si tu backend es 5000 cámbialo aquí UNA sola vez

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriaEvento[]> {
    return this.http.get<CategoriaEvento[]>(this.API_URL);
  }

  getById(id: number): Observable<CategoriaEvento> {
    return this.http.get<CategoriaEvento>(`${this.API_URL}/${id}`);
  }

  create(categoria: CategoriaEvento): Observable<CategoriaEvento> {
    return this.http.post<CategoriaEvento>(this.API_URL, categoria);
  }

  update(id: number, categoria: CategoriaEvento): Observable<CategoriaEvento> {
    return this.http.put<CategoriaEvento>(`${this.API_URL}/${id}`, categoria);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/toggle`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
