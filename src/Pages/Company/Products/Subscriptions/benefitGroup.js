import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse, CardBody, Card, CardTitle,
} from 'reactstrap';
import BenefitsList from './benefitsList';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import { DEFAULT_SETTING_GROUP } from './utils/consts';
import { IRI_PREFIX as BENEFIT_GROUP_IRI_PREFIX } from '../../../../utils/hooks/benefit/useBenefitGroups';
import BenefitsContext from './utils/benefitsContext';
import arrayMove from '../../../../utils/jsHelpers/arrayMove';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import { getIriFromId } from '../../../../utils/jsHelpers/iriConverter';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { subscriptionBenefitGroupPermissionWrite } from '../../../../utils/RoleBasedSecurity/permissions';

export default function BenefitGroup({
  group, companyId, employeeGroupId, openEditPopup, deleteGroup, moveUp, moveDown,
}) {
  const [groupBenefits, setGroupBenefits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { benefits, refreshBenefits } = useContext(BenefitsContext);

  const { name: groupName, id: groupId } = group;

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    const groupIri = getIriFromId(groupId, BENEFIT_GROUP_IRI_PREFIX);
    setGroupBenefits(benefits.filter(({ benefitGroup }) => benefitGroup === groupIri).sort((a, b) => a.position - b.position));
  }, [benefits, groupId]);

  const moveBenefit = async (benefitId, up) => {
    try {
      const benefit = groupBenefits.find((el) => el.id === benefitId);
      if (!benefit) {
        return;
      }
      const currentIndex = groupBenefits.indexOf(benefit);
      const newIndex = currentIndex + (up ? -1 : 1);
      arrayMove(groupBenefits, currentIndex, newIndex);
      setGroupBenefits(groupBenefits.map((el, index) => ({ ...el, position: index + 1 })));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/benefits/${benefit.id}`,
        'PATCH',
        {
          body: {
            move: up ? '-' : '+',
          },
        },
      );
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się przesunąć abonamentu'), 'error');
      refreshBenefits();
    }
  };

  const deleteBenefit = async (id) => {
    try {
      setGroupBenefits(groupBenefits.filter(({ id: benefitId }) => benefitId !== id));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/benefits/${id}`,
        'DELETE',
        {
          returnNull: true,
        },
      );
      dynamicNotification(__('Pomyślnie usunięto grupę abonamentów'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się usunąć abonamentu'), 'error');
      refreshBenefits();
    }
  };

  const arrow = <i className={`${isOpen ? 'pe-7s-angle-up' : 'pe-7s-angle-down'} pe-3x pe-va mr-3 btn-actions-pane-right`} />;

  return (
    <div>
      <Card className="mt-3">
        <CardBody className="row" onClick={toggle}>
          <CardTitle className="mx-3">{groupName}</CardTitle>
          {employeeGroupId === DEFAULT_SETTING_GROUP ? (
            <div className="btn-actions-pane-right">
              <RbsButton
                data-t1="editGroup"
                color="link"
                className="mx-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditPopup(groupId);
                }}
              >
                Edytuj
              </RbsButton>
              <RbsButton
                data-t1="deleteGroup"
                disabled={groupBenefits.length > 0}
                title={groupBenefits.length > 0 ? __('Nie można usunąć grupy która zawiera abonamenty') : __('Usuń')}
                color="link"
                className="mx-2"
                permission={subscriptionBenefitGroupPermissionWrite}
                onClick={(e) => {
                  e.stopPropagation();
                  getUserConfirmationPopup(
                    'Czy na pewno chcesz usunąć tę grupę?',
                    (confirm) => confirm && deleteGroup(groupId),
                    'Usuwanie grupy abonamentów',
                  );
                }}
              >
                Usuń
              </RbsButton>
              <RbsButton
                data-t1="moveGroupUp"
                color="link"
                disabled={!moveUp}
                onClick={(e) => {
                  e.stopPropagation();
                  if (moveUp) {
                    moveUp();
                  }
                }}
                className="mx-2"
                permission={subscriptionBenefitGroupPermissionWrite}
              >
                Przesuń wyżej
              </RbsButton>
              <RbsButton
                data-t1="moveGroupDown"
                color="link"
                disabled={!moveDown}
                onClick={(e) => {
                  e.stopPropagation();
                  if (moveDown) {
                    moveDown();
                  }
                }}
                className="mx-2"
                permission={subscriptionBenefitGroupPermissionWrite}
              >
                Przesuń niżej
              </RbsButton>
              {arrow}
            </div>
          ) : arrow}
        </CardBody>
      </Card>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            {isInitialized ? (
              <BenefitsList
                companyId={companyId}
                groupId={groupId}
                groupBenefits={groupBenefits}
                employeeGroupId={employeeGroupId}
                moveBenefit={moveBenefit}
                deleteBenefit={deleteBenefit}
              />
            ) : null}
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
}

BenefitGroup.propTypes = {
  companyId: PropTypes.string.isRequired,
  openEditPopup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func,
  employeeGroupId: PropTypes.string.isRequired,
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

BenefitGroup.defaultProps = {
  group: {},
  moveUp: null,
  moveDown: null,
};
