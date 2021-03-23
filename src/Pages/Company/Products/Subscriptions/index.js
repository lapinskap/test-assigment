import React, { useState, useCallback, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import { match as matchPropTypes } from 'react-router-prop-types';
import { Input, Button } from 'reactstrap';
import BenefitGroup from './benefitGroup';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import { getCompanyBaseBreadcrumbs } from '../../routerHelper';
import EditBenefitGroupPopup from './EditBenefitGroup/popup';
import CopySubscriptionsPopup from './CopySubscriptions/popup';
import { TYPE_LISTING } from '../../../../utils/browsingHistory';
import useEmployeeGroups from '../../../../utils/hooks/company/useEmployeeGroups';
import { useCompanyName } from '../../CompanyContext';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import { DEFAULT_SETTING_GROUP } from './utils/consts';
import { IRI_PREFIX as BENEFIT_GROUP_IRI_PREFIX } from '../../../../utils/hooks/benefit/useBenefitGroups';
import { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../utils/hooks/benefit/useBenefits';
import { dynamicNotification } from '../../../../utils/Notifications';
import __ from '../../../../utils/Translations';
import arrayMove from '../../../../utils/jsHelpers/arrayMove';
import mockGroupsData from './utils/mockGroupsData';
import mockBenefitsData from './utils/mockBenefitsData';
import BenefitsContext from './utils/benefitsContext';
import useSuppliers from '../../../../utils/hooks/suppliers/useSuppliers';
import ChangeBenefitGroupPopup from './ChangeBenefitGroup/popup';
import AttachmentsList from './Attachments';
import SecurityWrapper from '../../../../utils/RoleBasedSecurity/SecurityComponents/SecuirityWrapper';
import {
  subscriptionBenefitEmployeeGroupPermissionRead,
  subscriptionBenefitGroupPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import { getIdFromIri, getIriFromId } from '../../../../utils/jsHelpers/iriConverter';

export default function Subscriptions({ match }) {
  const [groups, setGroups] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [benefitsAttachments, setBenefitsAttachments] = useState({});
  const [loading, setLoading] = useState(false);
  const [benefitToAttachmentsPopup, setBenefitToAttachmentsPopup] = useState(null);
  const { companyId, employeeGroupId = DEFAULT_SETTING_GROUP } = match.params;
  const companyName = useCompanyName();
  const history = useHistory();
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);
  const [benefitGroupEdit, setBenefitGroupEdit] = useState(null);
  const [benefitIdToChangeGroup, setBenefitIdToChangeGroup] = useState(null);
  const [openCopySubscriptionsPopup, setOpenCopySubscriptionsPopup] = useState(false);
  const closeCopyForm = useCallback(() => {
    setOpenCopySubscriptionsPopup(false);
  }, [setOpenCopySubscriptionsPopup]);
  const closeSubscriptionGroupPopup = (reload = false) => {
    setBenefitGroupEdit(null);
    if (reload) {
      refreshGroups();
    }
  };

  const closeBenefitAttachmentsPopup = (refreshBenefitData = false) => {
    setBenefitToAttachmentsPopup(null);
    if (refreshBenefitData) {
      refreshBenefits();
    }
  };
  const openBenefitAttachmentsPopup = (benefitId) => {
    const benefit = benefits.find(({ id }) => benefitId === id);
    setBenefitToAttachmentsPopup(benefit || null);
  };

  const closeChangeGroupPopup = async (newGroupId = null) => {
    if (newGroupId) {
      try {
        const editedBenefit = benefits.find(({ id }) => benefitIdToChangeGroup === id) || {};
        if (editedBenefit) {
          const newGroupIdIri = `${BENEFIT_GROUP_IRI_PREFIX}/${newGroupId}`;
          const benefitsInGroups = benefits.filter(({ benefitGroup }) => benefitGroup === newGroupIdIri);
          editedBenefit.benefitGroup = newGroupIdIri;
          editedBenefit.position = benefitsInGroups.length + 1;
          const benefitIndex = benefits.indexOf(editedBenefit);
          const updatedBenefits = [...benefits];
          updatedBenefits[benefitIndex] = { ...editedBenefit };
          setBenefits(updatedBenefits);
          await restApiRequest(
            SUBSCRIPTION_MANAGEMENT_SERVICE,
            `/benefits/${benefitIdToChangeGroup}`,
            'PATCH',
            {
              body: {
                benefitGroup: newGroupIdIri,
              },
            },
          );
          dynamicNotification(__('Pomyślnie zmieniono grupę.'));
        }
      } catch (e) {
        console.error(e);
        dynamicNotification(e.mesage || __('Nie udało się zmienić grupy abonamentu.'), 'error');
        refreshGroups();
        refreshBenefits();
      }
    }
    setBenefitIdToChangeGroup(null);
  };

  const refreshGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/benefit-groups',
        'GET',
        {
          params: {
            companyId,
            itemsPerPage: 10000,
          },
        },
        mockGroupsData,
      );
      setGroups(res.sort((a, b) => a.position - b.position));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się pobrać grup abonamentów.'), 'error');
    }
    setLoading(false);
  }, [companyId]);

  const refreshBenefits = useCallback(async () => {
    try {
      const res = await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/benefits',
        'GET',
        {
          params: {
            companyId,
            itemsPerPage: 10000,
          },
        },
        mockBenefitsData,
      );
      setBenefits(res);
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się pobrać abonamentów.'), 'error');
    }
  }, [companyId]);

  const refreshAttachments = useCallback(async () => {
    try {
      const benefitIris = benefits.filter(({ attachments }) => attachments.length).map(({ id }) => getIriFromId(id, BENEFIT_IRI_PREFIX));
      if (benefitIris.length > 0) {
        const res = await restApiRequest(
          SUBSCRIPTION_MANAGEMENT_SERVICE,
          '/attachments',
          'GET',
          {
            params: {
              benefit: benefitIris,
              itemsPerPage: 10000,
            },
          },
          [],
        );
        const attachmentsMap = {};
        res.forEach((item) => {
          const benefitId = getIdFromIri(item.benefit, BENEFIT_IRI_PREFIX);
          if (benefitId) {
            if (!Array.isArray(attachmentsMap[benefitId])) {
              attachmentsMap[benefitId] = [];
            }
            attachmentsMap[benefitId].push(item);
          }
        });
        setBenefitsAttachments(attachmentsMap);
      }
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się pobrać załączników.'), 'error');
    }
  }, [benefits]);

  useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

  useEffect(() => {
    refreshBenefits();
  }, [refreshBenefits]);

  useEffect(() => {
    refreshAttachments();
  }, [refreshAttachments]);

  const isDefaultGroup = employeeGroupId === DEFAULT_SETTING_GROUP;

  const deleteGroup = async (id) => {
    try {
      setGroups(groups.filter(({ id: groupId }) => groupId !== id));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/benefit-groups/${id}`,
        'DELETE',
        {
          returnNull: true,
        },
      );
      dynamicNotification(__('Pomyślnie usunięto grupę abonamentów'));
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się usunąć grupy'), 'error');
      refreshGroups();
    }
  };

  const moveGroup = async (group, up) => {
    try {
      const currentIndex = groups.indexOf(group);
      const newIndex = currentIndex + (up ? -1 : 1);
      arrayMove(groups, currentIndex, newIndex);
      setGroups(groups.map((el, index) => ({ ...el, position: index + 1 })));
      await restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        `/benefit-groups/${group.id}`,
        'PATCH',
        {
          body: {
            move: up ? '-' : '+',
          },
        },
      );
    } catch (e) {
      console.error(e);
      dynamicNotification(e.mesage || __('Nie udało się przesunąć grupy'), 'error');
      refreshGroups();
    }
  };

  const changeBenefitGroup = (benefitId) => setBenefitIdToChangeGroup(benefitId);

  const suppliers = useSuppliers(true, false, true);
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
          heading={`Abonamenty dla firmy ${companyName} (ID: ${companyId})`}
          breadcrumbsHeading="Abonamenty"
          pushToHistory
          historyElementType={TYPE_LISTING}
          breadcrumbs={[
            ...getCompanyBaseBreadcrumbs(companyId, companyName),
            {
              title: 'Świadczenia cykliczne',
              link: `/company/edit/${companyId}/subscriptions/`,
            },
          ]}
        />
        {isDefaultGroup ? (
          <Button
            color="primary"
            onClick={() => setOpenCopySubscriptionsPopup(true)}
            className="row btn-actions-pane-right text-right d-block mr-3"
          >
            Kopiuj abonamenty z innej firmy
          </Button>
        ) : null}
        <SecurityWrapper disable permission={subscriptionBenefitEmployeeGroupPermissionRead}>
          <div className="col-sm-12 row m-3">
            <h5 className="col-sm-5">Ustawienia dla grup pracowniczych</h5>
            <Input
              type="select"
              value={employeeGroupId}
              onChange={(e) => history.push(
                `/company/edit/${companyId}/subscriptions/benefits/${e.target.value}`,
              )}
              name="select"
              className="col-sm-7"
              data-t1="employeeGroupSelect"
            >
              {[{
                label: 'Domyślne',
                value: DEFAULT_SETTING_GROUP,
              }].concat(employeeGroups)
                .map(({ label, value }) => (<option key={value} value={value}>{label}</option>))}
            </Input>
          </div>
        </SecurityWrapper>

        <ContentLoading show={loading}>
          <BenefitsContext.Provider value={{
            benefits,
            refreshBenefits,
            changeBenefitGroup,
            openBenefitAttachmentsPopup,
            benefitsAttachments,
            employeeGroups,
            suppliers,
          }}
          >
            <span>
              {groups.map((group, index) => (
                <BenefitGroup
                  employeeGroupId={employeeGroupId}
                  companyId={companyId}
                  openEditPopup={setBenefitGroupEdit}
                  deleteGroup={deleteGroup}
                  group={group}
                  key={group.id}
                  moveUp={index > 0 ? () => moveGroup(group, true) : null}
                  moveDown={index + 1 < groups.length ? () => moveGroup(group, false) : null}
                />
              ))}
              {isDefaultGroup ? (
                <SecurityWrapper permission={subscriptionBenefitGroupPermissionWrite} disable>
                  <div
                    role="presentation"
                    className="col-sm-12 m-3 row text-primary"
                    onClick={() => setBenefitGroupEdit('-1')}
                  >
                    <div className="col-sm-11 d-block w-100 text-center row cursor-pointer">
                      <i className="pe-7s-plus pe-4x pe-va" />
                      <h6 className="text-center d-block">dodaj grupę abonamentów</h6>
                    </div>
                  </div>
                </SecurityWrapper>
              ) : null}
            </span>
            {benefitGroupEdit !== null ? (
              <EditBenefitGroupPopup
                close={closeSubscriptionGroupPopup}
                subscriptionGroupId={benefitGroupEdit}
                companyId={companyId}
              />
            ) : null}
            {benefitToAttachmentsPopup !== null ? (
              <AttachmentsList
                close={closeBenefitAttachmentsPopup}
                benefit={benefitToAttachmentsPopup}
                benefitAttachments={benefitsAttachments[benefitToAttachmentsPopup.id]}
                employeeGroupId={isDefaultGroup ? null : employeeGroupId}
              />
            ) : null}
            {benefitIdToChangeGroup !== null ? (
              <ChangeBenefitGroupPopup
                close={closeChangeGroupPopup}
                benefit={benefits.find(({ id }) => benefitIdToChangeGroup === id) || {}}
                groups={groups}
              />
            ) : null}
            {openCopySubscriptionsPopup ? (
              <CopySubscriptionsPopup
                close={closeCopyForm}
                isOpen={openCopySubscriptionsPopup}
                onSave={() => {
                }}
              />
            ) : null}
          </BenefitsContext.Provider>
        </ContentLoading>
      </CSSTransitionGroup>
    </>
  );
}

Subscriptions.propTypes = {
  match: matchPropTypes.isRequired,
};
