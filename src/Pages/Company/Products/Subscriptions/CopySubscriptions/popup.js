import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader as LoaderAnim } from 'react-loaders';
import Form from '../../../../../Components/Form';
import ContentLoading from '../../../../../Components/Loading/contentLoading';
import { getUserConfirmationPopup } from '../../../../../Components/UserConfirmationPopup';
import useCompanies from '../../../../../utils/hooks/company/useCompanies';
import useEmployeeGroups from '../../../../../utils/hooks/company/useEmployeeGroups';
import { LAYOUT_TWO_COLUMNS } from '../../../../../Components/Layouts';
import Popup from '../../../../../Components/Popup/popup';
import { dynamicNotification } from '../../../../../utils/Notifications';

export default function CopySubscriptionsPopup({ close, onSave, isOpen }) {
  const [data, updateData] = useState({});
  const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;
  const [isLoading, setIsLoading] = useState(false);
  //   const submitting = () => ({});
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  }, [data]);

  const companies = useCompanies(true);
  const employeeGroups = useEmployeeGroups(true, 'companyId', data.company, false, !data.company);

  const submit = (confirmed) => {
    if (confirmed) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onSave(data.id, data.value);
        close();
        dynamicNotification('Funkcjonalność nie gotowa', 'warning');
      }, 500);
    }
  };

  return (
    <>
      <Popup id="copySubscriptionPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
        <ContentLoading
          message={spinner}
          show={isLoading}
        >
          <Form
            id="copySubscriptionForm"
            data={data}
            config={{
              defaultOnChange: onChange,
              stickyTitle: true,
              isInPopup: true,
              togglePopup: close,
              title: 'Kopiuj abonamenty z innej firmy',
              groupsAsColumns: false,
              buttons: [
                {
                  id: 'copySubscriptions',
                  type: 'submit',
                  text: 'Kopiuj abonamenty',
                },
              ],
              onSubmit: () => {
                getUserConfirmationPopup(
                  'Wszystkie dotychczasowe abonamenty podanej grupy zostaną utracone', submit, 'Czy chcesz zastąpić obecne dane nowymi?',
                );
              },
              formGroups: [
                {
                  formElements: [
                    {
                      layout: LAYOUT_TWO_COLUMNS,
                      formElements: [
                        {

                          id: 'company',
                          type: 'select',
                          label: 'Wybierz firmę:',
                          options: companies,
                          validation: ['required'],
                        },
                        {
                          id: 'employeeGroup',
                          type: 'select',
                          label: 'Wybierz grupę pracowniczą:',
                          options: employeeGroups,
                          validation: ['required'],
                        },
                      ],
                    },
                    {
                      id: 'subscriptionGroup',
                      type: 'multiselect',
                      label: 'Wybierz grupy abonamentów do skopiowania:',
                      displayCondition: 'employeeGroup' in data && 'company' in data,
                      options: [
                        { value: '1', label: 'Ubezpieczenie zdrowotne' },
                        { value: '2', label: 'BenefitLunch' },
                        { value: '3', label: 'Opieka medyczna' },
                      ],
                      validation: ['required'],
                    },
                  ],
                },
              ],
            }}
          />
        </ContentLoading>
      </Popup>
    </>
  );
}

CopySubscriptionsPopup.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
