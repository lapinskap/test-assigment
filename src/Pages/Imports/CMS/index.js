/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ImportForm from '../../Company/Imports/ImportForm';
import { CMS_SERVICE, restApiRequest } from '../../../utils/Api';
import { fileToBase64 } from '../../../utils/Parsers/fileToBase64';
import { dynamicNotification } from '../../../utils/Notifications';
import __ from '../../../utils/Translations';

export default function ImportCms() {
  const [importMessages, setImportMessages] = useState([]);

  const onSubmit = async (data) => {
    try {
      setImportMessages([]);
      const response = await restApiRequest(
        CMS_SERVICE,
        '/import/documents',
        'POST',
        {
          body: {
            file: await fileToBase64(data.file[0]),
          },
        },
        data,
      );
      const { count, messages } = response;
      if (count) {
        dynamicNotification(__('Pomyślnie zaimportowano dokumenty. Liczba zaimportowanych dokumentów: {0}', [count]));
      } else {
        dynamicNotification(__('Nie udało się zaimportować dokumentów.'), 'error');
      }
      setImportMessages(messages);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zaimportować dokumentów.'), 'error');
    }
  };
  const getLegend = () => [
    ['doc_id', 'kod dokumentu CMS'],
    ['id_firmy', 'identyfikator firmy (opcjonalnie, jeżeli import CMS nie dotyczy konkretnej firmy to wpisz 0)'],
    ['id_grupy', 'identyfikator grupy pracowników (opcjonalnie, jeżeli import CMS nie dotyczy konkretnej grupy to wpisz 0)'],
    ['tekst_pl', 'tekst dla wersji polskiej'],
    ['tekst_en', 'tekst dla wersji angielskiej'],
    ['tekst_uk', 'tekst dla wersji ukraińskiej'],
  ];

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
          heading="Import dokumentów CMS"
          breadcrumbs={[
            {
              title: 'Importy',
              link: '/imports',
            },
          ]}
        />
        <ImportForm
          importMessages={importMessages}
          setImportMessages={setImportMessages}
          csvForm="doc_id;id_firmy;id_grupy;tekst_pl;tekst_en;tekst_uk"
          instruction="Plik nie wymaga nagłówka"
          submitMethod={onSubmit}
          legend={getLegend()}
          title="Import dokumentów CMS"
        />
      </CSSTransitionGroup>
    </>
  );
}
