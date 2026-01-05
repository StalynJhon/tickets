import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../entities/product/product.model';
import { ProductCategory } from '../../entities/product/product-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = inject(ApiService);
  private readonly ENDPOINT = '/products';

  // ======== CATEGORIES ========
  getCategories(): Observable<ProductCategory[]> {
    return this.api.get<ProductCategory[]>(`${this.ENDPOINT}/categorias`);
  }

  createCategory(category: Partial<ProductCategory>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/categorias`, category);
  }

  updateCategory(id: number, category: Partial<ProductCategory>): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/categorias/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.api.delete(`${this.ENDPOINT}/categorias/${id}`);
  }

  // ======== PRODUCTS ========
  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.ENDPOINT}/productos`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.ENDPOINT}/categorias/${categoryId}/productos`);
  }

  searchProducts(filters: any): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.ENDPOINT}/productos/buscar`, filters);
  }

  createProduct(product: Partial<Product>): Observable<any> {
    return this.api.post(`${this.ENDPOINT}/productos`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/productos/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`${this.ENDPOINT}/productos/${id}`);
  }

  updateStock(id: number, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set'): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/productos/${id}/stock`, { quantity, operation });
  }

  getLowStock(limit: number = 5): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.ENDPOINT}/productos/stock-bajo`, { limite: limit });
  }

  applyDiscount(id: number, discount: any): Observable<any> {
    return this.api.put(`${this.ENDPOINT}/productos/${id}/descuento`, discount);
  }

  // ======== STATISTICS ========
  getStatistics(): Observable<any> {
    return this.api.get(`${this.ENDPOINT}/estadisticas`);
  }
}
