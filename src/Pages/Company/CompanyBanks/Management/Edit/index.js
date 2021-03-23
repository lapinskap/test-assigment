import PropTypes from 'prop-types';
import React from 'react';
import { MdAddCircleOutline, MdBlock, MdReplay } from 'react-icons/md';
import SidebarSimpleTabs from '../../../../../Components/Tabs/SidebarSimpleTabs';
import OneTimeChargeUp from './PointsChanges/OneTimeChargeUp';
import PeriodicChargeUp from './PointsChanges/PeriodicChargeUp';
import ChargeDown from './PointsChanges/ChargeDown';
import OneTimeBlockade from './Blockades/OneTime';
import OneTimeReset from './Resets/OneTime';
import PeriodicReset from './Resets/Periodic';
import ResetInfo from './Resets/ResetInfo';

export const getDataFromHashTab = (hashValue) => {
  const hash = hashValue ? hashValue.replace('#', '') : '';
  if (!hash) {
    return null;
  }
  const elements = hash.split('/');
  return {
    id: elements[2],
    activeKey: elements[1],
  };
};

export default function EditBankForm({ bankId, companyId }) {
  return (
    <SidebarSimpleTabs
      defaultKey="app_variables"
      tabsConfig={[
        {
          header: true,
          name: 'Doładowania',
          icon: MdAddCircleOutline,
        },
        {
          name: 'Doładowanie jednorazowe',
          component: <OneTimeChargeUp id={bankId} companyId={companyId} />,
          key: 'one_time_charge_up',
        },
        {
          name: 'Doładowanie cykliczne',
          component: <PeriodicChargeUp id={bankId} companyId={companyId} />,
          key: 'periodic_charge_up',
        },
        {
          name: 'Rozładowania',
          component: <ChargeDown id={bankId} companyId={companyId} />,
          key: 'charge_down',
        },
        {
          header: true,
          name: 'Blokady',
          icon: MdBlock,
        },
        {
          name: 'Blokady jednorazowe',
          component: <OneTimeBlockade id={bankId} companyId={companyId} />,
          key: 'one_time_blockade',
        },
        // NOT MVP
        // {
        //   name: 'Blokady cykliczne',
        //   component: <PeriodicBlockade id={bankId} />,
        //   key: 'periodic_blockade',
        // },
        {
          header: true,
          name: 'Resetowanie',
          icon: MdReplay,
        },
        {
          name: 'Resetowanie jednorazowe',
          component: <OneTimeReset id={bankId} companyId={companyId} />,
          key: 'one_time_reset',
        },
        {
          name: 'Resetowanie cykliczne',
          component: <PeriodicReset id={bankId} companyId={companyId} />,
          key: 'periodic_reset',
        },
        {
          name: 'Informowanie o resetowaniu',
          component: <ResetInfo id={bankId} companyId={companyId} />,
          key: 'reset_info',
        },
      ]}
    />
  );
}

EditBankForm.propTypes = {
  bankId: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
};
