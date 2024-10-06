/* eslint-disable prettier/prettier */
"use client";
import { useEffect, useState } from "react";
import { cache } from "react";

import { ProductCategory } from "../../types";

import { env } from "@/config/env";
const fetchCategories = cache(async () => {
  const apiUrl = env.HOSTNAME;
  const response = await fetch(`${apiUrl}/categories/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json() as Promise<ProductCategory[]>;
});

export const useCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoriesLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
  
        setCategories(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return { categories, categoriesLoading, error };
};
