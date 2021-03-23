import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, CardHeader,
} from 'reactstrap';
import AddAttribute from '../addAttribute';
import AttributeOptions from './attributeOptions';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import __ from '../../../../utils/Translations';
import FormTitle from '../../../../Components/Form/FormTitle';
import { dynamicNotification } from '../../../../utils/Notifications';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { tourismTourismAttributePermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function ManagingAttributes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddAttributePopup, setShowAddAttributePopup] = useState(false);
  const closeForm = (refresh) => {
    if (refresh) {
      refreshData();
    }
    setShowAddAttributePopup(false);
  };

  useEffect(() => {
    fetchData(setData, setLoading);
  }, [setLoading, setData]);

  const refreshData = () => {
    fetchData(setData, setLoading);
  };

  const deleteAttribute = async (id) => {
    try {
      setData(data.filter((el) => el.id !== id));
      await restApiRequest(
        TOURISM_SERVICE,
        `/tourism-attributes/${id}`,
        'DELETE',
        { returnNull: true },
        {},
      );
      dynamicNotification(__('Pomyślnie usunięto atrybut'));
    } catch (e) {
      refreshData();
      console.error(e);
      dynamicNotification(e.message || __('Nie udało się usunąć atrybutu'), 'error');
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <ContentLoading
            show={loading}
          >
            <FormTitle title={__('ZARZĄDZANIE ATRYBUTAMI FILTROWANIA DLA TURYSTYKI')} stickyTitle />
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
            {data.map((item) => (
              <AttributeOptions
                key={`attribute_${item.id}_${item.options ? item.options.length : 0}`}
                item={item}
                deleteAttribute={deleteAttribute}
                refreshData={refreshData}
              />
            ))}
          </ContentLoading>
        </CardBody>
      </Card>
      {showAddAttributePopup
        ? <AddAttribute close={closeForm} modalTitle="atrybut" isOpen={showAddAttributePopup} attributeId={-1} /> : null}
    </>
  );
}

export const fetchData = async (setData, setLoading) => {
  try {
    setLoading(true);
    const response = await getAttributes();
    setData(response);
  } catch (e) {
    console.error(e);
    dynamicNotification(__('Nie udało się pobrać listy atrybutów'), 'error');
  }
  setLoading(false);
};

export const getAttributes = () => restApiRequest(
  TOURISM_SERVICE,
  '/tourism-attributes',
  'GET',
  {
    itemsPerPage: 10000,
  },
  mockData,
);

const mockData = [
  {
    id: 1,
    code: 'facilities',
    name: 'Udogodnienia',
    options: [
      {
        id: 8,
        code: 'wlan',
        label: 'Wlan',
      },
      {
        id: 7,
        code: 'spa_fitness',
        label: 'Spa Fitness',
      },
      {
        id: 6,
        code: 'pets_welcome',
        label: 'Pets Welcome',
      },
      {
        id: 5,
        code: 'parking',
        label: 'Parking',
      },
      {
        id: 4,
        code: 'outdoor_pool',
        label: 'Outdoor Pool',
      },
      {
        id: 3,
        code: 'indoor_pool',
        label: 'Indoor Pool',
      },
      {
        id: 2,
        code: 'airport_shuttle',
        label: 'Airport Shuttle',
      },
      {
        id: 1,
        code: 'air_conditioning',
        label: 'Air Conditioning',
      },
    ],
  },
];
