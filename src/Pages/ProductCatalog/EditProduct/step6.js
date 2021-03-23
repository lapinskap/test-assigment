import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';

import { Link } from 'react-router-dom';
import { PRODUCT_TYPE_BENEFIT, PRODUCT_TYPE_TOURISM, PRODUCT_TYPE_VOUCHER } from './consts';
import __ from '../../../utils/Translations';
import {
  productTypes,
  universalCodeTypes,
  internationalTourismCodeTypes,
  TOURISM_ABROAD_PRODUCT_TYPE,
  TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE,
  TOURISM_ABROAD_OTHER_PRODUCT_TYPE,
} from './productTypes';
import { foreignTourismPathOptions } from './CustomSteps/tourismStep2';
import getDefaultData from './getDefaultData';

const getTypeLabel = (type) => {
  switch (type) {
    case PRODUCT_TYPE_VOUCHER:
      return __('Bon');
    case PRODUCT_TYPE_BENEFIT:
      return __('Świadczenie');
    case PRODUCT_TYPE_TOURISM:
      return __('Wyjazd turystyczny');
    default:
      return '';
  }
};
const TOURISM_TYPES = [TOURISM_ABROAD_PRODUCT_TYPE, TOURISM_ABROAD_TRAVELPLANET_PRODUCT_TYPE, TOURISM_ABROAD_OTHER_PRODUCT_TYPE];
const mbProductTypes = productTypes.concat(universalCodeTypes, internationalTourismCodeTypes);

const mapValueFromOptions = (options, value) => {
  const selectedOption = options.find((option) => option.value === value);
  return selectedOption.label;
};

export default function Summary({ data, setData }) {
  const {
    foreignTourismPath, identifier, name: productName, mbBenefitType, id: productId, mbProductType,
  } = data;

  const typeObject = mbProductTypes.find(({ id }) => id === mbProductType) || {};

  const getBenefitTypeOption = (mbProduct, tourismPath, benefitType) => {
    if (TOURISM_TYPES.includes(mbProduct)) {
      return mapValueFromOptions(foreignTourismPathOptions, tourismPath);
    }
    return getTypeLabel(benefitType);
  };

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className="form-wizard-content">
          <div className="no-results">
            <div className="sa-icon sa-success animate">
              <span className="sa-line sa-tip animateSuccessTip" />
              <span className="sa-line sa-long animateSuccessLong" />
              <div className="sa-placeholder" />
              <div className="sa-fix" />
            </div>
            <div className="mt-4 results-title">
              <p>
                Nazwa:
                {' '}
                { productName }
                <br />
                Identyfikator:
                {' '}
                { identifier }
                <br />
                { TOURISM_TYPES.includes(mbProductType) ? 'Ścieżka dla turystyki zagranicznej:' : 'Rodzaj:' }
                {' '}
                { getBenefitTypeOption(mbProductType, foreignTourismPath, mbBenefitType) }
              </p>
            </div>
            <div className="results-subtitle">
              został dodany dla typu
              {' '}
              {typeObject.label ? typeObject.label : ''}
            </div>
            <div className="mt-3 mb-3" />
            <div className="text-center">
              <Link to={`/product-catalog/products/${productId}/${mbProductType}`}>
                <Button data-t1="edit" color="light" size="lg" className="btn-shadow btn-wide m-1" onClick={() => setData(null)}>
                  Edytuj produkt
                </Button>
              </Link>
              <Link
                to={`/product-catalog/products/-1/${mbProductType}#1`}
                onClick={() => setTimeout(() => {
                  setData({ mbProductType, ...getDefaultData(mbProductType) });
                })}
              >
                <Button data-t1="createNew" color="light" size="lg" className="btn-shadow btn-wide m-1">
                  Stwórz nowy produkt typu
                  {' '}
                  {typeObject.label ? typeObject.label : ''}
                </Button>
              </Link>
              <Link to="/product-catalog/products">
                <Button data-t1="back" color="success" size="lg" className="btn-shadow btn-wide m-1">
                  Powrót do listy produktów
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CSSTransitionGroup>
    </>
  );
}

Summary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
};
