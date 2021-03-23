import React, {
  useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../../Components/Form';
import DataLoading from '../../../../../Components/Loading/dataLoading';
import { COMPANY_MANAGEMENT_SERVICE, restApiRequest } from '../../../../../utils/Api';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { useCompanyName } from '../../../CompanyContext';
import { companyCompanyPermissionWrite } from '../../../../../utils/RoleBasedSecurity/permissions';

export default function GeneralConfig({
  active, setIsEdited, changePageTitleData, companyId,
}) {
  const [data, updateData] = useState({});
  const companyName = useCompanyName();
  useEffect(() => {
    if (active) {
      changePageTitleData(`Konfiguracja firmy ${companyName} (ID: ${companyId})`, [], 'Konfiguracja');
    }
  }, [active, changePageTitleData, companyName, companyId]);

  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
    setIsEdited(true);
  }, [data, setIsEdited]);

  if (!active) {
    return null;
  }

  const submit = async () => {
    try {
      await restApiRequest(
        COMPANY_MANAGEMENT_SERVICE,
        `/companies/${companyId}`,
        'PATCH',
        {
          body: data,
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano konfigurację firmy'));
      setIsEdited(false);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać konfiguracji firmy'), 'error');
    }
  };

  return (
    <DataLoading
      service={COMPANY_MANAGEMENT_SERVICE}
      fetchedData={Object.keys(data).length > 0}
      updateData={(updatedData) => updateData(updatedData)}
      endpoint={`/companies/${companyId}`}
      mockDataEndpoint="/company/companyData/edit"
    >
      <Form
        id="companyGeneralConfigForm"
        data={data}
        config={{
          title: 'Konfiguracja ogólna firmy',
          stickyTitle: true,
          onSubmit: submit,
          buttons: [
            {
              size: 'lg',
              color: 'success',
              className: 'mr-2',
              text: 'Zapisz',
              type: 'submit',
              id: 'companyGeneralConfigFormSubmit',
              permission: companyCompanyPermissionWrite,
            },
          ],
          defaultOnChange: onChange,
          formGroups: [
            {
              title: 'Aktywacja konta pracownika',
              formElements: [
                {
                  id: 'sendWelcomeEmailDelayDays',
                  dataOldSk: 'postponeActivationValue',
                  label: 'Wstrzymanie wysłania maila powitalnego (w dniach):',
                  type: 'text',
                  valueFormatter: 'integer',
                  tooltip: {
                    content: (
                      <>
                        Jeżeli pracownik nie posiada adresu mailowego to
                        nie zostanie wysłany mail powitalny do AHR przez x zdefiniowanych dni. Jak się pojawi w tym czasie adres mailowy
                        <br />
                        to zostaje on automatycznie wygenerowany do pracownika a jak nie pojawi się po upływie x dni zostaje wysyłany do jego HR.
                        {' '}
                      </>
                    ),
                  },
                },
              ],
            },
            {
              title: 'Wsteczna dezaktywacja konta pracownika',
              formElements: [
                {
                  id: 'backwardDeactivation',
                  dataOldSk: 'backwardDeactivation',
                  label: 'Wsteczna dezaktywacja konta pracownika',
                  type: 'boolean',
                },
                {
                  id: 'backwardTurnDay',
                  dataOldSk: 'backwardTurnDay',
                  label: 'Data graniczna, do której można dezaktywować z datą wsteczną (od 1 do 28):',
                  type: 'number',
                  props: {
                    min: 1,
                    max: 28,
                  },
                },
                {
                  id: 'deactivationTurnDay',
                  dataOldSk: 'deactivationTurnDay',
                  label: 'Data, z którą jest dezaktywowane konto (od 1 do 28):',
                  type: 'number',
                  props: {
                    min: 1,
                    max: 28,
                  },
                },
              ],
            },
          ],
        }}
      />
    </DataLoading>
  );
}

GeneralConfig.propTypes = {
  active: PropTypes.bool,
  changePageTitleData: PropTypes.func.isRequired,
  setIsEdited: PropTypes.func,
  companyId: PropTypes.string.isRequired,
};

GeneralConfig.defaultProps = {
  active: false,
  setIsEdited: () => {
  },
};
