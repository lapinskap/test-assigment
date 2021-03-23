/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { CSSTransitionGroup } from 'react-transition-group';
import { Alert, Button } from 'reactstrap';
import Form from '../../../Components/Form/index';

import { LAYOUT_TWO_COLUMNS, LAYOUT_ONE_COLUMN } from '../../../Components/Layouts';
import {
  CODES_VISIBILITY_ALWAYS,
  CODES_VISIBILITY_CUSTOM,
  CODES_VISIBILITY_NEVER,
} from './consts';
import { catalogProductPermissionWrite } from '../../../utils/RoleBasedSecurity/permissions';
import __ from '../../../utils/Translations';
import { CATALOG_MANAGEMENT_SERVICE, restApiRequest } from '../../../utils/Api';
import { parseDataFromBackend, formatDate } from './utils';
import { dynamicNotification } from '../../../utils/Notifications';
import { getUserConfirmationPopup } from '../../../Components/UserConfirmationPopup';
import useDictionary from '../../../utils/hooks/dictionaries/useDictionary';
import { DICTIONARY_VAT_CATEGORIES } from '../../../utils/hooks/dictionaries/dictionariesCodes';

export default function Prices({
  data, setData, next, title, isNew, productId,
}) {
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);

  const configurations = data && data.configurationsData && data.configurationsData.length ? data.configurationsData : [{}];
  const updateSubProductField = (key, value, field) => {
    const index = +key.replace(field, '');
    const newConfiguration = [...configurations];
    newConfiguration[index][field] = value;
    onChange('configurationsData', newConfiguration);
  };
  let productsFields = [{
    component: <div />,
    key: 'div',
  }];

  const vatCategoriesDictionaries = useDictionary(DICTIONARY_VAT_CATEGORIES);

  const archiveSubProduct = async (index) => {
    const updatedProducts = configurations || [];
    const toArchive = updatedProducts.find((el, elIndex) => elIndex === index);
    if (toArchive) {
      try {
        const response = await restApiRequest(
          CATALOG_MANAGEMENT_SERVICE,
          `/products/${productId}`,
          isNew ? 'POST' : 'PATCH',
          {
            body: {
              configurationsData: [
                {
                  id: toArchive.id,
                  archived: true,
                },
              ],
            },
          },
          data,
        );
        setData(parseDataFromBackend(response));
        dynamicNotification(__('Pomyślnie zarchiwizowano  produkt'));
      } catch (e) {
        console.error(e);
        dynamicNotification(e.message || __('Nie udało się zarchiwizować produktu'), 'error');
      }
    }
  };

  const isConfigurableProduct = Boolean(data && data.configurableProduct === '1');

  const subProductsData = {};
  if (data && isConfigurableProduct) {
    configurations.forEach((el, index) => {
      Object.keys(el).forEach((key) => {
        subProductsData[`${key}${index}`] = el[key];
      });
    });
    productsFields = configurations.map((product, index) => {
      let removeButton = null;
      if (product.id) {
        removeButton = product.archived ? (
          <span>{__('Zarchiwizowany')}</span>
        ) : (
          <Button
            color="link"
            onClick={() => getUserConfirmationPopup(
              __('Czy na pewno chcesz zarchiwizować produkt {0}?', [subProductsData[`label${index}`]]),
              (confirm) => confirm && archiveSubProduct(index),
              __('Czy jesteś pewien?'),
            )}
            data-t1="delete"

          >
            {__('Archiwizuj')}
          </Button>
        );
      } else if (configurations.length > 1) {
        removeButton = (
          <i
            className="lnr-trash btn-icon-wrapper cursor-pointer"
            role="presentation"
            onClick={() => removeProduct(index)}
          />
        );
      }
      return ({
        layout: LAYOUT_ONE_COLUMN,
        formElements: [
          {
            type: 'text',
            id: `label${index}`,
            onChange: (key, value) => updateSubProductField(key, value, 'label'),
            label: (
              <>
                {removeButton}
                {' '}
                {`${index + 1}. Nazwa wyświetlana przy wyborze wariantu:`}
              </>
            ),
            validation: ['required'],
            props: {
              disabled: Boolean(product.id),
            },
          },
          {
            type: 'text',
            id: `additionalInfo${index}`,
            label: 'Informacja dodatkowa:',
            onChange: (key, value) => updateSubProductField(key, value, 'additionalInfo'),
            translatable: {
              scope: `catalog-management_product_additionalInfo${index}`,
            },
            props: {
              disabled: Boolean(product.id),
            },
          },
          {
            layout: LAYOUT_TWO_COLUMNS,
            formElements: [
              {
                type: 'date',
                id: `eventDate${index}`,
                label: 'Data wydarzenia:',
                onChange: (key, value) => updateSubProductField(key, value, 'eventDate'),
                props: {
                  disabled: Boolean(product.id),
                },
              },
              {
                type: 'time',
                id: `eventTime${index}`,
                label: 'Godzina wydarzenia:',
                onChange: (key, value) => updateSubProductField(key, formatDate(value), 'eventTime'),
                props: {
                  disabled: Boolean(product.id),
                },
              },
              {
                type: 'text',
                id: `sellingPrice${index}`,
                label: 'Cena sprzedaży:',
                onChange: (key, value) => updateSubProductField(key, value, 'sellingPrice'),
                suffix: 'PLN',
                valueFormatter: 'float',
                props: {
                  disabled: Boolean(product.id),
                },
              },
              {
                type: 'text',
                id: `marketPrice${index}`,
                label: 'Cena rynkowa:',
                onChange: (key, value) => updateSubProductField(key, value, 'marketPrice'),
                suffix: 'PLN',
                validation: [{ method: 'greaterThan', args: [+subProductsData[`sellingPrice${index}`]] }],
                valueFormatter: 'float',
                props: {
                  disabled: Boolean(product.id),
                },
              },
              {
                type: 'text',
                id: `purchasePrice${index}`,
                label: 'Cena zakupu:',
                onChange: (key, value) => updateSubProductField(key, value, 'purchasePrice'),
                suffix: 'PLN',
                valueFormatter: 'float',
                props: {
                  disabled: Boolean(product.id),
                },
              },
            ],
          },
        ],
      });
    });
  } else if (!isConfigurableProduct) {
    productsFields = [
      {
        type: 'text',
        id: 'additionalInfo',
        label: 'Informacja dodatkowa:',
        translatable: {
          scope: 'catalog-management_product_additionalInfo',
        },
      },
      {
        layout: LAYOUT_TWO_COLUMNS,
        formElements: [
          {
            type: 'date',
            id: 'saleDateFrom',
            label: 'Sprzedaż zaczyna się:',
            showTimeSelect: true,
          },
          {
            type: 'date',
            id: 'saleDateTo',
            label: 'Sprzedaż do:',
            showTimeSelect: true,
          },
          {
            type: 'date',
            id: 'eventDate',
            label: 'Data wydarzenia:',
          },
          {
            type: 'time',
            id: 'eventTime',
            label: 'Godzina wydarzenia:',
            onChange: (key, value) => onChange(key, formatDate(value)),
          },
          {
            type: 'text',
            id: 'sellingPrice',
            label: 'Cena sprzedaży:',
            suffix: 'PLN',
            valueFormatter: 'float',
          },
          {
            type: 'text',
            id: 'marketPrice',
            label: 'Cena rynkowa:',
            suffix: 'PLN',
            validation: [{ method: 'greaterThan', args: [+data.sellingPrice] }],
            valueFormatter: 'float',
          },
          {
            type: 'text',
            id: 'purchasePrice',
            label: 'Cena zakupu:',
            suffix: 'PLN',
            valueFormatter: 'float',
          },
        ],
      },
    ];
  }
  const addProduct = () => {
    const updatedProducts = configurations || [];
    updatedProducts.push({});
    onChange('configurationsData', updatedProducts);
  };
  const removeProduct = (index) => {
    const updatedProducts = configurations || [];
    onChange('configurationsData', updatedProducts.filter((el, elIndex) => elIndex !== index));
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
        <Form
          id="step4Form"
          data={{ ...data, ...subProductsData }}
          config={{
            stickyTitle: false,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            noCards: true,
            onSubmit: next,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                id: 'step4FormSubmit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'radio',
                    id: 'configurableProduct',
                    label: 'Typ zarządzania ceną:',
                    props: {
                      disabled: !isNew,
                    },
                    options: [
                      {
                        value: 0, label: 'Produkt prosty',
                      },
                      {
                        value: 1, label: 'Produkt konfigurowalny',
                      },
                    ],
                  },
                  {
                    component:
  <Alert color="secondary" key="price-info">
    Cena sprzedaży obowiązkowa do uzupełnienia, jeśli produkt ma zostać
    aktywowany na froncie.

    Jeżeli uzupełniona jest cena rynkowa - musi być wyższa od ceny
    sprzedaży.
  </Alert>,
                  },
                  {
                    layout: LAYOUT_TWO_COLUMNS,
                    formElements: [
                      {
                        layout: LAYOUT_ONE_COLUMN,
                        formElements: [
                          ...productsFields,
                          {
                            displayCondition: isConfigurableProduct,
                            component: (
                              <Button key="add_Fields" color="link" onClick={addProduct}>
                                <i className="pe-7s-plus pe-3x pe-va" />
                                {' '}
                                Dodaj kolejny produkt w serii
                              </Button>
                            ),
                          },
                        ],
                      },
                      {
                        layout: LAYOUT_ONE_COLUMN,
                        formElements: [
                          {
                            type: 'text',
                            id: 'notificationsAmount',
                            label: 'Ilość do alertu:',
                            valueFormatter: 'integer',
                          },
                          {
                            layout: LAYOUT_ONE_COLUMN,
                            border: Boolean(data && data.codesCountVisibility === 'CUSTOM'),
                            formElements: [
                              {
                                type: 'radio',
                                id: 'codesCountVisibility',
                                label: 'Widoczność liczby kodów:',
                                validation: ['required'],
                                className: 'm-0',
                                options: [
                                  { value: CODES_VISIBILITY_NEVER, label: 'nigdy' },
                                  { value: CODES_VISIBILITY_ALWAYS, label: 'zawsze' },
                                  {
                                    value: CODES_VISIBILITY_CUSTOM,
                                    label: 'jeśli liczba kodów jest mniejsza/równa',
                                  },
                                ],
                              },
                              {
                                type: 'text',
                                className: 'm-0',
                                id: 'codesCountVisibilityNumber',
                                label: 'Wpisz wartość:',
                                validation: ['required'],
                                valueFormatter: 'integer',
                                depends: {
                                  field: 'codesCountVisibility',
                                  value: CODES_VISIBILITY_CUSTOM,
                                },
                              },
                            ],
                          },
                          {
                            type: 'boolean',
                            isCheckbox: true,
                            id: 'canBuyMultiple',
                            label: 'Możliwość zakupu wielu kodów na raz',
                          },
                          {
                            id: 'automaticProductPublicationDisabled',
                            label: 'Zablokuj automatyczną publikacje produktów',
                            type: 'boolean',
                          },
                          {
                            type: 'select',
                            id: 'taxRate',
                            label: 'Stawka VAT:',
                            options: vatCategoriesDictionaries,
                            validation: ['required'],
                          },
                          {
                            type: 'select',
                            id: 'settlementMethod',
                            label: 'Sposób rozliczania',
                            options: [
                              { value: 'IN_ARREARS_OF_COMPLETED', label: 'Na zakończeniu' },
                              { value: 'IN_ARREARS_OF_SOLD', label: 'Na sprzedaży' },
                              { value: 'IN_ADVANCE', label: 'Z góry' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

Prices.propTypes = {
  next: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  productId: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  title: PropTypes.string,
};
Prices.defaultProps = {
  next: () => {
  },
  title: null,
};
