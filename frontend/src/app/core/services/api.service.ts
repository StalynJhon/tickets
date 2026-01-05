import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = ''; // Opcional: configurar base desde environment si se desea
  private isServer: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isServer = isPlatformServer(this.platformId);
  }

  get<T>(path: string, params?: any): Observable<T> {
    if (this.isServer) {
      // Evitar peticiones externas durante prerender/SSR: devolver un valor vacío razonable
      return of([] as unknown as T);
    }

    let httpParams = undefined as any;
    if (params) {
      httpParams = new HttpParams({ fromObject: params });
    }
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    if (this.isServer) return of(null as unknown as T);
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    if (this.isServer) return of(null as unknown as T);
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    if (this.isServer) return of(null as unknown as T);
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
