import React from 'react';
import __ from '../../utils/Translations';
import priceFormatter from '../../utils/jsHelpers/priceFormatter';

// eslint-disable-next-line import/prefer-default-export
export const mapValueFromOptions = (options, key, optionValue = 'value', optionLabel = 'label') => {
  const renderEditable = (cellInfo) => {
    const value = cellInfo.row[key];
    if (!Array.isArray(value)) {
      const matchedOption = options.find((option) => option[optionValue] === value);
      const result = matchedOption ? matchedOption[optionLabel] : value;
      return (
        <div>
          {result}
        </div>
      );
    }

    return (
      <ul>
        {value.map((elValue) => {
          const matchedOption = options.find((option) => option[optionValue] === elValue);
          const result = matchedOption ? matchedOption[optionLabel] : `${__('Nieznany zasób')}: ${elValue}`;
          return <li key={elValue}>{result}</li>;
        })}
      </ul>
    );
  };
  return renderEditable;
};

export const getDateCell = (key, withTime = false) => {
  const renderEditable = (cellInfo) => {
    const date = cellInfo.row[key];
    if (!date) {
      return null;
    }
    const dateObject = new Date(date);
    return (
      <div className="d-block w-100 text-center">
        {withTime ? dateObject.toLocaleString('pl-PL') : dateObject.toLocaleDateString('pl-PL')}
      </div>
    );
  };
  return renderEditable;
};

export const priceColumn = (cellInfo) => (
  <div className="d-block w-100 text-center">
    {priceFormatter(cellInfo.row[cellInfo.column.id])}
  </div>
);
