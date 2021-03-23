import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import { match as matchPropTypes } from 'react-router-prop-types';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import SimpleTabs from '../../../../Components/Tabs/SimpleTabs';

import BasicInformation from './basicInformation';
import PhotoGallery from './photoGallery/index';
import Description from './description';
import ManagingSearching from './managingSearching';
import History from './history';
import Preview from './preview';
import { tourismTourismObjectChangelogPermissionRead } from '../../../../utils/RoleBasedSecurity/permissions';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { restApiRequest, TOURISM_SERVICE } from '../../../../utils/Api';
import { tourismObjectsMockData } from '../table';

const getActiveTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : 'subscription';
  return hash.split('/')[0];
};

export default function EditObject({ match }) {
  const history = useHistory();
  const objectId = match.params.id;
  const isNew = objectId === '-1';
  const [originalData, setOriginalData] = useState({});

  const refreshData = async (newName) => {
    if (originalData.name !== newName) {
      setOriginalData({
        ...originalData,
        name: newName,
      });
    }
  };

  useEffect(() => {
    getObjectData(objectId).then((res) => {
      if (res) {
        setOriginalData(res);
      }
    });
  }, [objectId]);

  const activeKey = getActiveTab(history.location.hash);
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
        <PageTitle
          pushToHistory
          heading={`Edycja obiektu ${originalData?.name || ''} (ID: ${objectId})`}
          breadcrumbs={[
            { title: 'Turystyka', link: '/tourism' },
            { title: 'Lista obiektów', link: '/tourism/objects' },
          ]}
        />

        <SimpleTabs
          activeKey={activeKey}
          defaultActiveKey="tourism"
          tabsConfig={[
            {
              name: 'Podstawowe informacje',
              key: 'basic_info',
              component: <BasicInformation isNew={isNew} objectId={objectId} refreshData={refreshData} />,
            },
            {
              name: 'Galeria zdjęć',
              key: 'photo_gallery',
              component: <PhotoGallery objectId={objectId} />,
              disabled: isNew,
            },
            {
              name: 'Opis',
              key: 'description',
              component: <Description objectId={objectId} />,
              disabled: isNew,
            },
            {
              name: 'Zarządzanie atrybutami e-commerce',
              key: 'managing_searching',
              component: <ManagingSearching objectId={objectId} />,
              disabled: isNew,
            },
            {
              name: 'Historia zmian',
              key: 'history',
              aclKey: tourismTourismObjectChangelogPermissionRead,
              component: <History objectId={objectId} />,
              disabled: isNew,
            },
            {
              name: 'Podgląd',
              key: 'preview',
              component: <Preview />,
              disabled: isNew,
            },
          ]}
        />

      </CSSTransitionGroup>
    </>
  );
}

const getObjectData = async (objectId) => {
  try {
    return await restApiRequest(
      TOURISM_SERVICE,
      `/tourism-objects/${objectId}`,
      'GET',
      {},
      tourismObjectsMockData[0],
    );
  } catch (e) {
    console.error(e);
    dynamicNotification(e.message || __('Nie udało się pobrać danych o obiekcie'), 'error');
  }
  return null;
};

EditObject.propTypes = {
  match: matchPropTypes.isRequired,
};
