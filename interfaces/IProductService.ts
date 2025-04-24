import { Product } from "./models/Product";

export interface IProductService {
    getAll(): Promise<Product[]>;
    search(keyword: string, category: string): Promise<Product[]>;
    filterProducts(filter: string, keyword: string, category: string): Promise<Product[]>;
}

export interface ProductSearchBody {
    filter?: string;
    keyword?: string;
    category?: string;
}