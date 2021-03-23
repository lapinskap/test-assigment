import React, { useState, useEffect } from 'react';
import {
  ModalHeader, Alert, Row, Col, ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import __ from '../../../utils/Translations';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import DefaultFallback from '../../../Layout/AppMain/DefaultFallback';
import { DOCUMENT_IRI } from './util';
import Wysiwyg from '../../../Components/FormElements/Wysiwyg';
import RbsButton from '../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { cmsDocumentPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import Popup from '../../../Components/Popup/popup';

export default function PublishPopup({ close, versionId, documentId }) {
  const [currentPublishedData, setCurrentPublishedData] = useState(null);
  const [toPublishData, setToPublishData] = useState(null);

  useEffect(() => {
    restApiRequest(
      CMS_SERVICE,
      `/document-versions/${versionId}`,
      'GET',
      {},
      cmsMock,
    ).then((res) => setToPublishData(res))
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać danych wersji do publiskacji.'), 'error');
        close();
      });
  }, [versionId, setToPublishData, close]);

  useEffect(() => {
    restApiRequest(
      CMS_SERVICE,
      `/document-versions?document=${DOCUMENT_IRI}${documentId}&published=${true}`,
      'GET',
      {},
      [cmsMock],
    ).then((res) => {
      if (res[0]) {
        setCurrentPublishedData(res[0]);
      } else {
        setCurrentPublishedData({});
      }
    })
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać aktualnej opublikowanej wersji.'), 'error');
      });
  }, [versionId, setCurrentPublishedData, documentId]);

  const publish = async () => {
    try {
      await restApiRequest(
        CMS_SERVICE,
        `/document-publish?versionId=${versionId}`,
        'PATCH',
        {
          body: {},
        },
        {},
      );
      dynamicNotification(__('Pomyślnie opublikowano wersję dokumentu'));
      close(true);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się opublikować nowej wersji dokumentu'), 'error');
    }
  };

  const alertMessage = toPublishData?.title && toPublishData?.content ? (
    <>
      { __('Uwaga! Zamierzasz zmienić wiele wartości. Zapoznaj się z poniższą listą zmian, które zostaną wprowadzone.'
            + ' Aby potwierdzić operację publikowania, kliknij w przycisk Publikuj.') }
      <RbsButton
        permission={cmsDocumentPermissionWrite}
        color="danger"
        onClick={publish}
        className="d-block btn-actions-pane-right"
        data-t1="cmsDocumentPublish"
      >
        { __('Publikuj') }
      </RbsButton>
    </>
  ) : __('Nie można opublikować dokumentu bez tytułu lub zawartości.');

  return (
    <Popup id="publishDocumentPopup" isOpen toggle={() => close()} unmountOnClose size="xxl">
      <ModalHeader toggle={() => close()}>{__('Publikowanie')}</ModalHeader>
      <ModalBody>
        {toPublishData ? (
          <Alert color="danger">
            {alertMessage}
          </Alert>
        ) : null}
        <Row>
          <Col sm={6}>
            <h3>
              {__('Obecna wersja')}
              :
            </h3>
            {currentPublishedData ? getPreview(currentPublishedData) : null}
          </Col>
          <Col sm={6}>
            <h3>
              {__('Wersja do publikacji')}
              :
            </h3>
            {toPublishData ? getPreview(toPublishData) : DefaultFallback}
          </Col>
        </Row>
      </ModalBody>
    </Popup>
  );
}

const getPreview = (data) => (
  <>
    <h5>
      {__('Tytuł: ')}
      {data.title}
    </h5>
    <Wysiwyg value={data.content} disabled id={`${data.versionId}_preview`} onChange={() => null} />
  </>
);

const cmsMock = {
  title: 'Nowy super tytuł',
  content: `<h1>HTML Ipsum Presents</h1>
<p>
<strong>Pellentesque habitant morbi tristique</strong>
senectus et netus et malesuada fames ac turpis egestas.
 amet, ante. Donec eu libero sit amet quam egestas semper.
 <em>Aenean ultricies mi vitae est.</em>
 Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
 Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum,
 elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.
  <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
<h2>Header Level 2</h2>
<ol>
<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
<li>Aliquam tincidunt mauris eu risus.</li>
</ol>
<blockquote>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna.
Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend,
 libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p>
</blockquote>
<h3>Header Level 3</h3>
<ul>
<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
<li>Aliquam tincidunt mauris eu risus.</li>
</ul>
`,
};

PublishPopup.propTypes = {
  close: PropTypes.func.isRequired,
  versionId: PropTypes.number.isRequired,
  documentId: PropTypes.string.isRequired,
};
