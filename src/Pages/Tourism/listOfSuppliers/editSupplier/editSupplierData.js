import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../../Components/Form';

export default function EditSupplierData({ data }) {
  return (
    <Form
      id="editSupplierForm"
      data={data}
      config={{
        stickyTitle: false,
        defaultOnChange: () => {},
        title: 'PODSTAWOWE INFORMACJE',
        groupsAsColumns: true,
        formGroups: [
          {
            formElements: [
              {
                type: 'text',
                id: 'objectName',
                label: 'Nazwa dostawcy:',
                props: {
                  disabled: true,
                },
              },
              {
                type: 'text',
                id: 'objectCooperationArea',
                label: 'Obszar:',
                props: {
                  disabled: true,
                },
              },
              // {
              //   type: 'select',
              //   label: 'Kategoria',
              //   id: 'benefitType',
              //   options: [
              //     { value: 'category1', label: 'Grupa 1' },
              //     { value: 'category2', label: 'Grupa 2' },
              //     { value: 'category3', label: 'Grupa 3' },
              //   ],
              // },
              // {
              //   type: 'text',
              //   label: 'NIP',
              //   id: 'nip',
              //   validation: ['nip'],
              // },
              // {
              //   type: 'text',
              //   id: 'regon',
              //   label: 'REGON',
              //   validation: ['regon'],
              // },
              // {
              //   type: 'text',
              //   id: 'krs',
              //   label: 'KRS',
              //   validation: ['krs'],
              // },
              // {
              //   component: <h6><strong>DANE KONTAKTOWE</strong></h6>,
              // },
              // {
              //   type: 'text',
              //   id: 'phone1',
              //   label: 'Telefon',
              //   validation: ['phone'],
              // },
              // {
              //   type: 'text',
              //   id: 'fax',
              //   label: 'Fax',
              //   validation: ['fax'],
              // },
            ],
          },
          {
            formElements: [
              {
                component: <h6 key="form_title"><strong>LOKALIZACJA DOSTAWCY</strong></h6>,
              },
              // {
              //   type: 'select',
              //   label: 'Województwo',
              //   id: 'voivodeship',
              //   options: [
              //     { value: 'voivodeship1', label: 'Dolnośląskie' },
              //     { value: 'voivodeship2', label: 'Śląskie' },
              //     { value: 'voivodeship3', label: 'Mazowieckie' },
              //   ],
              // },
              // {
              //   type: 'select',
              //   label: 'Powiat',
              //   id: 'county',
              //   options: [
              //     { value: 'county1', label: 'Powiat 1' },
              //     { value: 'county2', label: 'Powiat 2' },
              //     { value: 'county3', label: 'Powiat 3' },
              //   ],
              // },
              {
                type: 'text',
                label: 'Miasto:',
                id: 'city',
                props: {
                  disabled: true,
                },
              },
              // {
              //   component: <h6><strong>DANE DODATKOWE</strong></h6>,
              // },
              // {
              //   type: 'wysiwyg',
              //   id: 'additionalInfo',
              //   label: 'Opis danych dodatkowych',
              // },
            ],
          },
        ],
      }}
    />
  );
}

EditSupplierData.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};
