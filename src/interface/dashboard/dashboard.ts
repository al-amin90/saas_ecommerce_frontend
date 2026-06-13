export interface ICategory {
  _id?: string;
  name: string;
}

export interface IColor {
  _id?: string;
  name: string;
  color: string;
}

export interface IChartRow {
  size: number;
  innerLength?: number;
  feetLength?: number;
  ageRange?: string;
  note?: string;
}

export interface ISizeChart {
  _id: string;
  chartName: string;
  brand?: string;
  targetGroup?: "kids" | "men" | "women" | "unisex";
  rows: IChartRow[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Add to existing interfaces
export interface IBanner {
  _id?: string;
  title: string;
  subTitle?: string;
  colorHex?: string;
  image?: string;
  description?: string;
  productID?:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
        images: string[];
        discountPrice: number;
        price: number;
      }
    | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBannerFormData {
  title: string;
  subTitle?: string;
  colorHex?: string;
  image?: File | string;
  description?: string;
  productID?: string;
  isActive?: boolean;
}
