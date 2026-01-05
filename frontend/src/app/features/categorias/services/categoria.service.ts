import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CategoriaEvento } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private API_URL = 'http://localhost:3000/api/categorias';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriaEvento[]> {
    return this.http.get<CategoriaEvento[]>(this.API_URL);
  }
create(categoria: any): Observable<any> {
 
  return this.http.post('http://localhost:3000/api/categorias', categoria);
}
 
  getById(id: number): Observable<any> {
    return of(null); 
  }

 update(id: number, categoria: any): Observable<any> {
  return this.http.put(`http://localhost:3000/api/categorias/${id}`, categoria);
}

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/toggle`, {});
  }

delete(id: number): Observable<any> {
  return this.http.delete(`${this.API_URL}/${id}`);
}
}