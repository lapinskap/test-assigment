import React, { useCallback, useState } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import { Button } from 'reactstrap';
import Form from '../../../Components/Form';
import {
  AGREEMENT_SERVICE, downloadFile, restApiRequest,
} from '../../../utils/Api';
import DataLoading from '../../../Components/Loading/dataLoading';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import useOrganizationUnits from '../../../utils/hooks/company/useOrganizationUnits';
import useEmployeeGroups from '../../../utils/hooks/company/useEmployeeGroups';
import useRentableGroups from '../../../utils/hooks/company/useRentableGroups';
import { getCompaniesOptionsFetchMethod } from '../../../Components/FormElements/Autocomplete/commonFetchMethods';
import useAgreementPlacement from '../../../utils/hooks/agreement/useAgreementPlacement';
import { fileToBase64 } from '../../../utils/Parsers/fileToBase64';
import { agreementAgreementPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

const listingPath = '/agreements';

export default function Edit({ match }) {
  const { agreementId } = match.params;
  const isNew = agreementId === '-1';
  const [data, updateData] = useState(isNew ? { active: false } : null);
  const [originalData, updateOriginalData] = useState(null);
  const history = useHistory();
  const companyId = data?.companyId;
  const organizationUnits = useOrganizationUnits(true, 'companyId', companyId, false, !companyId);
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const rentableGroups = useRentableGroups(true, 'companyId', companyId, false, !companyId);
  const placements = useAgreementPlacement(true);
  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const onRangeChange = useCallback((key, value) => {
    const updatedData = { ...data };
    const { from, to } = value;
    updatedData[`${key}From`] = from;
    updatedData[`${key}To`] = to;
    updateData(updatedData);
  }, [data]);

  const onChangeCompany = (key, value) => {
    if (value) {
      onChange(key, value);
    } else {
      const updatedData = { ...data };
      updatedData[key] = value;
      updatedData.employee_group = null;
      updatedData.organization_unit = null;
      updatedData.rentable_group = null;
      updateData(updatedData);
    }
  };

  const submit = async () => {
    try {
      const method = isNew ? 'POST' : 'PATCH';
      const path = isNew ? '/agreements' : `/agreements/${agreementId}`;
      let fileData = {};
      if (data.file && data.file[0]) {
        fileData = {
          file: await fileToBase64(data.file[0]),
          fileName: data.file[0].name,
        };
      }
      await restApiRequest(
        AGREEMENT_SERVICE,
        path,
        method,
        {
          body: {
            ...data,
            ...fileData,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano zgodę'));
      if (isNew) {
        history.push(listingPath);
      } else {
        updateOriginalData({ ...data });
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać zgody'), 'error');
    }
  };

  return (
    <CSSTransitionGroup
      component="div"
      transitionName="TabsAnimation"
      transitionAppear
      transitionAppearTimeout={0}
      transitionEnter={false}
      transitionLeave={false}
    >
      <PageTitle
        heading={isNew ? 'Nowa zgoda' : `Edycja zgody${originalData ? ` ${originalData.title} (ID: ${originalData.id})` : ''}`}
        breadcrumbs={[{
          title: 'Lista zgód',
          link: listingPath,
        }]}
        pushToHistory={!isNew}
      />
      <DataLoading
        service={AGREEMENT_SERVICE}
        fetchedData={data !== null}
        updateData={(updatedData) => {
          updateData(updatedData);
          updateOriginalData(updatedData);
        }}
        endpoint={`/agreements/${agreementId}`}
        mockDataEndpoint="/agreements/edit"
        isNew={isNew}
      >
        <Form
          id="agreementForm"
          data={data || {}}
          config={
            {
              title: isNew ? 'Nowa zgoda' : 'Edycja zgody',
              stickyTitle: true,
              onSubmit: submit,
              buttons: [
                {
                  size: 'lg',
                  color: 'light',
                  className: 'mr-2',
                  text: 'Wróć',
                  href: listingPath,
                  id: 'agreementBack',
                },
                {
                  size: 'lg',
                  color: 'primary',
                  className: 'mr-2',
                  text: 'Zapisz',
                  type: 'submit',
                  id: 'agreementSubmit',
                  permission: agreementAgreementPermissionWrite,
                },
              ],
              defaultOnChange: onChange,
              formGroups: [
                {
                  title: 'Dane',
                  formElements: [
                    {
                      id: 'title',
                      label: 'Tytuł:',
                      type: 'text',
                      validation: ['required'],
                      translatable: {
                        scope: 'agreement_agreement_title',
                      },
                    },
                    {
                      id: 'placement',
                      label: 'Lokalizacja:',
                      type: 'multiselect',
                      validation: ['required'],
                      options: placements,
                    },
                    {
                      id: 'companyId',
                      label: 'Firma:',
                      validation: ['required'],
                      type: 'asyncAutocomplete',
                      onChange: onChangeCompany,
                      fetchOptions: getCompaniesOptionsFetchMethod(data ? data.company : null),
                    },
                    {
                      id: 'employeeGroupIds',
                      label: 'Grupy pracownicze:',
                      type: 'multiselect',
                      displayCondition: Boolean(data && data.companyId),
                      options: employeeGroups,
                    },
                    {
                      id: 'organizationUnitIds',
                      label: 'Jednoski organizacyjne:',
                      type: 'multiselect',
                      displayCondition: Boolean(data && data.companyId),
                      options: organizationUnits,
                    },
                    {
                      id: 'rentableGroupsIds',
                      label: 'Grupy dochodowości:',
                      displayCondition: Boolean(data && data.companyId),
                      type: 'multiselect',
                      options: rentableGroups,
                    },
                    {
                      id: 'active',
                      label: 'Aktywna',
                      type: 'boolean',
                    },
                    {
                      id: 'required',
                      label: 'Wymagana',
                      type: 'boolean',
                      props: {
                        disabled: !isNew,
                      },
                    },
                    {
                      id: 'active',
                      label: 'Ważność:',
                      type: 'dateRange',
                      onChange: onRangeChange,
                    },
                    {
                      id: 'file',
                      label: 'Załącznik:',
                      type: 'file',
                      validation: isNew ? ['required'] : null,
                    },
                    {
                      component: <FilePreview
                        key="file_preview"
                        id={originalData ? originalData.id : null}
                        fileName={originalData ? originalData.title : null}
                      />,
                    },
                    {
                      id: 'content',
                      label: 'Treść:',
                      type: 'wysiwyg',
                      validation: ['required'],
                      translatable: isNew ? null : {
                        isCms: true,
                        code: `agreement_agreement_${agreementId}_content`,
                      },
                    },
                    {
                      id: 'description',
                      label: 'Opis zgody:',
                      type: 'wysiwyg',
                      validation: ['required'],
                      translatable: isNew ? null : {
                        isCms: true,
                        code: `agreement_agreement_${agreementId}_description`,
                      },
                    },
                  ],
                },
              ],
            }
          }
        />
      </DataLoading>
    </CSSTransitionGroup>
  );
}

const FilePreview = ({ id, fileName }) => {
  if (!id) {
    return null;
  }
  return (
    <Button
      type="button"
      color="secondary"
      className="mb-2"
      onClick={() => {
        downloadFile(AGREEMENT_SERVICE, `/attachments/download/${id}`, fileName);
      }}
    >
      {__('Pobierz zapisany załącznik')}
    </Button>
  );
};

Edit.propTypes = ({
  match: matchPropTypes.isRequired,
});

FilePreview.propTypes = {
  id: PropTypes.string,
  fileName: PropTypes.string,
};

FilePreview.defaultProps = {
  id: null,
  fileName: null,
};
