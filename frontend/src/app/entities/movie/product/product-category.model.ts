export interface ProductCategory {
  idProductCategory?: number;
  nameCategory: string;
  descriptionCategory?: string;
  iconCategory?: string;
  displayOrder?: number;
  stateCategory?: boolean;
  createCategory?: string;
  updateCategory?: string;
  // Additional fields
  totalProductos?: number;
}
