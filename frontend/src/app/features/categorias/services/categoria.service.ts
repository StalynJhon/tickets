import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { Observable, of } from 'rxjs';
import { CategoriaEvento } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private API_URL = 'http://localhost:3000/api/categorias';
=======
import { Observable } from 'rxjs';
import { CategoriaEvento } from '../models/categoria.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

private apiUrl = 'http://localhost:5000/api/categoria'; 
>>>>>>> 8e1e18bb39aac4825265ea812680aa1d586188f4

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriaEvento[]> {
<<<<<<< HEAD
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
=======
    return this.http.get<CategoriaEvento[]>(this.apiUrl);
  }

  getById(id: number): Observable<CategoriaEvento> {
    return this.http.get<CategoriaEvento>(`${this.apiUrl}/${id}`);
  }

  create(categoria: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoria);
  }

  update(id: number, categoria: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, categoria);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle`, {});
  }
>>>>>>> 8e1e18bb39aac4825265ea812680aa1d586188f4
}