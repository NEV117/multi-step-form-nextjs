/* eslint-disable prettier/prettier */
import { useState } from "react";

interface ProductData {
  Título: string;
  Descripción: string;
  Categoría: number[]; 
  Precio: string; 
}

const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState(false);

  const createProduct = async (productData: ProductData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const categoryId = productData["Categoría"][0]; 

    const payload = {
      title: productData["Título"],
      price: parseFloat(productData["Precio"]), 
      description: productData["Descripción"],
      categoryId: categoryId, 
      images: ["https://placeimg.com/640/480/any"], 
    };

    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/products/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Error al crear el producto");
      }

      setSuccess(true);

      return await response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error, success };
};

export default useCreateProduct;
