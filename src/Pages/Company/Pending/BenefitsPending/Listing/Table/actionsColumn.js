import React, { useCallback, useState } from 'react';
import __ from '../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
import ActionColumn from '../../../../../../Components/DataTable/actionColumn';
import { getUserConfirmationPopup } from '../../../../../../Components/UserConfirmationPopup';
import { STATUS_PENDING } from '../../../../EmployeeManagement/CompanyEmployees/Edit/Subscriptions/utils';

const ActionsColumn = (cellInfo) => {
  const [isLoading, setIsLoading] = useState(false);
  const subscriptionId = cellInfo.row._original.id;
  const {
    updateItem,
  } = cellInfo.columnProps.rest;
  const denySubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${subscriptionId}/deny`,
        'POST',
        {},
        {},
      );
      updateItem(response);
      dynamicNotification(__('Pomyślnie odrzucono świadczenie'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się odrzucić świadczenia'));
    }
    setIsLoading(false);
  }, [updateItem, subscriptionId]);
  const isPending = cellInfo.row._original.status === STATUS_PENDING;
  return (
    <div className="d-block w-100 text-center">
      {isPending ? (
        <ActionColumn
          data={cellInfo.row._original}
          buttons={[
            {
              id: 'cancel',
              role: 'button',
              color: 'danger',
              disabled: isLoading,
              size: 'sm',
              className: 'm-1',
              onClick: () => getUserConfirmationPopup(
                __('Uwaga! ta zmiana jest nieodwracalna'),
                (confirm) => confirm && denySubscription(),
                __('Czy na pewno chcesz odrzucić abonament?'),
              ),
              label: 'Anuluj',
            },

          ]}
        />
      ) : null}
    </div>
  );
};

export default ActionsColumn;
