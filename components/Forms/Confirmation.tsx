/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { ModalFooter } from "@nextui-org/modal";

import { EditIcon, InfoIcon } from "../icons";

import { MultiSelectForm } from "./MultiSelectForm";

import { useForm } from "@/context/FormContext ";
import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import { AllFields } from "@/types";



interface ConfirmationProps {
  fields: AllFields;
  step: number;
  nextStep: (data: any) => void;
  previousStep: (data: any) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  close: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  fields,
  step,
  nextStep,
  previousStep,
  close,
}) => {
  const { formData } = useForm();
  const storedFormData = localStorage.getItem("formData");
  const parsedStoredData = storedFormData ? JSON.parse(storedFormData) : {};

  step = 3;

  const finalData = { ...parsedStoredData, ...formData };
  const hasData = Object.keys(finalData).length > 0;

  const { createProduct, loading, error, success } = useCreateProduct();

  const [mode, setMode] = useState<"edit" | "confirm">("confirm");

  const handleSubmit = async () => {
    if (hasData) {
      try {
        await createProduct({
          Título: finalData["Título"],
          Descripción: finalData["Descripción"],
          Categoría: finalData["Categoría"],
          Precio: finalData["Precio"],
        });

        if (success) {
          close();
        }
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
            <>
              {mode === "confirm" ? (
                <div className="relative"> {/* Contenedor para posición relativa */}
                  <Button 
                    isIconOnly 
                    color="primary" 
                    variant="bordered" 
                    onPress={() => setMode("edit")}
                    className="absolute right-4 top-0" // Posiciona el botón en la esquina superior derecha
                  >
                    <EditIcon />
                  </Button>
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
                </div>
              ) : (
                <>
                  {Object.keys(fields).map((key) => (
                    <div key={key}>
                      <MultiSelectForm
                        fields={fields[key]}
                        navigation={false}
                        nextStep={nextStep}
                        previousStep={previousStep}
                        step={parseInt(key)}
                      />
                    </div>
                  ))}
                  <Button color="primary" onPress={() => setMode("confirm")}>
                    Confirmar Información
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center text-gray-500">
              <InfoIcon className="mr-2" height={16} size={16} width={16} />
              <p>No hay datos para confirmar.</p>
            </div>
          )}
        </CardBody>

        <Divider />

        <ModalFooter className="flex flex-col">
          <div className="flex justify-end gap-3 w-full">
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
              <Button color="primary" disabled={loading} onPress={handleSubmit}>
                {loading ? "Creando..." : "Enviar"}
              </Button>
            )}
          </div>

          <div className="mt-2 text-center">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && (
              <p style={{ color: "green" }}>Producto creado exitosamente!</p>
            )}
          </div>
        </ModalFooter>
      </Card>
    </div>
  );
};
