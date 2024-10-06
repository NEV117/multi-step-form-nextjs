/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-redundant-roles */
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useState } from "react";

import { PlusIcon } from "../icons";
import { Form } from "../Forms/GenericForm";
import { Confirmation } from "../Forms/Confirmation";

import { useCategories } from "@/hooks/categories/useCategories";

type Field = {
  label: string;
  type: string;
  placeholder?: string;
  options?: { id: number; name: string }[];
};

type FieldsForSteps = {
  [key: number]: Field[];
};

export const CreateProduct = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const { categories } = useCategories();

  const fieldsForSteps: FieldsForSteps = {
    1: [
      { label: "Título", type: "text", placeholder: "Ingresa el título" },
      {
        label: "Descripción",
        type: "textarea",
        placeholder: "Describe el producto",
      },
    ],
    2: [
      {
        label: "Categoría",
        type: "select",
        options: categories.map((cat) => ({ id: cat.id, name: cat.name })),
      },
      { label: "Precio", type: "text", placeholder: "Ingresa el precio" },
    ],
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 3);

      return newStep as 1 | 2 | 3;
    });
  };

  const previousStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 1);

      return newStep as 1 | 2 | 3;
    });
  };

  return (
    <>
      <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
        Add New
      </Button>
      <Modal
        isOpen={isOpen}
        placement="center"
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="text-center">
                  <h1>Crear Producto</h1>
                </div>
                <nav aria-label="Progress" className="pt-4 text-center">
                  <ol
                    className="space-y-4 md:flex md:space-x-8 md:space-y-0"
                    role="list"
                  >
                    <li className="md:flex-1">
                      <span
                        className={`group flex w-full flex-col border-l-4 ${currentStep === 1 ? "border-sky-600" : "border-gray-200"} pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                      >
                        <span
                          className={`text-sm font-medium ${currentStep === 1 ? "text-sky-600" : "text-gray-500"}`}
                        >
                          Información básica
                        </span>
                      </span>
                    </li>
                    <li className="md:flex-1">
                      <span
                        className={`group flex w-full flex-col border-l-4 ${currentStep === 2 ? "border-sky-600" : "border-gray-200"} pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                      >
                        <span
                          className={`text-sm font-medium ${currentStep === 2 ? "text-sky-600" : "text-gray-500"}`}
                        >
                          Detalles adicionales
                        </span>
                      </span>
                    </li>
                    <li className="md:flex-1">
                      <button
                        className={`group flex w-full flex-col border-l-4 ${currentStep === 3 ? "border-sky-600" : "border-gray-200"} pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                      >
                        <span
                          className={`text-sm font-medium ${currentStep === 3 ? "text-sky-600" : "text-gray-500"}`}
                        >
                          Confirmación
                        </span>
                      </button>
                    </li>
                  </ol>
                </nav>
              </ModalHeader>
              <ModalBody className="flex justify-center items-center ">
                {currentStep < 3 ? (
                  <Form
                    fields={fieldsForSteps[currentStep]}
                    step={currentStep}
                    nextStep={nextStep}
                    previousStep={previousStep}
                  />
                ) : (
                  <Confirmation
                    step={currentStep}
                    setStep={setCurrentStep}
                    nextStep={nextStep}
                    previousStep={previousStep}
                    close={onClose}
                  />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
