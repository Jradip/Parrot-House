export type BirdStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "UNAVAILABLE";
export type InventoryType = "INDIVIDUAL" | "QUANTITY";
export type Gender = "MALE" | "FEMALE" | "UNKNOWN";

export interface BirdCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  sortOrder: number;
}

export interface Bird {
  id: string;
  categoryId: string;
  category: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  age: string;
  gender: Gender;
  color: string;
  description: string;
  tameStatus: string;
  inventoryType: InventoryType;
  stock: number;
  status: BirdStatus;
  featured: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
}
