export interface IDeliveryMethod {
  _id?: string;
  name: string;
  type: "PATHAO" | "REDX" | "STEDFAST" | "CARRYBEE" | "OTHERS";
  accountPhone: string;
  clientId: string;
  clientSecret: string;
  clientEmail: string;
  clientPassword: string;
  clientStoreId: string;
  defaultShippingNote?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
