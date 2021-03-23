import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Button, Input } from 'reactstrap';
import { Loader } from 'react-loaders';
import DataTableControlled, { getListingData } from '../../../Components/DataTableControlled';
import { SelectFilter } from '../../../Components/DataTable/filters';
import GoogleTranslate from './googleTranslate';
import { mapValueFromOptions } from '../../../Components/DataTable/commonCells';
import __ from '../../../utils/Translations';
// eslint-disable-next-line import/no-cycle
import Form from './form';
import { restApiRequest, TRANSLATOR_SERVICE } from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';
import { getAllOptions } from './fetchScopeOptions';
import { ExportContext } from '../../../Components/DataTableControlled/exportButton';

export default function Listing({
  language, type, mockData, scopeOptions, exportContext,
}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [googleTranslations, setGoogleTranslations] = useState({});
  const [saveInProgressArray, setSaveInProgressArray] = useState([]);
  const [formId, setFormId] = useState(null);
  const fetchData = async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      TRANSLATOR_SERVICE,
      '/translations',
      filters,
      page,
      pageSize,
      sort,
      {
        params: {
          language,
          type,
        },
      },
      mockData,
    );
    setData(newData);
    setCount(newCount);
    getSuggestions(newData);
  };

  const getSuggestions = async (listingData) => {
    const phrases = listingData.map((item) => item.phrase)
      .filter(Boolean);
    if (!phrases.length) {
      return;
    }
    const suggestions = await restApiRequest(
      TRANSLATOR_SERVICE,
      '/get-suggestions',
      'GET',
      {
        params: {
          language,
          value: phrases,
        },
      },
      [],
    );

    const updatedData = [...listingData];
    if (suggestions.length) {
      suggestions.forEach(({ phrase, translations }) => {
        updatedData.forEach((item) => {
          if (item.phrase.toLowerCase() === phrase.toLowerCase()) {
            // eslint-disable-next-line no-param-reassign
            item.suggestions = translations;
          }
        });
      });
      setData(updatedData);
    }
  };

  const onSave = async (id, value) => {
    await updateData(id, value);
    setActiveId(null);
  };

  const closeForm = () => {
    setFormId(null);
  };
  const updateData = async (id, value) => {
    saveInProgressArray.push(id);
    try {
      await restApiRequest(TRANSLATOR_SERVICE,
        `/translations/${id}`,
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
        setData(data);
        dynamicNotification(__('Pomyślnie zapisano tłumaczenie.'));
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(__('Nie udało się poprawnie zapisać tłumaczenia.'), 'error');
    }
    setSaveInProgressArray(saveInProgressArray.filter((el) => el !== id));
  };

  const focusInput = (id) => document.getElementById(`translate_input_${id}`)
    .focus();
  return (
    <>
      <DataTableControlled
        id="translationsListing"
        exportContext={exportContext}
        columns={[
          {
            Header: 'Kod',
            accessor: 'code',
            width: 400,
          },
          {
            Header: 'Zakres',
            accessor: 'scope',
            Filter: SelectFilter(scopeOptions, true),
            filterMethod: (filter) => {
              switch (filter.value) {
                default:
                  return true;
              }
            },
            width: 150,
            Cell: mapValueFromOptions(scopeOptions, 'scope'),
          },
          {
            Header: 'Oryginalna wartość',
            accessor: 'phrase',
          },
          {
            Header: 'Tłumaczenie',
            accessor: 'translation',
            Cell: getDynamicEditableCell(data, updateData, setActiveId, activeId, saveInProgressArray),

          },
          {
            Header: 'Sugestia',
            accessor: 'suggestions',
            filterable: false,
            sortable: false,
            Cell: (cellInfo) => (
              <div>
                {cellInfo.row.suggestions ? cellInfo.row.suggestions.map(({ value, scope }, key) => (cellInfo.row.scope !== scope ? (
                  <Fragment
                    /* eslint-disable-next-line react/no-array-index-key */
                    key={key}
                  >
                    {value}
                    {' '}
                    (
                    {getLabelForOption(getAllOptions(), scope)}
                    )
                    <br />
                  </Fragment>
                ) : null)) : null}
              </div>
            ),
          },
          {
            Header: 'Google Translate',
            accessor: 'google_translate',
            filterable: false,
            sortable: false,
            width: 100,
            Cell: (cellInfo) => (
              <div className="d-block w-100 text-center">
                <GoogleTranslate
                  language={language}
                  googleTranslations={googleTranslations}
                  setGoogleTranslations={setGoogleTranslations}
                  phrase={cellInfo.row.phrase}
                />
              </div>
            ),
          },
          {
            Header: 'Akcja',
            accessor: 'action',
            filterable: false,
            sortable: false,
            width: 100,
            Cell: (cellInfo) => (
              <div className="d-block w-100 text-center">
                <Button color="link" onClick={() => setFormId(cellInfo.row._original.id)}>Edytuj</Button>
              </div>
            ),
          },
        ]}
        fetchData={fetchData}
        data={data}
        count={count}
        filterable
        getTrProps={(state, rowInfo) => ({
          onClick: (e) => {
            if (e.target.tagName === 'INPUT') {
              const { id } = rowInfo.row._original;
              if (id !== activeId) {
                setActiveId(id);
                setTimeout(() => {
                  focusInput(id);
                }, 100);
              }
            }
          },
        })}
      />
      {formId ? (
        <Form
          close={closeForm}
          initialData={data.find((item) => item.id === formId)}
          onSave={onSave}
          language={language}
        />
      ) : null}
    </>
  );
}

export const getDynamicEditableCell = (data, updateData, setActiveId, activeId, saveInProgressArray) => {
  const renderEditable = (cellInfo) => {
    const { id } = cellInfo.row._original;
    const isActive = id === activeId;
    const item = data.find((el) => el.id === cellInfo.row._original.id);
    if (!item) {
      return null;
    }
    const inputData = item[cellInfo.column.id];
    return (
      <div className="d-block w-100 text-center" key={id}>
        {saveInProgressArray.includes(id)
          ? <Loader active type="line-scale" style={{ transform: 'scale(0.6)' }} /> : (
            <Input
              id={`translate_input_${id}`}
              defaultValue={inputData}
              type="text"
              autoFocus={isActive}
              disabled={!isActive}
              onBlur={(e) => {
                const { value } = e.target;
                if (String(value) !== String(inputData)) {
                  updateData(id, value);
                }
              }}
              onKeyDown={(e) => {
                const { key } = e;
                if (key === 'Escape') {
                  setActiveId(null);
                } else if (key === 'ArrowDown' || key === 'Enter') {
                  if (key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                  }
                  e.target.blur();
                  const ids = data.map((el) => el.id);
                  const currPosition = ids.indexOf(id);
                  if (currPosition < ids.length - 1) {
                    setActiveId(ids[currPosition + 1]);
                  }
                } else if (key === 'ArrowUp') {
                  const ids = data.map((el) => el.id);
                  const currPosition = ids.indexOf(id);
                  if (currPosition !== 0) {
                    e.target.blur();
                    setActiveId(ids[currPosition - 1]);
                  }
                }
              }}
            />
          )}
      </div>
    );
  };
  return renderEditable;
};

const getLabelForOption = (options, value) => {
  const matchedOption = options.find((option) => option.value === value);
  return matchedOption ? matchedOption.label : value;
};

Listing.propTypes = {
  language: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mockData: PropTypes.array.isRequired,
  scopeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.number,
  })),
  type: PropTypes.number.isRequired,
  exportContext: PropTypes.instanceOf(ExportContext),
};

Listing.defaultProps = {
  scopeOptions: [],
  exportContext: null,
};
