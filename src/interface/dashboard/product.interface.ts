export interface IStock {
  size: number;
  quantity: number;
  _id?: string;
}

export interface IVariant {
  color: string; // color _id
  stock: IStock[];
  _id?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  slug?: string;
  price: number;
  discountPrice: number;
  categoryID: string;
  variant: IVariant[];
  images?: string[];
  sku: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
