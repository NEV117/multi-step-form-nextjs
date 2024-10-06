/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */ 
import {
  Select,
  SelectItem,
} from "@nextui-org/select";
import { Input, Textarea } from "@nextui-org/input";
import { useState, useEffect } from "react";
import { ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { capitalize } from "@/utils/capitalize";
import { useForm } from "@/context/FormContext ";

interface Option {
  id: number;
  name: string;
}

interface Field {
  label: string;
  type: string;
  placeholder?: string;
  options?: Option[];
}

interface FormProps {
  fields: Field[];
  step: number;
  nextStep: (data: any) => void;
  previousStep: (data: any) => void;
}

export const Form: React.FC<FormProps> = ({
  fields,
  step,
  nextStep,
  previousStep,
}) => {
  const { formData, updateFormData } = useForm();
  const [selectedDropdown, setSelectedDropdown] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true); 
  const {  onClose,  } = useDisclosure();

  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      updateFormData(parsedData);

      const initialDropdownValue = Array.isArray(parsedData["Categoría"])
        ? parsedData["Categoría"].map((cat: number) => cat.toString())
        : parsedData["Categoría"]?.toString() || [];

      setSelectedDropdown(initialDropdownValue);
    }
  }, []);

  const handleChange = (label: string, value: any) => {
    updateFormData({ [label]: value });
  };

  const handleDropdownSelect = (label: string, values: any) => {
    const selectedKeys = Array.from(values) as string[];
    setSelectedDropdown(selectedKeys);
    handleChange(label, selectedKeys.map(Number));
  };

  const validateFields = () => {
    let valid = true;
    fields.forEach((field) => {
      const fieldValue = formData[field.label] || "";
      if (field.type !== "select") {
        if (!fieldValue) valid = false; 
      } else if (field.type === "select" && selectedDropdown.length === 0) {
        valid = false; 
      }
    });
    setIsValid(valid);
    return valid;
  };

  const handleValidate = () => {
    if (validateFields()) {
      nextStep(formData); 
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full">
      {fields.map((field, index) => {
        const fieldValue = formData[field.label] || "";

        switch (field.type) {
          case "text":
            return (
              <Input
                key={index}
                isRequired
                errorMessage="Este Campo es obligatorio"
                isInvalid={!fieldValue && !isValid}
                label={field.label}
                placeholder={field.placeholder || ""}
                value={fieldValue}
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            );
          case "textarea":
            return (
              <Textarea
                key={index}
                isRequired
                errorMessage="Este Campo es obligatorio"
                isInvalid={!fieldValue && !isValid}
                label={field.label}
                placeholder={field.placeholder || ""}
                value={fieldValue}
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            );
          case "select":
            return (
              <Select
                key={index}
                isRequired
                errorMessage={
                  selectedDropdown.length === 0 && !isValid
                    ? "Este Campo es obligatorio"
                    : undefined
                }
                isInvalid={selectedDropdown.length === 0 && !isValid}
                label={field.label}
                placeholder={field.placeholder || "Select an option"}
                selectedKeys={new Set(selectedDropdown)}
                onSelectionChange={(value) =>
                  handleDropdownSelect(field.label, value)
                }
              >
                {field.options && field.options.length > 0 ? (
                  field.options.map((option) => (
                    <SelectItem
                      key={option.id}
                      className="capitalize"
                      value={option.id.toString()}
                    >
                      {capitalize(option.name)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="" isDisabled>
                    No hay opciones disponibles
                  </SelectItem>
                )}
              </Select>
            );
          default:
            return null;
        }
      })}
      <ModalFooter className="pt-2 pb-4">
        {step > 1 && (
          <Button color="primary" variant="bordered" onPress={previousStep}>
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button color="primary" onPress={handleValidate}>
            Next
          </Button>
        ) : (
          <Button color="primary" onPress={onClose}>
            Submit
          </Button>
        )}
      </ModalFooter>
    </form>
  );
};
