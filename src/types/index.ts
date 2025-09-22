export interface Product {
  sku: string;
  name: string;
  price: number;
}

export interface QuoteProduct extends Product {
  quantity: number;
}

export interface QuoteData {
  number: string;
  date: string;
  client: {
    name: string;
    contact: string;
    address: string;
    location: string;
  };
  products: QuoteProduct[];
  discount: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ViewType = 'quote' | 'products' | 'history';