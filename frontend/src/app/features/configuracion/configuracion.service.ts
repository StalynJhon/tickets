import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = 'http://localhost:5000/configuracion';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener configuración general
  getConfiguracionGeneral() {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }

  // 🔹 Guardar configuración general
  guardarConfiguracionGeneral(data: any) {
    return this.http.post(`${this.apiUrl}/general`, data);
  }

  // 🔹 Obtener textos legales
  getTextosLegales() {
    return this.http.get<any>(`${this.apiUrl}/legal`);
  }

  // 🔹 Guardar textos legales
  guardarTextosLegales(data: any) {
    return this.http.post(`${this.apiUrl}/legal`, data);
  }

  // 🔹 Obtener configuración de negocio
  getConfiguracionNegocio() {
    return this.http.get<any>(`${this.apiUrl}/negocio`);
  }

  // 🔹 Guardar configuración de negocio
  guardarConfiguracionNegocio(data: any) {
    return this.http.post(`${this.apiUrl}/negocio`, data);
  }
  
  // 🔹 Obtener información de la empresa (para previsualización)
  getInfoEmpresa() {
    return this.http.get<any>(`${this.apiUrl}/empresa`);
  }

  // 🔹 Obtener términos y condiciones (para previsualización)
  getTerminosCondiciones() {
    return this.http.get<any>(`${this.apiUrl}/terminos`);
  }

  // 🔹 Obtener política de privacidad (para previsualización)
  getPoliticaPrivacidad() {
    return this.http.get<any>(`${this.apiUrl}/privacidad`);
  }

  // 🔹 Obtener ayuda/FAQ (para previsualización)
  getAyudaFAQ() {
    return this.http.get<any>(`${this.apiUrl}/ayuda`);
  }
}