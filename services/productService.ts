// services/ProductService.ts
import { IProductService } from "../interfaces/IProductService";
import { IProductRepository } from "../interfaces/IProductRepository";
import { Product } from "../interfaces/models/Product";

export class ProductService implements IProductService {
  constructor(private repo: IProductRepository) {}

  async getAll(): Promise<Product[]> {
    return this.repo.getAll();
  }

  async search(keyword: string, category: string): Promise<Product[]> {
    return category === "all"
      ? this.repo.getBySearch(keyword)
      : this.repo.getBySearchAndCategory(keyword, category);
  }

  async filterProducts(filter: string, keyword: string, category: string): Promise<Product[]> {
    let result = await this.repo.getByFilter(filter);

    if (keyword) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    return result;
  }
}
