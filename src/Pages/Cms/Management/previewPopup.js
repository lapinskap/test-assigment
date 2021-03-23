import React, { useState, useEffect } from 'react';
import {
  ModalHeader, ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import __ from '../../../utils/Translations';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import DefaultFallback from '../../../Layout/AppMain/DefaultFallback';
import Wysiwyg from '../../../Components/FormElements/Wysiwyg';
import Popup from '../../../Components/Popup/popup';

export default function PreviewPopup({ close, versionId }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    restApiRequest(
      CMS_SERVICE,
      `/document-versions/${versionId}`,
      'GET',
      {},
      cmsMock,
    ).then((res) => setData(res))
      .catch((e) => {
        dynamicNotification(e.message || __('Nie udało się pobrać danych do podglądu.'), 'error');
        close();
      });
  }, [versionId, setData, close]);

  return (
    <Popup id="documentPreviewPopup" isOpen toggle={close} unmountOnClose size="lg">
      <ModalHeader toggle={close}>{__('Podgląd')}</ModalHeader>
      <ModalBody>
        {data ? (
          <>
            <h5>
              {__('Tytuł: ')}
              {data.title}
            </h5>
            <Wysiwyg value={data.content} disabled id={`${versionId}_preview`} onChange={() => null} />
          </>
        ) : DefaultFallback}
      </ModalBody>
    </Popup>
  );
}
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

PreviewPopup.propTypes = {
  close: PropTypes.func.isRequired,
  versionId: PropTypes.number.isRequired,
};
