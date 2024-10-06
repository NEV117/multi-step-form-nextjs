/* eslint-disable prettier/prettier */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const FormContext = createContext<any>(null);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<any>({});
  const updateFormData = (newData: any) => {
    const updatedData = { ...formData, ...newData };

    setFormData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));
  };

  useEffect(() => {
    const storedData = localStorage.getItem("formData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      if (JSON.stringify(parsedData) !== JSON.stringify(formData)) {
        setFormData(parsedData);
      }
    }
  }, []); 

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  return useContext(FormContext);
};
