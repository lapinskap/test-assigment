import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';
import useActiveForms, { IRI_PREFIX as ACTIVE_FORM_IRI_PREFIX } from '../../../../../../utils/hooks/activeForms/useActiveForms';
import { booleanOptions, SelectFilter } from '../../../../../../Components/DataTable/filters';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { getIdFromIri } from '../../../../../../utils/jsHelpers/iriConverter';
import __ from '../../../../../../utils/Translations';

export default function ActiveForms({ updateBenefitActiveForms, benefitActiveForms, disableAssign }) {
  const [tableData, setTableData] = useState([]);
  const activeForms = useActiveForms(false, null, null, true);

  useEffect(() => {
    setTableData(activeForms.map((el) => ({ ...el, isEnabled: !disableAssign && benefitActiveForms.includes(el.id) })));
  }, [activeForms, benefitActiveForms, disableAssign]);

  const toggleActive = (id, selected) => {
    if (selected) {
      // if (!benefitActiveForms.includes(id)) {
      // benefitActiveForms.push(id);
      // updateBenefitActiveForms([...benefitActiveForms]);
      // }
      // Temporary only one active form per benefit
      updateBenefitActiveForms([id]);
    } else {
      updateBenefitActiveForms(benefitActiveForms.filter((el) => el !== id));
    }
  };

  return (
    <div className="mb-1">
      {disableAssign ? (
        <Alert color="secondary">
          {__('Brak możliwości wyboru formularzy aktywnych dla wybranego zakresu gromadzonych danych.')}
        </Alert>
      ) : (
        <Alert color="secondary">
          {__('Do abonamentu może być przypisany tylko jeden formularz aktywny.')}
        </Alert>
      )}
      <DataTable
        id="activeFormsListing"
        noCards
        columns={[
          {
            Header: 'W użyciu',
            accessor: 'isEnabled',
            Filter: SelectFilter(booleanOptions, false),
            Cell: (rowData) => (
              <div className="d-block w-100 text-center">
                <ToggleSwitch
                  disabled={disableAssign}
                  handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                  checked={Boolean(rowData.row._original.isEnabled)}
                  id={rowData.row._original.id}
                />
              </div>
            ),
          },
          {
            Header: 'Nazwa',
            accessor: 'name',
          },
          {
            Header: 'Zobacz',
            accessor: 'action',
            sortable: false,
            filterable: false,
            Cell: (cellInfo) => (
              <div className="d-block w-100 text-center">
                <ActionColumn
                  data={cellInfo.row._original}
                  buttons={[
                    {
                      id: 'preview',
                      className: 'm-1',
                      color: 'link',
                      label: 'Zobacz',
                      target: '_blank',
                      href: `/active-forms/${getIdFromIri(cellInfo.row._original.id, ACTIVE_FORM_IRI_PREFIX)}`,
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
        data={tableData}
        filterable
        showPagination
        defaultPageSize={10}
        defaultSorted={defaultSorting}
      />
    </div>
  );
}

ActiveForms.propTypes = {
  benefitActiveForms: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateBenefitActiveForms: PropTypes.func.isRequired,
  disableAssign: PropTypes.bool.isRequired,
};
const defaultSorting = [
  {
    id: 'isEnabled',
    desc: true,
  },
];
