export const getAnixeValue = (anixeData, field) => {
  let value = getAnixeValueForLanguage(anixeData, field, 'pl');
  if (!value) {
    value = getAnixeValueForLanguage(anixeData, field, 'en');
  } if (!value) {
    const languages = Object.keys(anixeData);
    for (let i = 0; i < languages.length; i += 1) {
      const language = languages[i];
      const languageValue = anixeData?.[language]?.[field];
      if (languageValue) {
        value = languageValue;
        break;
      }
    }
  } return value;
};

export const getAnixeValueForLanguage = (anixeData, field, language) => anixeData?.[language]?.[field];

export const getAnixeValueInAllLanguages = (anixeData, field) => {
  const result = {};
  const languages = Object.keys(anixeData).sort(sortLanguages);
  languages.forEach((language) => {
    const value = getAnixeValueForLanguage(anixeData, field, language);
    if (value) {
      result[language] = value;
    }
  });
  return result;
};

const sortLanguages = (a, b) => {
  if (b === 'pl') {
    return 1;
  } if (b === 'en' && a !== 'pl') {
    return 1;
  }
  return -1;
};
