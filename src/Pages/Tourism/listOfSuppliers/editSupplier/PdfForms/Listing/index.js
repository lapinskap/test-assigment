import React, { useState } from 'react';

import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import DataTable from '../../../../../../Components/DataTable';
import DataLoading from '../../../../../../Components/Loading/dataLoading';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { booleanOptions, SelectFilter } from '../../../../../../Components/DataTable/filters';
import { mapValueFromOptions } from '../../../../../../Components/DataTable/commonCells';
import useBenefits from '../../../../../../utils/hooks/benefit/useBenefits';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
// import { useCompanyName } from '../../CompanyContext';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import { getUserConfirmationPopup } from '../../../../../../Components/UserConfirmationPopup';
import {
  subscriptionPdfFormFilePermissionWrite, subscriptionPdfFormFilePermissionRead,
} from '../../../../../../utils/RoleBasedSecurity/permissions';
import { downloadFormFieldFile, getFileName } from '../utils';
import RbsButton from '../../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';

export default function PdfFormsListing({ supplierId }) {
  const [data, setData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  // const getFormUrl = `/suppliers/edit/${supplierId}`;
  const getFormUrl = (id) => `/suppliers/edit/${supplierId}/pdf-forms/${id}`;

  const benefits = useBenefits(true, 'supplierId', supplierId, null, null, true);

  const deleteForm = async (idToDelete) => {
    try {
      setData(data.filter(({ id }) => id !== idToDelete));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/pdf-forms/${idToDelete}`,
        'DELETE',
        {
          returnNull: true,
        },
      );
      dynamicNotification(__('Pomyślnie zapisano formularz PDF'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć formularza PDF'), 'error');
      setFetchedData(false);
    }
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
        <DataLoading
          fetchedData={fetchedData}
          service={SUBSCRIPTION_MANAGEMENT_SERVICE}
          updateData={(updatedData) => {
            setData(updatedData);
            setFetchedData(true);
          }}
          endpoint={`/pdf-forms?supplierId=${supplierId}`}
          mockDataEndpoint="/company/pdfForm/list"
        >
          <DataTable
            id="companyPdfFormsListing"
            buttons={[
              {
                href: getFormUrl('-1'),
                permission: subscriptionPdfFormFilePermissionWrite,
                text: '+ Dodaj formularz',
                id: 'supplierFormsListingAdd',
                color: 'primary',
              },
            ]}
            data={data}
            filterable
            columns={[
              {
                Header: 'Opis',
                accessor: 'description',
              },
              {
                Header: 'Pliki formularzy',
                accessor: 'formFiles',
                Cell: (cellInfo) => {
                  const { column, original: cellData } = cellInfo;
                  const value = cellData[column.id];
                  return (
                    <div>
                      {!value || value.length <= 0 ? <div>{__('Brak plików')}</div> : (
                        <ul>
                          {value.map(({ language, file }) => {
                            const fileName = getFileName(file);
                            return (
                              <li key={language}>
                                {language}
                                :
                                {' '}
                                <span title={fileName}>
                                  {(fileName && fileName.length > 12) ? `${fileName.slice(0, 15)}...` : fileName}
                                </span>
                                {' '}
                                <RbsButton
                                  data-t1="downloadAttachmentFile"
                                  permission={subscriptionPdfFormFilePermissionRead}
                                  color="link"
                                  onClick={() => downloadFormFieldFile(file)}
                                >
                                  {__('Pobierz')}
                                </RbsButton>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                },
              },
              {
                Header: 'Powiazane benefity',
                accessor: 'benefits',
                Filter: SelectFilter(benefits),
                Cell: mapValueFromOptions(benefits, 'benefits'),
              },
              {
                Header: 'Z kodem kreskowym',
                accessor: 'withBarcode',
                Filter: SelectFilter(booleanOptions),
                Cell: mapValueFromOptions(booleanOptions, 'withBarcode'),
              },
              {
                Header: 'Akcja',
                accessor: 'action',
                filterable: false,
                Cell: (rowData) => (
                  <div className="d-block w-100 text-center">
                    <ActionColumn
                      data={rowData.row._original}
                      buttons={[
                        {
                          id: 'supplierPdfFormsDelete',
                          className: 'm-1',
                          color: 'link',
                          label: 'Usuń',
                          permission: subscriptionPdfFormFilePermissionWrite,
                          onClick: () => {
                            getUserConfirmationPopup(
                              __('Czy na pewno chcesz usunąć ten formularz?'),
                              (confirm) => confirm && deleteForm(rowData.row._original.id),
                              __('Usuwanie formularza PDF'),
                            );
                          },
                        },
                        {
                          id: 'companyPdfFormsEdit',
                          className: 'm-1',
                          color: 'link',
                          label: 'Edytuj',
                          href: getFormUrl(rowData.row._original.id),
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </DataLoading>
      </CSSTransitionGroup>
    </>
  );
}

PdfFormsListing.propTypes = {
  supplierId: PropTypes.string.isRequired,
};
