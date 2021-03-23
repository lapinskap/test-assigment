import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import Filters from './Filters';
import ContentLoading from '../../../../../Components/Loading/contentLoading';
import { dynamicNotification } from '../../../../../utils/Notifications';
import __ from '../../../../../utils/Translations';
import { handleFrontendFilters, prepareBackendFilters } from './utils';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../utils/Api';

export default function PendingBenefits({ companyId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      const params = prepareBackendFilters(filters, companyId);
      let response = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/employee-subscription-items',
        'GET',
        {
          params,
        },
        [],
      );
      response = handleFrontendFilters(response, filters);
      setData(response);
    } catch (e) {
      setData([]);
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się pobrać listy benefitów oczekujacych.'), 'error');
    }
    setIsLoading(false);
  }, [companyId]);
  const updateItem = useCallback(async (updatedItem) => {
    const item = data.find(({ id }) => id === updatedItem.id);
    if (item) {
      const updatedData = [...data];
      updatedData[data.indexOf(item)] = updatedItem;
      setData(updatedData);
    }
  }, [data]);

  useEffect(() => {
    fetchData({});
  }, [fetchData]);

  return (
    <>
      <Filters fetchData={fetchData} companyId={companyId} />
      <ContentLoading show={isLoading}>
        <Table subscriptionsData={data} updateItem={updateItem} />
      </ContentLoading>
    </>
  );
}

PendingBenefits.propTypes = {
  companyId: PropTypes.string.isRequired,
};
