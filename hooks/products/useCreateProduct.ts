/* eslint-disable prettier/prettier */
import { useState } from "react";

import { env } from "@/config/env";
import { ProductPayload } from "@/types";

export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
  
    const createProduct = async (ProductPayload: ProductPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
  
      const categoryId = ProductPayload["Categoría"][0];
  
      const payload = {
        title: ProductPayload["Título"],
        price: parseFloat(ProductPayload["Precio"]),
        description: ProductPayload["Descripción"],
        categoryId: categoryId,
        images: ["https://i.imgur.com/1twoaDy.jpeg"],
      };
  
      try {
        const response = await fetch(
            `${env.HOSTNAME}/products/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error al crear el producto: ${response.statusText}`);
        }
  
        const data = await response.json();

        if (data){
            setSuccess(true)
        }

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error Interno 500");
        setSuccess(false); 
      } finally {
        setLoading(false);
      }
    };
  
    return { createProduct, loading, error, success };
  };
  