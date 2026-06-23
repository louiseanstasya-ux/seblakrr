export interface IMenu {
  _id: string;
  merchantId: string;
  image: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  originalPrice?: number;
  section: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
