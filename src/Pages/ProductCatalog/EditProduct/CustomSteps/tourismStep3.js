/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Form from '../../../../Components/Form/index';
import { catalogProductPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';
import useDictionary from '../../../../utils/hooks/dictionaries/useDictionary';
import { DICTIONARY_VAT_CATEGORIES } from '../../../../utils/hooks/dictionaries/dictionariesCodes';

export default function TourismRulesOfRealization({
  data, setData, next, title,
}) {
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
    setData(updatedData);
  }, [data, setData]);
  const vatCategoriesDictionaries = useDictionary(DICTIONARY_VAT_CATEGORIES);

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
          id="step3Form"
          data={data}
          config={{
            stickyTitle: false,
            noCards: true,
            defaultOnChange: onChange,
            groupsAsColumns: true,
            onSubmit: next,
            title,
            buttons: [
              {
                size: 'lg',
                color: 'success',
                className: 'mr-2',
                text: 'Zapisz',
                type: 'submit',
                permission: catalogProductPermissionWrite,
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    type: 'wysiwyg',
                    id: 'rulesOfUse',
                    label: 'Opis:',
                    translatable: data.id ? {
                      code: `catalog-management:product:${data.id}:rulesOfUse`,
                      isCms: true,
                    } : null,
                  },
                  {
                    type: 'wysiwyg',
                    id: 'messageAfterPurchase',
                    label: 'Treść podsumowania:',
                    translatable: data.id ? {
                      code: `catalog-management:product:${data.id}:messageAfterPurchase`,
                      isCms: true,
                    } : null,
                  },
                ],
              },
              {
                formElements: [
                  {
                    id: 'benefitCostNumber',
                    type: 'text',
                    suffix: 'PLN',
                    props: {
                      min: 0,
                    },
                    valueFormatter: 'float',
                    depends: {
                      field: 'benefitCost',
                      value: 'constant',
                    },
                  },
                  {
                    type: 'select',
                    id: 'taxRate',
                    label: 'Stawka VAT:',
                    options: vatCategoriesDictionaries,
                    validation: ['required'],
                  },
                  // {
                  //   type: 'radio',
                  //   id: 'exemptFromTaxes',
                  //   validation: ['required'],
                  //   label: 'Czy ubruttowiony/zwolniony z opodatkowania:',
                  //   options: [
                  //     { value: 0, label: 'zwolniony' },
                  //     { value: 1, label: 'nie' },
                  //   ],
                  // },
                ],
              },
            ],
          }}
        />
      </CSSTransitionGroup>
    </>
  );
}

TourismRulesOfRealization.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  next: PropTypes.func,
  title: PropTypes.string,
  setData: PropTypes.func.isRequired,
};

TourismRulesOfRealization.defaultProps = {
  next: () => {},
  title: null,
};
