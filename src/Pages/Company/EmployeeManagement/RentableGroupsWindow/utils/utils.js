export const parseRentableGroupSelectionWindowDataFromBackend = ({ newEmployee, ...data }) => {
  const newEmployeeValue = typeof newEmployee === 'boolean' ? String(newEmployee) : null;
  return ({ ...data, newEmployee: newEmployeeValue });
};

export const parseRentableGroupSelectionWindowDataToBackend = ({ newEmployee, name, ...data }) => (
  {
    ...data,
    newEmployee: newEmployee !== undefined ? JSON.parse(newEmployee) : undefined,
    name: name || null,
  }
);
