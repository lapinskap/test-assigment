import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Loader as LoaderAnim } from 'react-loaders';
import { isMockView, restApiRequest } from '../../utils/Api';
import ContentLoading from './contentLoading';
import { dynamicNotification } from '../../utils/Notifications';
import __ from '../../utils/Translations';
import ApiForbiddenError from '../../utils/Api/ApiForbiddenError';

const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;

const NoAccessMessage = () => <strong>{__('Nie masz dostępu do tego zasobu')}</strong>;

const fetchData = async (updateData, path, isMock, service, { headers, params }, mockDataPath) => {
  if (isMock || isMockView()) {
    const data = await fetch(`/mockData${mockDataPath || path}.json`).then((res) => res.json());
    updateData(data);
  } else {
    const result = await restApiRequest(service, path, 'GET', { headers, params }, {});
    updateData(result);
  }
};

export default function DataLoading({
  children,
  service,
  options,
  updateData,
  endpoint,
  isMock,
  fetchedData,
  isNew,
  forceLoader,
  mockDataEndpoint,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    if (!(fetchedData || isNew) && !isLoading && hasAccess) {
      setIsLoading(true);
      fetchData(updateData, endpoint, isMock, service, options, mockDataEndpoint)
        .then(() => setIsLoading(false))
        .catch((e) => {
          if (e instanceof ApiForbiddenError) {
            setHasAccess(false);
          } else {
            dynamicNotification(e.message || __('Nie udało się pobrać danych'), 'error');
          }
        });
    }
  }, [fetchedData, isNew, isLoading, updateData, endpoint, isMock, service, options, mockDataEndpoint, hasAccess, setHasAccess]);

  return (
    <ContentLoading
      message={hasAccess ? spinner : <NoAccessMessage />}
      show={(!(fetchedData || isNew) || forceLoader)}
      messageStyle={{ position: 'absolute', top: '20%', right: '50%' }}
    >
      {children}
    </ContentLoading>
  );
}

DataLoading.propTypes = {
  children: PropTypes.node.isRequired,
  endpoint: PropTypes.string.isRequired,
  mockDataEndpoint: PropTypes.string,
  fetchedData: PropTypes.bool.isRequired,
  forceLoader: PropTypes.bool,
  isMock: PropTypes.bool,
  isNew: PropTypes.bool,
  service: PropTypes.string,
  options: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    headers: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object,
  }),
  updateData: PropTypes.func.isRequired,
};
DataLoading.defaultProps = {
  service: null,
  mockDataEndpoint: null,
  forceLoader: false,
  isMock: false,
  isNew: false,
  options: {},
};
