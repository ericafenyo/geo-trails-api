export interface ResourceData<T> {
  id: string;
  type: string;
  attributes: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export class Resource<T> {
  private constructor(public readonly data: ResourceData<T>) {}

  static create<T>(data: ResourceData<T>): Resource<T> {
    return new Resource(data);
  }
}

export class PaginatedResource<T> {
  private constructor(
    public readonly data: ResourceData<T>[],
    public readonly meta: PaginationMeta,
  ) {}

  static create<T>(data: ResourceData<T>[], meta: PaginationMeta): PaginatedResource<T> {
    return new PaginatedResource(data, meta);
  }
}
