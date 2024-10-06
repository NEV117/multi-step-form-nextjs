/* eslint-disable prettier/prettier */
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { ModalFooter } from "@nextui-org/modal";

import { InfoIcon } from "../icons";

import { useForm } from "@/context/FormContext ";
import useCreateProduct from "@/hooks/products/useCreateProduct";

interface SelectOption {
  id: number;
  name: string;
}
interface Field {
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: SelectOption[];
}

interface ConfirmationProps {
  step: number;
  nextStep: (data: any) => void;
  previousStep: (data: any) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  close: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  step,
  nextStep,
  previousStep,
  setStep,
  close,
}) => {
  const { formData } = useForm(); // Obtener datos del contexto
  const storedFormData = localStorage.getItem("formData");
  const parsedStoredData = storedFormData ? JSON.parse(storedFormData) : {};
  step = 3;

  /* const goToStep = (stepNumber: 1 | 2 | 3) => { 
    setStep(stepNumber); 
  }; */
 
  // Combinar datos del contexto y del almacenamiento local
  const finalData = { ...parsedStoredData, ...formData };

  const hasData = Object.keys(finalData).length > 0; 
  const { createProduct, loading, error, success } = useCreateProduct();

  const handleSubmit = async () => {
    if (hasData) {
      try {
        await createProduct({
          Título: finalData["Título"],
          Descripción: finalData["Descripción"],
          Categoría: finalData["Categoría"],
          Precio: finalData["Precio"],
        });
        close(); 
      } catch (err) {
        console.error("Error al crear el producto:", err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full" shadow="none">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-bold">Confirmación de Datos</p>
            <p className="text-small text-default-500">
              Revisa y confirma tus datos.
            </p>
          </div>
        </CardHeader>     
        <Divider />
        <CardBody className="w-full">
          {hasData ? (
            <ul>
              {Object.entries(finalData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}: </strong>
                  {typeof value === "string" || typeof value === "number"
                    ? value
                    : JSON.stringify(value)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center text-gray-500">
              <InfoIcon className="mr-2 " height={16} size={16} width={16} />
              <p>No hay datos para confirmar.</p>
            </div>
          )}
        </CardBody>
        <Divider />

        <ModalFooter className="pt-2 pb-4">
          {/* <div>
            <h2>Confirmación</h2>
            <button onClick={() => goToStep(1)}>Ir a Paso 1</button>
            <button onClick={() => goToStep(2)}>Ir a Paso 2</button>
            <button onClick={() => goToStep(3)}>Ir a Paso 3</button>
          </div> 
          */}
          {step > 1 && (
            <Button color="primary" variant="bordered" onPress={previousStep}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button color="primary" onPress={nextStep}>
              Next
            </Button>
          ) : (
            <Button color="primary" onPress={handleSubmit} disabled={loading}>
              {loading ? "Creando..." : "Submit"}
            </Button>
          )}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {success && (
            <p style={{ color: "green" }}>Producto creado exitosamente!</p>
          )}
        </ModalFooter>
      </Card>
    </div>
  );
};
