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
