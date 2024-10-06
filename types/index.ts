import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}
export interface Product {
  creationAt: string | number | Date;
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
}

export interface ProductPayload {
  Título: string;
  Descripción: string;
  Categoría: number[];
  Precio: string;
}

export type Field = {
  label: string;
  type: string;
  placeholder?: string;
  options?: { id: number; name: string }[];
};

export type AllFields = {
  [key: string]: Field[];
};
