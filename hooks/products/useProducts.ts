/* eslint-disable prettier/prettier */
"use client";
import { useState, useEffect } from "react";

import { env } from "@/config/env";
import { Product } from "@/types";

interface Filters {
  title?: string;
  priceMin?: number;
  priceMax?: number;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export const useProducts = (initialFilters: Filters = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [totalPages] = useState<number>(1);

  const fetchProducts = async (filters: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters.title) queryParams.append("title", filters.title);
      if (filters.priceMin)
        queryParams.append("price_min", filters.priceMin.toString());
      if (filters.priceMax)
        queryParams.append("price_max", filters.priceMax.toString());
      if (filters.categoryId)
        queryParams.append("categoryId", filters.categoryId.toString());
      if (filters.page) queryParams.append("offset", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      const response = await fetch(
        `${env.HOSTNAME}/products/?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Error fetching products");

      const data = await response.json();

      const sortedProducts = data.sort((a: Product, b: Product) => {
        return new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime();
      });

      setProducts(sortedProducts || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  return { products, loading, error, totalPages, setFilters };
};
