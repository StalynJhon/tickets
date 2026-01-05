import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaEvento } from '../models/categoria.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

private apiUrl = 'http://localhost:5000/api/categoria'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriaEvento[]> {
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
}