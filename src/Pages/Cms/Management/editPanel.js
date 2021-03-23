import React, { useEffect, useState } from 'react';
import {
  Card, CardBody,
  Alert, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Form from '../../../Components/Form';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';
import PublishPopup from './publishPopup';
import { DOCUMENT_IRI } from './util';
import PreviewPopup from './previewPopup';
import { cmsDocumentPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';

export default function EditPanel({
  companyId, employeeGroupId, changeCms, refreshDocumentsTree, setRefreshData, data, updateData, defaultDocumentData,
}) {
  const [publishVersion, setPublishVersion] = useState(false);
  const [currentlyPublishedVersion, setCurrentlyPublishedVersion] = useState(null);
  const [previewCurrentVersion, setPreviewCurrentVersion] = useState(false);
  const { published, documentId: docId = null, useDefault } = data;
  const isDefaultScope = Boolean(!companyId && !employeeGroupId);

  useEffect(() => {
    if (published === false && docId) {
      restApiRequest(
        CMS_SERVICE,
        `/document-versions?document=${DOCUMENT_IRI}${docId}&published=${true}`,
        'GET',
        {},
        mockData,
      ).then((res) => res[0] && setCurrentlyPublishedVersion(res[0].id))
        .catch((e) => {
          dynamicNotification(e.message || __('Nie udało się pobrać aktualnej opublikowanej wersji.'), 'error');
        });
    }
  }, [published, docId]);

  const onChange = (key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    updateData(updatedData);
  };

  const submit = async () => {
    const stateData = data || {};
    const {
      title, content, code, useDefault: useDefaultSwitch,
    } = stateData;
    let { documentId } = stateData;
    if (!documentId && !isDefaultScope) {
      const { id: newDocId } = await createDocumentForScope(code, companyId, employeeGroupId);
      documentId = newDocId;
    }
    let body;
    if (isDefaultScope) {
      body = {
        title, content, code, documentId,
      };
    } else {
      body = {
        title, content, useDefault: useDefaultSwitch, documentId,
      };
    }

    try {
      await restApiRequest(
        CMS_SERVICE,
        isDefaultScope ? '/update-default-document' : '/update-overridden-document',
        'POST',
        { body },
        stateData,
      );
      dynamicNotification(__('Pomyślnie zmieniono dokument'));
      changeCms(code);
      refreshDocumentsTree();
      setRefreshData(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać dokumentu'), 'error');
    }
  };
  let formData = data || {};
  if (!isDefaultScope && useDefault) {
    formData = { ...data, ...defaultDocumentData };
  }
  const translatable = Boolean(data && data.versionId && docId);

  return (
    <>
      <Card>
        <CardBody>
          <Form
            id="documentForm"
            data={formData}
            config={{
              title: 'Dane dokumentu CMS',
              noCards: true,
              buttons: [
                {
                  size: 'lg',
                  color: 'primary',
                  className: 'mr-2',
                  text: 'Zapisz',
                  permission: cmsDocumentPermissionWrite,
                  id: 'cmsDataSubmit',
                  type: 'submit',
                },
              ],
              onSubmit: submit,
              defaultOnChange: onChange,
              formGroups: [
                {
                  formElements: [
                    {
                      displayCondition: Boolean(published === false && data.versionId && !useDefault),
                      component: (
                        <Alert color="warning" key="no-published-warning">
                          {__('Widoczna wersja dokumentu nie jest opublikowana.')}
                          <Button
                            className="ml-1"
                            color="link"
                            data-t1="cmsDataPublish"
                            onClick={() => setPublishVersion(data.versionId)}
                          >
                            {__('Publikuj')}
                          </Button>
                          {currentlyPublishedVersion ? (
                            <Button
                              className="ml-1"
                              color="link"
                              onClick={() => setPreviewCurrentVersion(true)}
                              data-t1="cmsDataShow"
                            >
                              {__('Pokaż obecnie opublikowaną wersję')}
                            </Button>
                          ) : null}
                        </Alert>
                      ),
                    },
                    {
                      id: 'useDefault',
                      label: 'Pobieraj CMS domyślny',
                      type: 'boolean',
                      displayCondition: !isDefaultScope,
                    },
                    {
                      id: 'documentId',
                      label: 'Identyfikator dokumentu:',
                      type: 'text',
                      props: {
                        disabled: true,
                        placeholder: useDefault
                          ? __('Domyślny dokument nie posiada opublikowanej wersji')
                          : __('Identyfikator będzie widoczny po pierwszym zapisaniu dokumentu'),
                      },
                    },
                    {
                      id: 'code',
                      label: 'Kod:',
                      type: 'text',
                      props: {
                        disabled: !isDefaultScope,
                      },
                      validation: ['required'],
                    },
                    {
                      id: 'title',
                      label: 'Tytuł:',
                      type: 'text',
                      props: {
                        disabled: useDefault,
                      },
                      translatable: translatable ? {
                        code: `cms_document_${docId}_version_${data.versionId}`,
                        isCms: true,
                        isTitle: true,
                      } : null,
                      validation: useDefault ? null : ['required'],
                    },
                    {
                      id: 'content',
                      label: 'Zawartość:',
                      type: 'wysiwyg',
                      props: {
                        disabled: useDefault,
                      },
                      translatable: translatable ? {
                        code: `cms_document_${docId}_version_${data.versionId}`,
                        isCms: true,
                      } : null,
                      validation: useDefault ? null : ['required'],
                    },
                  ],
                },
              ],
            }}
          />
        </CardBody>
      </Card>
      { publishVersion ? (
        <PublishPopup
          close={(refresh = false) => {
            setPublishVersion(null);
            if (refresh) {
              refreshDocumentsTree();
              setRefreshData(true);
              updateData(null);
            }
          }}
          versionId={publishVersion}
          documentId={docId}
        />
      ) : null}
      { previewCurrentVersion && currentlyPublishedVersion ? (
        <PreviewPopup close={() => setPreviewCurrentVersion(false)} versionId={currentlyPublishedVersion} />
      ) : null}
    </>
  );
}

const createDocumentForScope = async (code, companyId, employeeGroupId) => {
  const body = { code };
  if (employeeGroupId) {
    body.employeeGroupId = employeeGroupId;
  } else {
    body.companyId = companyId;
  }
  return restApiRequest(
    CMS_SERVICE,
    '/overridden-document',
    'POST',
    {
      body: { code, companyId, employeeGroupId },
    },
    { documentId: '1b0cef9c-226f-4c12-b318-56e8c5f87f58', code: 'asd' },
  );
};

const mockData = [{ id: 44 }];

EditPanel.propTypes = {
  companyId: PropTypes.string,
  employeeGroupId: PropTypes.string,
  setRefreshData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  defaultDocumentData: PropTypes.object.isRequired,
  refreshDocumentsTree: PropTypes.func.isRequired,
  changeCms: PropTypes.func.isRequired,
};

EditPanel.defaultProps = {
  companyId: null,
  employeeGroupId: null,
};
