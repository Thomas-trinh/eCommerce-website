export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
  image_url?: string;
  images?: ProductImage[];
  average_rating?: string; // added field
}


export interface ProductImage {
    image_url: string;
    alt_text: string | null;
}

export interface ProductImageInput {
    image_url: string;
    alt_text?: string;
}