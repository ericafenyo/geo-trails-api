import { Model, Document } from "mongoose";

export type Id = string;

export interface FindOptions<T> {
  filter?: Partial<Record<keyof T, any>>;
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
  projection?: Record<string, 0 | 1>;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export abstract class Repository<T extends Document> {
  constructor(protected model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }
}

// findById(id: Id): Promise<T | null>;
// findOne(filter: Partial<T>): Promise<T | null>;
// findMany(options?: FindOptions<T>): Promise<PagedResult<T>>;
// create(data: T): Promise<T>;
// createMany(data: T[]): Promise<T[]>;
// update(id: Id, data: Partial<T>): Promise<T | null>;
// delete(id: Id): Promise<boolean>;
