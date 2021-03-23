import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';
import usePdfForms, { IRI_PREFIX as ACTIVE_FORM_IRI_PREFIX } from '../../../../../../utils/hooks/pdfForms/usePdfForms';
import { booleanOptions, SelectFilter } from '../../../../../../Components/DataTable/filters';
import ToggleSwitch from '../../../../../../Components/FormElements/ToggleSwitch';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { getIdFromIri } from '../../../../../../utils/jsHelpers/iriConverter';

export default function PdfForms({ updateBenefitPdfForms, benefitPdfForms, companyId }) {
  const [tableData, setTableData] = useState([]);
  const pdfForms = usePdfForms(false, 'companyId', companyId, true);

  useEffect(() => {
    setTableData(pdfForms.map((el) => ({ ...el, isEnabled: benefitPdfForms.includes(el.id) })));
  }, [pdfForms, benefitPdfForms]);

  const toggleActive = (id, selected) => {
    if (selected) {
      if (!benefitPdfForms.includes(id)) {
        benefitPdfForms.push(id);
        updateBenefitPdfForms([...benefitPdfForms]);
      }
    } else {
      updateBenefitPdfForms(benefitPdfForms.filter((el) => el !== id));
    }
  };

  return (
    <div className="mb-1">
      <DataTable
        id="pdfFormsListing"
        noCards
        columns={[
          {
            Header: 'W użyciu',
            accessor: 'isEnabled',
            Filter: SelectFilter(booleanOptions, false),
            Cell: (rowData) => (
              <div className="d-block w-100 text-center">
                <ToggleSwitch
                  handleChange={(isOn) => toggleActive(rowData.row._original.id, isOn)}
                  checked={Boolean(rowData.row._original.isEnabled)}
                  id={rowData.row._original.id}
                />
              </div>
            ),
          },
          {
            Header: 'Opis',
            accessor: 'description',
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
                      href: `/company/edit/${companyId}/subscriptions/pdf-forms/${
                        getIdFromIri(cellInfo.row._original.id, ACTIVE_FORM_IRI_PREFIX)
                      }`,
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

PdfForms.propTypes = {
  benefitPdfForms: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateBenefitPdfForms: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
};
const defaultSorting = [
  {
    id: 'isEnabled',
    desc: true,
  },
];
