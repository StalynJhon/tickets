export interface Product {
  idProduct?: number;
  nameProduct: string;
  priceProduct: number;
  descriptionProduct?: string;
  categoryId?: number;
  availableProduct?: boolean;
  stockProduct?: number;

  // Campos adicionales usados por la UI
  newProduct?: boolean;
  popularProduct?: boolean;
  hasActiveDiscount?: boolean;
  discountPercentage?: number;
  imageUrl?: string;
  finalPrice?: number;
  ratingProduct?: number;
  voteCount?: number;
  ingredients?: string;
  allergens?: string;
}
