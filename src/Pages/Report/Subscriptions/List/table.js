import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DataTableControlled, { getListingData } from '../../../../Components/DataTableControlled';
import { booleanOptions, SelectFilter } from '../../../../Components/DataTable/filters';
import { isMockView, restApiRequest, REPORT_SERVICE } from '../../../../utils/Api';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import { SubscriptionListMock, formatDropdownMock, subscribeMethodMock } from '../mockData';
import ToggleSwitch from '../../../../Components/FormElements/ToggleSwitch';
import UserConfirmationPopup from '../../../../Components/UserConfirmationPopup';
import { dynamicNotification } from '../../../../utils/Notifications';
import { getAhrUrl } from '../../helpers/ahrHelper';

const SubscriptionTable = ({ isAhr, selectCompany }) => {
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [subscriptionListCount, setSubscriptionListCount] = useState(0);

  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState({});

  const [subscribeMethodOptions, setSubscribeMethodOptions] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);

  const editSubUrl = (id) => getAhrUrl(`/report/subscriptions/edit/${id}`, isAhr);

  useEffect(() => {
    fetchSubscribeMethodDropdown();
    fetchSubscribeFormatDropdown();
  }, []);

  const columns = () => [
    {
      Header: 'Nazwa raportu',
      accessor: 'reportName',
    },
    {
      Header: 'Utworzono',
      accessor: 'createdStr',
    },
    {
      Header: 'Sposób wysyłki',
      accessor: 'subscriptionMethod',
      Filter: SelectFilter(subscribeMethodOptions),
      Cell: mapValueFromOptions([], 'subscriptionMethod'),
    },
    {
      Header: 'Format i Kodowanie',
      accessor: 'format',
      Filter: SelectFilter(formatOptions),
      Cell: mapValueFromOptions([], 'format'),
    },
    {
      Header: 'Częstotliwość',
      accessor: 'frequency',
      filterable: false,
    },
    {
      Header: 'Adresaci',
      accessor: 'recipients',
      filterable: false,
    },
    {
      Header: 'Aktywna',
      accessor: 'active',
      Filter: SelectFilter(booleanOptions),
      Cell: (rowData) => (
        <div className="d-block w-100 text-center">
          <ToggleSwitch
            id={`switch${rowData.row._original.id}`}
            handleChange={(isOn) => {
              updateIsActive(rowData.row._original.id, isOn);
            }}
            checked={rowData.row._original.active}
          />
        </div>
      ),
    },
    {
      Header: 'Akcja',
      maxWidth: 150,
      filterable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <Link to={editSubUrl(rowData.row._original.id)}><Button role="button" color="link">Edytuj</Button></Link>
          {((!isAhr) || (isAhr && rowData.row._original.isCreator))
          && <Button role="button" color="link" onClick={() => handleDeleteClick(rowData.row._original.id)}>Usuń</Button>}

        </div>
      ),
    },
  ];

  const updateIsActive = (id, isOn) => {
    const updatedData = [...subscriptionList];
    const item = updatedData.find((el) => el.id === id);
    item.active = isOn;

    fetchData(() => { setSubscriptionList(updatedData); },
      `/subscription/active/${id}&${isOn}`,
      REPORT_SERVICE,
      'PATCH',
      { },
      {},
      'Błąd podczas zmiany aktywności wysyłki');
  };

  const fetchSubscribeMethodDropdown = () => {
    fetchData(setSubscribeMethodOptions,
      '/dropdown/subscriptionmethod',
      REPORT_SERVICE,
      'GET',
      {},
      subscribeMethodMock,
      'Błąd podczas pobierania listy metod wysyłki');
  };

  const fetchSubscribeFormatDropdown = () => {
    fetchData(setFormatOptions,
      '/dropdown/format',
      REPORT_SERVICE,
      'GET',
      {},
      formatDropdownMock,
      'Błąd podczas pobierania listy dostępnych formatów');
  };

  const handleDeleteClick = (id) => {
    const subscription = subscriptionList.find((x) => x.id === id);
    setSelectedSubscription(subscription);

    setConfirmationPopup(true);
  };

  const deleteSubscriptionReport = () => {
    fetchData(() => {
      setSubscriptionList(subscriptionList.filter((x) => x.id !== selectedSubscription.id));
      setSubscriptionListCount(subscriptionListCount - 1);
      setConfirmationPopup(false);
    },
    `/subscription/${selectedSubscription.id}`,
    REPORT_SERVICE,
    'DELETE',
    { },
    {},
    'Błąd podczas usuwania');
  };

  const fetchSubscriptionList = useCallback(async (filters, page, pageSize, sort) => {
    const { data: newData, count: newCount } = await getListingData(
      REPORT_SERVICE,
      `/subscription/${selectCompany}`,
      filters,
      page,
      pageSize,
      sort,
      {},
      SubscriptionListMock,
    );
    setSubscriptionList(newData);
    setSubscriptionListCount(newCount);
  }, [selectCompany]);

  return (
    <>
      <DataTableControlled
        columns={columns()}
        data={subscriptionList}
        filterable
        fetchData={fetchSubscriptionList}
        count={subscriptionListCount}
      />
      <UserConfirmationPopup
        onCancel={() => setConfirmationPopup(false)}
        onConfirm={deleteSubscriptionReport}
        isOpen={confirmationPopup}
        title="Usuwanie"
        confirmLabel="Usuń"
        cancelLabel="Anuluj"
        message={`Czy na pewno chcesz usunąć wysyłkę ${selectedSubscription.reportName}?`}
      />
    </>
  );
};

export default SubscriptionTable;
SubscriptionTable.propTypes = {
  isAhr: PropTypes.bool.isRequired,
  selectCompany: PropTypes.string.isRequired,
};

const fetchData = async (updateData, endpoint, service, method, { headers, params, body }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params, body }, {});

      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};
