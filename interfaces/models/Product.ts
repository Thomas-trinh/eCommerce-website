export interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
    reviews: string;
    created_at: Date;
    updated_at: Date;
    image_url: string;
    description: string;
    category: string;
    quantity: number;
}