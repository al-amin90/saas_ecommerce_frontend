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
  originalPrice: number;
  categoryID: string;
  variant: IVariant[];
  images?: string[];
  existingImages?: string[];
  sizeChartId?: string;
  sku: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IImageItem {
  id: string;
  type: "existing" | "new";
  url: string; // existing এর জন্য cloudinary url
  file?: File; // new এর জন্য file
  preview: string; // display এর জন্য
}
