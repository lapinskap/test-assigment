import PropTypes from 'prop-types';
import React from 'react';
import Form from '../../../../../Components/Form';
// eslint-disable-next-line import/no-cycle
import useFunctionalities from './useFunctionalities';
import { useLanguages } from '../../../../../utils/Languages/LanguageContext';
import { companyCompanyPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';

export const industryOptions = [
  { value: 'industry1', label: 'Branża 1' },
  { value: 'industry2', label: 'Branża 2' },
  { value: 'industry3', label: 'Branża 3' },
];

export default function CompanyBaseDataForm({ data, submit, onChange }) {
  const functionalities = useFunctionalities();
  const languages = useLanguages(false, true);
  return (
    <Form
      id="companyForm"
      data={data}
      config={
                {
                  title: 'Formularz edycji danych firmy',
                  stickyTitle: true,
                  onSubmit: submit,
                  buttons: [
                    {
                      id: 'save',
                      size: 'lg',
                      color: 'primary',
                      className: 'mr-2',
                      text: 'Zapisz',
                      type: 'submit',
                      permission: companyCompanyPermissionWrite,
                    },
                  ],
                  defaultOnChange: onChange,
                  formGroups: [
                    {
                      title: 'Dane podstawowe firmy:',
                      formElements: [
                        {
                          id: 'fullName',
                          dataOldSk: 'fullName',
                          label: 'Pełna nazwa firmy:',
                          type: 'text',
                          validation: ['required', { method: 'minLength', args: [3] }],
                        },
                        {
                          id: 'shortName',
                          dataOldSk: 'shortName',
                          label: 'Skrócona nazwa firmy',
                          type: 'text',
                          validation: ['required', { method: 'minLength', args: [3] }],
                        },
                        {
                          id: 'active',
                          label: 'Aktywna',
                          type: 'boolean',
                        },
                        {
                          id: 'street',
                          dataOldSk: 'street',
                          label: 'Ulica:',
                          type: 'text',
                          validation: [{ method: 'minLength', args: [3] }],
                        },
                        {
                          id: 'postcode',
                          dataOldSk: 'postalCode',
                          label: 'Kod pocztowy:',
                          type: 'text',
                        },
                        {
                          id: 'city',
                          dataOldSk: 'city',
                          label: 'Miasto:',
                          type: 'text',
                        },
                        {
                          id: 'taxNumber',
                          dataOldSk: 'nip',
                          label: 'NIP:',
                          type: 'text',
                          valueFormatter: 'only_digits',
                          validation: ['required', 'nip'],
                        },
                        {
                          id: 'phone',
                          dataOldSk: 'phoneNumber',
                          label: 'Telefon:',
                          validation: ['phone'],
                        },
                        {
                          id: 'fax',
                          dataOldSk: 'faxNumber',
                          label: 'Fax:',
                          type: 'text',
                          valueFormatter: 'only_digits',
                          validation: [{ method: 'minLength', args: [9] }],
                        },
                        {
                          id: 'senderEmail',
                          dataOldSk: 'emailSender',
                          label: 'Nadawca e-maili:',
                          type: 'text',
                          validation: ['email'],
                        },
                        {
                          id: 'functionalities',
                          dataOldSk: 'companyFeatureTypes',
                          label: 'Funkcjonalności:',
                          type: 'checkbox',
                          props: {
                            columns: 2,
                          },
                          options: functionalities,
                        },
                        {
                          id: 'availableLanguages',
                          label: 'Aktywne wersje językowe systemu dla firmy:',
                          type: 'multiselect',
                          options: languages,
                        },
                      ],
                    },
                  ],
                }
            }
    />
  );
}

CompanyBaseDataForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};
