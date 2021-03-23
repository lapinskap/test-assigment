import React, { useCallback, useState } from 'react';
import { Button, CustomInput } from 'reactstrap';
import __ from '../../../../../../utils/Translations';
import { dynamicNotification } from '../../../../../../utils/Notifications';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../../../utils/Api';
import ContentLoading from '../../../../../../Components/Loading/contentLoading';

const FormsColumn = (cellInfo) => {
  const [showForms, setShowForms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedForms, setSelectedForms] = useState([]);
  const value = cellInfo.row[cellInfo.column.id];
  const noForms = !value?.length;
  const subscriptionId = cellInfo.row._original.id;
  const {
    updateItem,
  } = cellInfo.columnProps.rest;
  const acceptForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/employee-subscription-items/${subscriptionId}/accept-pdf-form`,
        'POST',
        {
          body: {
            formsIds: selectedForms,
          },
        },
        {},
      );
      updateItem(response);
      dynamicNotification(__(selectedForms.length === 1 ? 'Pomyślnie zaakceptowano formularz' : 'Pomyślnie zaakceptowano formularze'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zaakceptować formularzy'));
    }
    setSelectedForms([]);
    setIsLoading(false);
  }, [updateItem, subscriptionId, selectedForms]);

  if (noForms) {
    return (
      <div className="d-block w-100 text-center">
        {__('Brak formularzy')}
      </div>
    );
  }

  return (
    <div className="d-block w-100 text-center">
      {showForms
        ? (
          <ContentLoading show={isLoading}>
            <div>
              <div className="p-1">
                <Button color="link" size="sm" onClick={() => setShowForms(false)}>{__('Ukryj formularze')}</Button>
              </div>
              <span className="p-1">
                <Button
                  color="link"
                  size="sm"
                  onClick={() => setSelectedForms(value.filter(({ accepted }) => !accepted).map(({ id }) => id))}
                >
                  {__('Zaznacz wszystkie')}
                </Button>
              </span>
              <span className="p-1"><Button color="link" size="sm" onClick={() => setSelectedForms([])}>{__('Odznacz wszystkie')}</Button></span>
            </div>
            {value.map(({ id, accepted }) => (
              <div key="id">
                <CustomInput
                  id={`form_${subscriptionId}_${id}`}
                  inline
                  type="checkbox"
                  disabled={accepted}
                  onChange={(e) => {
                    const { checked } = e.target;
                    if (checked) {
                      if (!selectedForms.includes(id)) {
                        setSelectedForms([...selectedForms, id]);
                      }
                    } else {
                      setSelectedForms(selectedForms.filter((el) => el !== id));
                    }
                  }}
                  checked={accepted || selectedForms.includes(id)}
                />
                {id}
              </div>
            ))}
            <div>
              <span className="p-1">
                <Button color="primary" size="sm" onClick={acceptForms}>{__('Akceptuj zaznaczone')}</Button>
              </span>
            </div>
          </ContentLoading>
        ) : <Button color="link" onClick={() => setShowForms(true)}>{__('Pokaż formularze')}</Button>}
    </div>
  );
};

export default FormsColumn;
