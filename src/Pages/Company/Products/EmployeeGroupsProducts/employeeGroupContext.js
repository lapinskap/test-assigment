import React, {
  useContext, useEffect, useState,
} from 'react';

const EmployeeGroupContext = React.createContext({
  data: [],
});

export default EmployeeGroupContext;

export const useCategoryConfig = (categoryId = null) => {
  const [result, setResult] = useState({});
  const { data } = useContext(EmployeeGroupContext);
  useEffect(() => {
    let categoryData = data[categoryId] || getDefaultConfig();
    if (categoryData.products && !categoryData.id) {
      categoryData = { ...getDefaultConfig(), ...categoryData };
    }
    setResult(categoryData);
  }, [data, categoryId]);
  return result;
};
export const useProductConfig = (categoryId, productId) => {
  const [result, setResult] = useState({});
  const { data } = useContext(EmployeeGroupContext);
  useEffect(() => {
    const categoryData = data[categoryId] || {};
    const productsConfig = categoryData.products || {};
    setResult(productsConfig[productId] || getDefaultConfig());
  }, [data, categoryId, productId]);
  return result;
};

export const getDefaultConfig = () => ({ useDefaultSettings: true });
