import React, { useEffect, useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import { useCompanyName } from '../../CompanyContext';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { SUBSCRIPTION_MANAGEMENT_SERVICE, restApiRequest } from '../../../../utils/Api';
import Form from '../../../../Components/Form';
import { subscriptionPdfFormPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import Files from './files';
import { getIriFromId } from '../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX as PDF_FORM_IRI_PREFIX } from '../../../../utils/hooks/pdfForms/usePdfForms';
import { MEDIA_OBJECT_IRI_PREFIX } from '../../Products/Subscriptions/Attachments/utils';

export default function Edit({ match }) {
  const [data, setData] = useState({});
  const [fetchedData, setFetchedData] = useState(false);

  const history = useHistory();

  const { pdfFormId, companyId } = match.params;
  const isNew = pdfFormId === '-1';
  const listingUrl = `/company/edit/${companyId}/subscriptions/pdf-forms`;
  const companyName = useCompanyName();

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  };

  useEffect(() => {
    setFetchedData(false);
  }, [pdfFormId]);

  const submit = async () => {
    try {
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        isNew ? '/pdf-forms' : `/pdf-forms/${pdfFormId}`,
        isNew ? 'POST' : 'PATCH',
        {
          body: {
            ...data,
            companyId,
            formFiles: undefined,
          },
        },
        null,
      );
      const idAfterSave = res.id;
      if (data?.formFiles?.length > 0) {
        const filesPromises = data.formFiles.filter((el) => el.toSave || el.toDelete).map((el) => {
          const isNewFile = !el.id;
          const { toSave, toDelete } = el;
          if (toSave) {
            return restApiRequest(
              SUBSCRIPTION_MANAGEMENT_SERVICE,
              isNewFile ? '/pdf-form-files' : `/pdf-form-files/${el.id}`,
              isNewFile ? 'POST' : 'PATCH',
              {
                body: {
                  ...el,
                  file: getIriFromId(el.file.id, MEDIA_OBJECT_IRI_PREFIX),
                  pdfForm: getIriFromId(idAfterSave, PDF_FORM_IRI_PREFIX),
                },
              },
            );
          }
          if (toDelete && !isNewFile) {
            restApiRequest(
              SUBSCRIPTION_MANAGEMENT_SERVICE,
              `/pdf-form-files/${el.id}`,
              'DELETE',
              {
                returnNull: true,
              },
            );
          }
          return null;
        });
        await Promise.all(filesPromises).catch((e) => {
          console.error(e);
          dynamicNotification(e.message || __('Nie wszystkie pliki załącznika zostały zapisane poprawnie'), 'error');
        });
      }
      setData({
        ...res,
        formFiles: data?.formFiles?.filter(({ toDelete }) => !toDelete)
            .map(({ toSave, ...attachmentFile }) => ({ ...attachmentFile })),
      });

      dynamicNotification(__('Pomyślnie zapisano formularz PDF'));
      if (isNew) {
        history.push(`/company/edit/${companyId}/subscriptions/pdf-forms/${res.id}`);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać formularza PDF'), 'error');
    }
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
        <PageTitle
          heading={isNew
            ? `Tworzenie formularza PDF dla firmy ${companyName}`
            : `Edycja formularza PDF (ID: ${pdfFormId}) firmy ${companyName}`}
          breadcrumbsHeading={isNew
            ? 'Tworzenie formularza PDF'
            : `Edycja formularza PDF (ID: ${pdfFormId})`}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            { title: 'Świadczenia cykliczne', link: `/company/edit/${companyId}/subscriptions/` },
            { title: 'Lista formularzy PDF', link: listingUrl },
          ]}
          pushToHistory={!isNew}
        />
        <DataLoading
          fetchedData={fetchedData}
          isNew={isNew}
          service={SUBSCRIPTION_MANAGEMENT_SERVICE}
          updateData={(res) => {
            setData({ ...res });
            setFetchedData(true);
          }}
          mockDataEndpoint="/company/pdfForm/edit"
          endpoint={`/pdf-forms/${pdfFormId}`}
        >
          <Form
            id="pdfFormEditForm"
            data={data || {}}
            config={
                            {
                              title: isNew ? 'Tworzenie formularza PDF' : 'Edycja formularza PDF',
                              stickyTitle: true,
                              buttons: [
                                {
                                  size: 'lg',
                                  color: 'success',
                                  className: 'mr-2',
                                  text: 'Zapisz',
                                  id: 'pdfFormEditFormSubmit',
                                  permission: subscriptionPdfFormPermissionWrite,
                                  type: 'submit',
                                },
                              ],
                              onSubmit: submit,
                              defaultOnChange: onChange,
                              formGroups: [
                                {
                                  title: 'Dane formularza',
                                  formElements: [
                                    {
                                      id: 'withBarcode',
                                      label: 'Z kodem kreskowym',
                                      type: 'boolean',
                                    },
                                    {
                                      id: 'description',
                                      label: 'Opis:',
                                      type: 'textarea',
                                      validation: ['required'],
                                      translatable: isNew ? null : {
                                        isCms: true,
                                        code: `subscriptionManagement_pdfForms_${pdfFormId}_description`,
                                      },
                                    },
                                  ],
                                },
                                {
                                  title: 'Pliki formularza',
                                  formElements: [
                                    {
                                      component: <Files key="formFiles" pdfForm={data} updatePdfForm={setData} />,
                                    },
                                  ],
                                },
                              ],
                            }
                        }
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}
Edit.propTypes = {
  match: matchPropTypes.isRequired,
};
