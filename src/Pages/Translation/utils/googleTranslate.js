import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Loader } from 'react-loaders';
import PropTypes from 'prop-types';

export default function GoogleTranslate({
  // eslint-disable-next-line no-unused-vars
  setGoogleTranslations, googleTranslations, language, phrase,
}) {
  const [loading, isLoading] = useState(false);
  const getSuggestion = () => {
    isLoading(true);
    setTimeout(() => {
      const newData = { ...googleTranslations };
      newData[phrase] = 'Firma';
      setGoogleTranslations(newData);
      isLoading(false);
    }, 400);
  };

  const suggestion = googleTranslations[phrase];
  if (suggestion) {
    return <span>{suggestion}</span>;
  } if (loading) {
    return <Loader active type="line-scale" style={{ transform: 'scale(0.6)' }} />;
  }
  return <Button onClick={getSuggestion} color="link">Pobierz</Button>;
}
GoogleTranslate.propTypes = {
  setGoogleTranslations: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  googleTranslations: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  phrase: PropTypes.string.isRequired,
};
