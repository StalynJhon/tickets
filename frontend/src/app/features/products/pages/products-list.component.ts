import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';
import { Product } from '../../../entities/product/product.model';
import { ProductCategory } from '../../../entities/product/product-category.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  filteredProducts = signal<Product[]>([]);
  loading = signal(false);
  showModal = signal(false);
  showCategoryModal = signal(false);
  editMode = signal(false);
  view = signal<'grid' | 'table'>('grid');

  // Filters
  filterCategory = signal('');
  filterSearch = signal('');
  filterAvailable = signal('all');

  // Current editing
  currentProduct: Partial<Product> = this.getEmptyProduct();
  currentCategory: Partial<ProductCategory> = {};

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.filteredProducts.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data)
    });
  }

  applyFilters() {
    let filtered = this.products();

    if (this.filterCategory()) {
      const catId = parseInt(this.filterCategory());
      filtered = filtered.filter(p => p.categoryId === catId);
    }

    if (this.filterSearch()) {
      const search = this.filterSearch().toLowerCase();
      filtered = filtered.filter(p => 
        p.nameProduct.toLowerCase().includes(search) ||
        (p.descriptionProduct?.toLowerCase() || '').includes(search)
      );
    }

    if (this.filterAvailable() !== 'all') {
      const available = this.filterAvailable() === 'true';
      filtered = filtered.filter(p => p.availableProduct === available);
    }

    this.filteredProducts.set(filtered);
  }

  clearFilters() {
    this.filterCategory.set('');
    this.filterSearch.set('');
    this.filterAvailable.set('all');
    this.filteredProducts.set(this.products());
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentProduct = this.getEmptyProduct();
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.editMode.set(true);
    this.currentProduct = { ...product };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.showCategoryModal.set(false);
    this.currentProduct = this.getEmptyProduct();
    this.currentCategory = {};
  }

  saveProduct() {
    if (!this.validateProduct()) {
      return;
    }

    this.loading.set(true);

    if (this.editMode()) {
      this.productService.updateProduct(this.currentProduct.idProduct!, this.currentProduct)
        .subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Producto actualizado correctamente', 'success');
            this.closeModal();
            this.loadData();
          },
          error: () => this.loading.set(false)
        });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success');
          this.closeModal();
          this.loadData();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  deleteProduct(product: Product) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto ${product.nameProduct}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.idProduct!).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado', 'success');
            this.loadData();
          }
        });
      }
    });
  }

  updateStock(product: Product) {
    Swal.fire({
      title: 'Actualizar Stock',
      html: `
        <p>Producto: <strong>${product.nameProduct}</strong></p>
        <p>Stock actual: <strong>${product.stockProduct || 0}</strong></p>
        <input id="newStock" type="number" class="swal2-input" placeholder="Nuevo stock" min="0">
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const input = document.getElementById('newStock') as HTMLInputElement;
        const newStock = parseInt(input.value);
        if (isNaN(newStock) || newStock < 0) {
          Swal.showValidationMessage('Por favor ingresa un valor válido');
          return false;
        }
        return newStock;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value !== undefined) {
        this.productService.updateStock(product.idProduct!, result.value, 'set').subscribe({
          next: () => {
            Swal.fire('¡Actualizado!', 'Stock actualizado correctamente', 'success');
            this.loadData();
          }
        });
      }
    });
  }



  openCategoryModal(isDemo: boolean = false) {
    if (isDemo) {
      this.currentCategory = { 
        nameCategory: 'Categoría Demo', 
        descriptionCategory: 'Categoría de demostración', 
        displayOrder: 0 
      };
    } else {
      this.currentCategory = { nameCategory: '', descriptionCategory: '', displayOrder: 0 };
    }
    this.showCategoryModal.set(true);
  }

  saveCategory() {
    if (!this.currentCategory.nameCategory) {
      Swal.fire('Error', 'El nombre de la categoría es obligatorio', 'error');
      return;
    }

    this.productService.createCategory(this.currentCategory).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Categoría creada correctamente', 'success');
        this.closeModal();
        this.loadData();
      }
    });
  }

  private validateProduct(): boolean {
    if (!this.currentProduct.nameProduct || !this.currentProduct.priceProduct ||
        !this.currentProduct.categoryId) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return false;
    }
    return true;
  }

  private getEmptyProduct(): Partial<Product> {
    return {
      nameProduct: '',
      descriptionProduct: '',
      priceProduct: 0,
      categoryId: 0,
      stockProduct: 0,
      availableProduct: true,
      popularProduct: false,
      newProduct: false,
      discountPercentage: 0,
      imageUrl: ''
    };
  }

  getStockBadgeClass(stock?: number): string {
    if (!stock || stock === 0) return 'stock-critical';
    if (stock <= 5) return 'stock-low';
    if (stock <= 20) return 'stock-medium';
    return 'stock-good';
  }

  getStockLabel(stock?: number): string {
    if (!stock || stock === 0) return 'Agotado';
    if (stock <= 5) return 'Stock Bajo';
    if (stock <= 20) return 'Stock Medio';
    return 'Disponible';
  }

  getCategoryName(categoryId?: number): string {
    if (categoryId === undefined || categoryId === null) return 'Sin categoría';
    const category = this.categories().find(c => c.idProductCategory === categoryId);
    return category?.nameCategory || 'Sin categoría';
  }

  toggleView() {
    this.view.set(this.view() === 'grid' ? 'table' : 'grid');
  }

  addToCart(product: Product) {
    // Lógica para agregar producto al carrito
    // Por ahora, simplemente mostrar un mensaje de confirmación
    Swal.fire({
      title: '¡Producto agregado!',
      text: `${product.nameProduct} ha sido agregado al carrito`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
}
