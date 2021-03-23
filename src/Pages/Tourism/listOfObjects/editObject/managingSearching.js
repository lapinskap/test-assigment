import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, CardHeader, Form, Input,
} from 'reactstrap';
import PropTypes from 'prop-types';
import AddAttribute from '../../managingFilteringAttributes/addAttribute';
import AttributeOptions from '../../managingFilteringAttributes/managingAttributes/attributeOptions';
import __ from '../../../../utils/Translations';
import FormTitle from '../../../../Components/Form/FormTitle';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import {
  tourismTourismAttributePermissionWrite,
  tourismTourismObjectPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import { fetchData } from '../../managingFilteringAttributes/managingAttributes';
import DataLoading from '../../../../Components/Loading/dataLoading';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';

export default function ManagingSearching({ objectId }) {
  const [attributes, setAttributes] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddAttributePopup, setShowAddAttributePopup] = useState(false);
  const closeForm = (refresh) => {
    if (refresh) {
      refreshData();
    }
    setShowAddAttributePopup(false);
  };

  useEffect(() => {
    fetchData(setAttributes, setLoading);
  }, [setLoading, setAttributes, objectId]);

  const refreshData = () => {
    fetchData(setAttributes, setLoading);
  };

  const assignedOptions = data?.optionValues || {};

  const selectOption = (attributeCode, optionCode, checked) => {
    const objectAttributes = { ...assignedOptions };
    const attributeOptions = objectAttributes?.[attributeCode] || {};
    objectAttributes[attributeCode] = { ...attributeOptions, [optionCode]: checked ? 1 : 0 };
    setData({
      ...data,
      optionValues: objectAttributes,
    });
  };
  const submit = async () => {
    try {
      setSubmitting(true);
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-objects/${objectId}`,
        'PATCH',
        {
          body: {
            ...data,
          },
        },
        data,
      );
      dynamicNotification(__('Pomyślnie zapisano atrybuty'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się zapisać obiektu'), 'error');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Card>
        <CardBody>
          <DataLoading
            service={TOURISM_SERVICE}
            fetchedData={data !== null}
            updateData={(updatedData) => setData(updatedData)}
            endpoint={`/tourism-objects/${objectId}`}
            mockDataEndpoint="/tourismObjects/edit"
          >
            <Form onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            >
              <FormTitle
                title={__('ZARZĄDZANIE ATRYBUTAMI FILTROWANIA DLA TURYSTYKI')}
                stickyTitle
                buttons={[
                  <RbsButton
                    key="submit"
                    data-t1="submit"
                    size="lg"
                    color="success"
                    disabled={submitting}
                    permission={tourismTourismObjectPermissionWrite}
                    type="submit"
                  >
                    {__('Zapisz')}
                  </RbsButton>,
                ]}
              />
              <div className="mt-2">
                <h6><strong>{__('SŁOWA KLUCZOWE DO SILNIKA WYSZUKIWANIA')}</strong></h6>
                <Input
                  value={data?.searchEngineKeywords || ''}
                  onChange={(e) => setData({ ...data, searchEngineKeywords: e.target.value })}
                  className="mb-1"
                />
              </div>
              <CardHeader>
                OPCJE DOSTĘPNE W OBIEKCIE
                {' '}
                <RbsButton
                  permission={tourismTourismAttributePermissionWrite}
                  color="link"
                  onClick={() => setShowAddAttributePopup(true)}
                  className="d-block btn-actions-pane-right"
                >
                  <i className="pe-7s-plus pe-2x pe-va" />
                  {' '}
                  Dodaj nowy atrybut
                </RbsButton>
              </CardHeader>
              <ContentLoading show={loading}>
                {attributes.map((item) => (
                  <AttributeOptions
                    key={`attribute_${item.id}_${item.options ? item.options.length : 0}`}
                    item={item}
                    objectAssign
                    selectOption={selectOption}
                    assignedOptions={assignedOptions[item.code] || {}}
                    refreshData={refreshData}
                  />
                ))}
              </ContentLoading>
            </Form>
          </DataLoading>
        </CardBody>
      </Card>
      {showAddAttributePopup
        ? (
          <AddAttribute
            close={closeForm}
            modalTitle="atrybut"
            isOpen={showAddAttributePopup}
            attributeId={-1}
          />
        ) : null}
    </>
  );
}

ManagingSearching.propTypes = {
  objectId: PropTypes.string.isRequired,
};
