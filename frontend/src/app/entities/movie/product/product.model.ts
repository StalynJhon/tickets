export interface Product {
  idProduct?: number;
  nameProduct: string;
  descriptionProduct?: string;
  priceProduct: number;
  ingredients?: string;
  allergens?: string;
  availableProduct?: boolean;
  stockProduct?: number;
  popularProduct?: boolean;
  newProduct?: boolean;
  discountPercentage?: number;
  discountStartDate?: Date | string;
  discountEndDate?: Date | string;
  ratingProduct?: number;
  voteCount?: number;
  stateProduct?: boolean;
  categoryId: number;
  createProduct?: string;
  updateProduct?: string;
  imageUrl?: string;
  // Additional fields
  nameCategory?: string;
  finalPrice?: number;
  hasActiveDiscount?: boolean;
  stockStatus?: 'bajo' | 'medio' | 'alto';
}
