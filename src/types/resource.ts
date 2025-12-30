export interface ResourceData<T> {
  id?: string;
  type: string;
  attributes: T;
}

export interface Exception {
  status: string;
  code: string;
  title: string;
  detail: string;
}

export type ResourceIdentifier = {
  id: string;
  type: string;
};

export interface Attributes {
  [key: string]: any;
}

export class Resource<T> {
  private constructor(public readonly data: ResourceData<T>) {}

  static create<T>(data: ResourceData<T>): Resource<T> {
    return new Resource(data);
  }
}
