import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const MultiSelectParameter = ({
  isMulti,
  name,
  className,
  classNamePrefix,
  options,
  allowSelectAll,
  hideSelectedOptions,
  onChange,
  value,
  allOption,
  disabledParam,
}) => {
  const customStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      maxHeight: '30px',
    }),
  };

  if (allowSelectAll) {
    return (
      <Select
        isMulti={isMulti}
        name={name}
        className={className}
        classNamePrefix={classNamePrefix}
        allowSelectAll={allowSelectAll}
        hideSelectedOptions={hideSelectedOptions}
        value={value}
        styles={customStyles}
        options={[allOption, ...options]}
        onChange={(selected) => {
          if (
            selected !== null
            && selected.length > 0
            && selected[selected.length - 1].value === allOption.value
          ) {
            return onChange(options);
          }
          return onChange(selected);
        }}
        isDisabled={disabledParam}
      />
    );
  }

  return (
    <Select
      isMulti={isMulti}
      name={name}
      className={className}
      classNamePrefix={classNamePrefix}
      allowSelectAll={allowSelectAll}
      hideSelectedOptions={hideSelectedOptions}
      value={value}
      styles={customStyles}
      options={options}
      onChange={onChange}
      isDisabled={disabledParam}
    />
  );
};

MultiSelectParameter.propTypes = {
  isMulti: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  classNamePrefix: PropTypes.string.isRequired,
  options: PropTypes.arrayOf.isRequired,
  allowSelectAll: PropTypes.bool.isRequired,
  hideSelectedOptions: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  disabledParam: PropTypes.bool.isRequired,
};

MultiSelectParameter.defaultProps = {
  allOption: {
    label: 'Wybierz wszystkie',
    value: '*',
  },
};

export default MultiSelectParameter;
