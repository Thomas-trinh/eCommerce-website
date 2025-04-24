// interfaces/IProductRepository.ts
import { Product } from "./models/Product";

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getBySearch(keyword: string): Promise<Product[]>;
  getBySearchAndCategory(keyword: string, category: string): Promise<Product[]>;
  getByFilter(filter: string): Promise<Product[]>;
}
