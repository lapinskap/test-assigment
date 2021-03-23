import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ActiveSubscriptions from './ActiveSubscriptions';
import CanceledSubscriptions from './CanceledSubscriptions';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import __ from '../../../../../../utils/Translations';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
import ContentLoading from '../../../../../../Components/Loading/contentLoading';
import Popup from './Popup';
import {
  STATUS_ACTIVE,
  STATUS_CANCELED, STATUS_RESIGNED, STATUS_SUSPENDED,
} from './utils';

const CANCELED_STATUSES = [STATUS_RESIGNED, STATUS_CANCELED];
const ACTIVE_STATUSES = [STATUS_ACTIVE, STATUS_SUSPENDED];

export default function Subscriptions({ active, employeeId, companyId }) {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [canceledSubscriptions, setCanceledSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const reloadSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employees/${employeeId}/subscriptions`,
        'GET',
        {},
        [],
      );
      let activeItems = [];
      let canceledItems = [];
      result.forEach(({ items }) => {
        activeItems = [...activeItems, ...items.filter(({ status }) => ACTIVE_STATUSES.includes(status))];
        canceledItems = [...canceledItems, ...items.filter(({ status }) => CANCELED_STATUSES.includes(status))];
      });
      setActiveSubscriptions(activeItems);
      setCanceledSubscriptions(canceledItems);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się pobrać listy świadczeń pracownika.'), 'error');
    }
    setIsLoading(false);
  }, [employeeId]);

  useEffect(() => {
    if (active) {
      reloadSubscriptions();
    }
  }, [active, reloadSubscriptions]);

  if (!active) {
    return null;
  }

  const openPopup = (type, id) => {
    const subscription = [...activeSubscriptions, ...canceledSubscriptions].find(({ id: itemId }) => itemId === id);
    if (subscription) {
      setPopupData({ type, subscription });
    } else {
      setPopupData(null);
    }
  };

  const closePopup = (reload = false) => {
    setPopupData(null);
    if (reload) {
      reloadSubscriptions();
    }
  };

  return (
    <ContentLoading show={isLoading}>
      <div className="pb-3">
        <ActiveSubscriptions items={activeSubscriptions} openPopup={openPopup} companyId={companyId} />
      </div>
      <div className="pb-3">
        <CanceledSubscriptions items={canceledSubscriptions} openPopup={openPopup} companyId={companyId} />
      </div>
      {popupData ? <Popup close={closePopup} subscription={popupData.subscription} type={popupData.type} /> : null}
    </ContentLoading>
  );
}
Subscriptions.propTypes = {
  active: PropTypes.bool,
  employeeId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
Subscriptions.defaultProps = {
  active: false,
};
