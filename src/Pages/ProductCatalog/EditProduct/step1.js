import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { productTypes, universalCodeTypes, internationalTourismCodeTypes } from './productTypes';
import Tiles from '../../../Components/Tiles/index';
import __ from '../../../utils/Translations';

export default function SelectCategory({
  next, data, setData,
}) {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUniversalCodeSelected, setIsUniversalCodeSelected] = useState(false);
  const [isForeignTourismSelected, setIsForeignTourismSelected] = useState(false);
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const onTileClick = (id) => {
    if (id === 'universal_codes') {
      setIsUniversalCodeSelected(true);
    } else if (id === 'tourism_abroad') {
      setIsForeignTourismSelected(true);
    } else {
      onChange('mbProductType', id);
      setErrorMessage('');
      history.replace(`/product-catalog/products/-1/${id}#1`);
    }
  };

  const clearDecision = () => {
    setIsUniversalCodeSelected(false);
    setIsForeignTourismSelected(false);
  };

  const submit = () => {
    if (data.mbProductType && data.mbProductType !== '-1') {
      setErrorMessage(null);
      next();
    } else {
      setErrorMessage(__('Wybierz kategorię'));
    }
  };

  const hasDecision = () => (isUniversalCodeSelected || isForeignTourismSelected);

  const getConfig = () => {
    if (isUniversalCodeSelected) {
      return universalCodeTypes;
    } if (isForeignTourismSelected) {
      return internationalTourismCodeTypes;
    }
    return productTypes;
  };

  return (
    <>
      {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
      <Form onSubmit={submit}>
        { (hasDecision()) ? <Button className="ml-3" color="light" onClick={() => clearDecision()}>Wróć</Button> : ''}
        <Tiles
          config={getConfig()}
          onTileClick={onTileClick}
          selected={data ? data.mbProductType : null}
        />
        <Button data-t1="submit" type="submit" style={{ display: 'none' }} />
      </Form>
    </>
  );
}

SelectCategory.propTypes = {
  next: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
};

SelectCategory.defaultProps = {
  next: () => {},
};
