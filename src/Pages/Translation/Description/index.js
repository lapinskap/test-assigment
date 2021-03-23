import PropTypes from 'prop-types';
import React, {
  useCallback, useState, useEffect,
} from 'react';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import Form from './form';
import { SelectFilter } from '../../../Components/DataTable/filters';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import fetchScopeOptions from '../utils/fetchScopeOptions';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';
import ActionColumn from '../../../Components/DataTable/actionColumn';
import { translationTranslateSimplePermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import __ from '../../../utils/Translations';

export const DESCRIPTION_TYPE = 3;

export default function Description({ language }) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [formId, setFormId] = useState(null);
  const [scopeOptions, setScopeOptions] = useState([]);

  useEffect(() => {
    fetchScopeOptions(DESCRIPTION_TYPE, mockScopeOptions)
      .then((res) => {
        setScopeOptions(res);
      });
  }, []);

  const fetchData = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      TRANSLATOR_SERVICE,
      '/cms-translations',
      filters,
      page,
      pageSize,
      sort,
      {
        params: {
          language,
          itemsPerPage: pageSize,
          page,
        },
      },
      mockData,
    );
    setData(newData);
    setCount(newCount);
  }, [language]);

  if (!language) {
    return null;
  }

  const exportContext = new ExportContext(
    {
      service: TRANSLATOR_SERVICE,
      path: '/cms-translations/export/simple',
      permission: translationTranslateSimplePermissionWrite,
      fileName: `description_translation_${language}`,
      handleAdditionalFilters: () => [
        {
          id: 'type',
          value: DESCRIPTION_TYPE,
        },
        {
          id: 'language',
          value: language,
        },
      ],
    },
  );

  const onSave = async (id, value) => {
    try {
      await restApiRequest(TRANSLATOR_SERVICE,
        `/cms-translations/${id}`,
        'PATCH',
        {
          body: {
            translation: value,
          },
        });
      const updatedData = [...data];
      const item = updatedData.find((el) => el.id === id);
      if (item) {
        item.translation = value;
        setData(updatedData);
        dynamicNotification(__('Pomyślnie zapisano tłumaczenie.'));
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(__('Nie udało się poprawnie zapisać tłumaczenia', 'error'));
    }
  };

  const closeForm = () => {
    setFormId(null);
  };
  return (
    <>
      <DataTableControlled
        id="descriptionTranslationsListing"
        columns={columns(scopeOptions, setFormId)}
        fetchData={fetchData}
        data={data}
        count={count}
        exportContext={exportContext}
        filterable
      />
      {formId ? <Form close={closeForm} initialData={data.find((item) => item.id === formId)} language={language} onSave={onSave} /> : null}
    </>
  );
}

const mockScopeOptions = [
  { value: 'menu', label: 'Menu' },
  { value: 'product', label: 'Product' },
  { value: 'employee', label: 'Pracownik' },
  { value: 'company', label: 'Firma' },
  { value: 'cms', label: 'CMS' },
];

const columns = (scopeOptions, setFormId) => [
  {
    Header: 'Kod',
    accessor: 'code',
  },
  {
    Header: 'Zakres',
    accessor: 'scope',
    Filter: SelectFilter(scopeOptions),
    filterMethod: (filter) => {
      switch (filter.value) {
        default:
          return true;
      }
    },
    Cell: mapValueFromOptions(scopeOptions, 'scope'),
  },
  {
    Header: 'Tłumaczenie',
    accessor: 'translation',
    // eslint-disable-next-line react/prop-types
    Cell: ({ row }) => <span>{row.translation ? `${row.translation.substr(0, 50)}...` : ''}</span>,

  },
  {
    Header: 'Oryginalna wartość',
    accessor: 'phrase',
  },
  {
    Header: 'Akcja',
    accessor: 'action',
    filterable: false,
    sortable: false,
    Cell: (rowData) => (
      <ActionColumn
        data={rowData.row._original}
        buttons={[
          {
            id: 'edit',
            label: 'Edytuj',
            onClick: () => {
              setFormId(rowData.row._original.id);
            },
          },
        ]}
      />
    ),
  },
];

export const mockData = [
  {
    id: 'cms_content_1',
    code: 'cms_content_1',
    scope: 'cms',
    title: 'Przykłądowy CMS 1',
    phrase: '<div>'
        + '<h5>Sample title</h5><strong>But I must explain to you how all this mistaken</strong>'
        + ' idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system,'
        + ' and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.'
        + ' No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to'
        + ' pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or'
        + ' pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil'
        + ' and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise,'
        + ' except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure '
        + 'that has no annoying consequences,'
        + ' or one who avoids a pain that produces no resultant pleasure?</div>',
    translation: '',
  },
  {
    id: 'cms_content_2',
    code: 'cms_content_2',
    scope: 'cms',
    title: 'Przykłądowy CMS 2',
    phrase: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form injected humour,'
        + " or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure"
        + " there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined"
        + ' chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined'
        + ' with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore'
        + ' always free from repetition, injected humour, or non-characteristic words etc.',
    translation: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,'
        + ' totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
        + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores '
        + 'eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,'
        + ' adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
        + ' Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
        + ' Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,'
        + ' vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  },
  {
    id: 'cms_content_3',
    code: 'cms_content_3',
    scope: 'cms',
    title: 'Przykłądowy CMS 3',
    phrase: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
        + ' The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using '
        + "'Content here, content here', making it look like readable English. Many desktop publishing packages and web page "
        + "editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still "
        + 'in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose '
        + '(injected humour and the like).',
    translation: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. '
        + "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of typ"
        + ' and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,'
        + ' remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,'
        + ' and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
  },
  {
    id: 'cms_content_4',
    code: 'cms_content_4',
    scope: 'cms',
    title: 'Przykłądowy CMS 4',
    phrase: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical ,'
        + ' making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, '
        + ' Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature.'
        + ' Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil).'
        + ' This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,'
        + ' comes from a line in section 1.10.32.',
    translation: '',
  },
];

Description.propTypes = {
  language: PropTypes.string,
};

Description.defaultProps = {
  language: '',
};
