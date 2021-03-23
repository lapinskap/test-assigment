import React, { useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import DynamicTranslationPopup from './DynamicTranslationPopup';
// eslint-disable-next-line import/no-cycle
import DynamicCmsTranslationPopup from './DynamicCmsTranslationPopup';

export default function DynamicTranslationTrigger({
  scope, isCms, value, code, isTitle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const getPopup = () => (isCms ? (
    <DynamicCmsTranslationPopup
      close={closePopup}
      code={code}
      scope={scope}
      value={value}
      isTitle={isTitle}
    />
  ) : (
    <DynamicTranslationPopup
      close={closePopup}
      scope={scope}
      value={value}
    />
  ));

  if (!value) {
    return null;
  }

  return (
    <>
      <i role="presentation" onClick={openPopup} className="pe-7s-notebook cursor-pointer text-success" />
      {isOpen ? getPopup() : null}
    </>
  );
}

DynamicTranslationTrigger.propTypes = {
  scope: PropTypes.string,
  code: PropTypes.string,
  isCms: PropTypes.bool,
  value: PropTypes.string,
  isTitle: PropTypes.bool,
};

DynamicTranslationTrigger.defaultProps = {
  isCms: false,
  value: '',
  scope: '',
  code: '',
  isTitle: false,
};
