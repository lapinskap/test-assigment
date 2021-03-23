import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';
import { getIriFromId } from '../../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../../utils/hooks/benefit/useBenefits';

export const EMPLOYEE_GROUP_METHOD_CO_FINANCED = 'coFinanced';
export const EMPLOYEE_GROUP_METHOD_EMPLOYER = 'employer';
export const EMPLOYEE_GROUP_METHOD_EMPLOYEE = 'employee';

export const COLLECTED_DATA_SCOPE_NONE = 'null';
export const COLLECTED_DATA_SCOPE_NAMES = 'names';
export const COLLECTED_DATA_SCOPE_ID = 'pesel';
export const COLLECTED_DATA_SCOPE_EMAIL = 'email';
export const COLLECTED_DATA_SCOPE_ID_AND_EMAIL = 'emailWithPesel';

export const RELATION_BENEFIT_TYPE_AUTO = 'auto';
export const RELATION_BENEFIT_TYPE_MANDATORY = 'mandatory';
export const RELATION_BENEFIT_TYPE_OPTIONAL = 'optional';
export const RELATION_BENEFIT_TYPE_FREE = 'free';

export const EMPLOYEER_PRICE_TYPE_FIXED = 'fixed';
export const EMPLOYEER_PRICE_TYPE_HIDDEN = 'hiddenEmployerPrice';
export const EMPLOYEER_PRICE_TYPE_CHOICE = 'variantPrice';

export const parseBenefitDataFromBackend = ({ relationResignationAvailable, ...data }) => {
  const relationResignationAvailableValue = typeof relationResignationAvailable === 'boolean' ? String(relationResignationAvailable) : null;
  return ({ ...data, relationResignationAvailable: relationResignationAvailableValue });
};

export const parseBenefitDataToBackend = ({ relationResignationAvailable, activeForms, ...data }) => (
  {
    ...data,
    activeForms: shouldDisableActiveForms(data) ? [] : activeForms,
    relationResignationAvailable: relationResignationAvailable !== undefined ? JSON.parse(relationResignationAvailable) : undefined,
  }
);
export const parseBenefitEmployeeGroupDataFromBackend = ({ priceVariants, ...data }) => ({
  ...data,
  priceVariants: Array.isArray(priceVariants) ? priceVariants.join(';') : priceVariants,
});

export const parseBenefitEmployeeGroupDataToBackend = ({
  active, useDefaultDescription, useDefaultName, ...data
}) => (
  {
    ...data,
    active: active !== undefined ? active : false,
    useDefaultDescription: useDefaultDescription !== undefined ? useDefaultDescription : true,
    useDefaultName: useDefaultName !== undefined ? useDefaultName : true,
  }
);

export const saveEmployeeGroupBenefits = async (toSave, toDelete, benefitId) => {
  const benefitIri = getIriFromId(benefitId, BENEFIT_IRI_PREFIX);
  const savePromises = toSave.map((config) => restApiRequest(
    SUBSCRIPTION_MANAGEMENT_SERVICE,
    config.id ? `/benefit-employee-groups/${config.id}` : '/benefit-employee-groups',
    config.id ? 'PATCH' : 'POST',
    {
      body: parseBenefitEmployeeGroupDataToBackend({
        ...config,
        benefit: benefitIri,
      }),
    },
    {},
  ).catch((e) => {
    console.error(e);
    return null;
  }));
  const deletePromises = toDelete.map((id) => restApiRequest(
    SUBSCRIPTION_MANAGEMENT_SERVICE,
    `/benefit-employee-groups/${id}`,
    'DELETE',
    {
      returnNull: true,
    },
  ).catch((e) => {
    console.error(e);
    return null;
  }));

  await Promise.all([...deletePromises]);
  const result = await Promise.all([...savePromises]);
  const savedData = result.filter((el) => el !== null);
  if (!savedData.length) {
    dynamicNotification(__('Nie udało się zapisać konfiguracji dla grup pracowniczych.'), 'error');
  } else if (result.includes(null)) {
    dynamicNotification(__('Nie wszystkie konfiguracje grup pracowniczych zostały zapisane.'), 'warning');
  }

  return savedData;
};

export const shouldDisableActiveForms = ({ collectedDataScope = null }) => Boolean(
  collectedDataScope && collectedDataScope !== COLLECTED_DATA_SCOPE_NONE,
);

export const methodRequireEmployeePayment = (method) => [EMPLOYEE_GROUP_METHOD_CO_FINANCED, EMPLOYEE_GROUP_METHOD_EMPLOYEE].includes(method);
