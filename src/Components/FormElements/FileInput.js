import { Button, Input } from 'reactstrap';
import React from 'react';
import PropTypes from 'prop-types';
import __ from '../../utils/Translations';

export default function FileInput({
  id, onChange,
}) {
  return (
    <Button
      color="secondary"
      type="button"
      onClick={(e) => e.target.querySelector('input')?.click()}
    >
      {__('Wybierz plik')}
      <Input
        key={id}
        className="d-none"
        data-t1={id}
        type="file"
        id={id}
        name={id}
        label="Wybierz plik"
        onChange={onChange}
      />
    </Button>
  );
}

FileInput.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
