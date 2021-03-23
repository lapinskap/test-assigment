import React, {
  useContext, useEffect, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DataTable from '../../../../Components/DataTable';
import StatusDot from './utils/statusDot';
import __ from '../../../../utils/Translations';
import { getUserConfirmationPopup } from '../../../../Components/UserConfirmationPopup';
import { benefitMethodOptions, DEFAULT_SETTING_GROUP } from './utils/consts';
import {
  companyAttachmentPermissionRead,
  subscriptionBenefitGroupPermissionWrite,
  subscriptionBenefitPermissionWrite,
} from '../../../../utils/RoleBasedSecurity/permissions';
import RbsButton from '../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { mapValueFromOptions } from '../../../../Components/DataTable/commonCells';
import BenefitsContext from './utils/benefitsContext';
import { getIriFromId } from '../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX as BENEFIT_IRI_PREFIX } from '../../../../utils/hooks/benefit/useBenefits';
import { restApiRequest, SUBSCRIPTION_MANAGEMENT_SERVICE } from '../../../../utils/Api';
import { dynamicNotification } from '../../../../utils/Notifications';
import ContentLoading from '../../../../Components/Loading/contentLoading';
import mockBenefitsEmployeeGroupData from './utils/mockBenefitsEmployeeGroupData';

export default function BenefitsList({
  companyId, employeeGroupId, groupId, groupBenefits, moveBenefit, deleteBenefit,
}) {
  const [fetchingBenefitsEmployeeGroups, setFetchingBenefitsEmployeeGroups] = useState(false);
  const [benefitTableData, setBenefitTableData] = useState([]);
  const [benefitsEmployeeGroups, setBenefitsEmployeeGroups] = useState([]);

  const {
    suppliers, changeBenefitGroup, employeeGroups, openBenefitAttachmentsPopup, benefitsAttachments,
  } = useContext(BenefitsContext);

  const history = useHistory();
  const isDefaultScope = employeeGroupId === DEFAULT_SETTING_GROUP;

  useEffect(() => {
    const benefitsIri = groupBenefits.map(({ id }) => getIriFromId(id, BENEFIT_IRI_PREFIX));
    if (groupBenefits.length) {
      setFetchingBenefitsEmployeeGroups(true);
      restApiRequest(
        SUBSCRIPTION_MANAGEMENT_SERVICE,
        '/benefit-employee-groups',
        'GET',
        {
          params: {
            benefit: benefitsIri,
            itemsPerPage: 10000,
          },
        },
        [...mockBenefitsEmployeeGroupData],
      ).then((res) => setBenefitsEmployeeGroups(res))
        .catch((e) => {
          console.error(e);
          dynamicNotification(e.message || __('Nie udało się pobrać konfiguracji benefitów dla grup pracowniczych.'), 'error');
          setBenefitsEmployeeGroups([]);
        })
        .finally(() => setFetchingBenefitsEmployeeGroups(false));
    }
  }, [groupBenefits]);

  useEffect(() => {
    let newTableData;
    if (isDefaultScope) {
      newTableData = groupBenefits.map((benefit) => {
        const benefitEmployeeGroups = benefitsEmployeeGroups.filter(({ benefit: employeeGroupBenefit }) => employeeGroupBenefit?.id === benefit.id);
        const benefitEmployeesGroupConfig = benefitEmployeeGroups.map((group) => {
          const employeeGroup = employeeGroups.find(({ value: id }) => group.employeeGroupId === id);
          const employeeGroupName = employeeGroup?.label || group.employeeGroupId;
          return { ...group, groupName: employeeGroupName };
        });
        return {
          ...benefit,
          benefitEmployeesGroups: benefitEmployeesGroupConfig,
          attachmentsCount: benefitsAttachments?.[benefit.id]?.length || 0,
        };
      });
    } else {
      newTableData = benefitsEmployeeGroups
        .filter(({ employeeGroupId: id }) => id === employeeGroupId)
        .map((group) => {
          const { benefit } = group;
          if (!benefit) {
            return null;
          }
          const employeeGroup = employeeGroups.find(({ value: id }) => group.employeeGroupId === id);
          const employeeGroupName = employeeGroup?.label || group.employeeGroupId;
          const benefitName = group.useDefaultName ? benefit.name : group.name;
          return {
            ...benefit,
            name: benefitName,
            method: group.method,
            benefitEmployeesGroupsId: group.id,
            benefitEmployeesGroups: [{ ...group, groupName: employeeGroupName }],
            attachmentsCount: benefitsAttachments?.[benefit.id]
                ?.filter((attachment) => attachment.employeeGroup === group.employeeGroupId).length || 0,
          };
        }).filter(Boolean);
    }
    setBenefitTableData(newTableData);
  }, [benefitsEmployeeGroups, groupBenefits, employeeGroups, isDefaultScope, employeeGroupId, benefitsAttachments]);
  const columns = [
    {
      Header: 'Nazwa abonamentu',
      accessor: 'name',
      Cell: (rowData) => {
        const subscriptionName = rowData.row._original.name;
        return (
          <div className="d-block w-100 text-center">
            {subscriptionName}
          </div>
        );
      },
    },
    {
      Header: 'Dostawca',
      accessor: 'supplierId',
      Cell: mapValueFromOptions(suppliers, 'supplierId'),
    },
    {
      Header: 'Grupa pracownicza',
      accessor: 'benefitEmployeesGroups',
      Cell: (rowData) => {
        const { benefitEmployeesGroups } = rowData.row._original;
        return (
          <div className="text-center">
            {benefitEmployeesGroups?.map((item) => renderEmployeeGroupStatus(item))}
          </div>
        );
      },
    },
    !isDefaultScope ? {
      Header: 'Kto opłaca',
      accessor: 'method',
      Cell: mapValueFromOptions(benefitMethodOptions, 'method'),
      maxWidth: 200,
    } : null,
    {
      Header: 'Akcja',
      filterable: false,
      sortable: false,
      Cell: (rowData) => (
        <div className="d-block w-100 text-center row">
          <RbsButton
            data-t1="attachments"
            role="button"
            color="link"
            permission={companyAttachmentPermissionRead}
            onClick={() => openBenefitAttachmentsPopup(rowData.row._original.id)}
          >
            {__('Załączniki')}
            {' '}
            (
            {rowData.row._original.attachmentsCount}
            )
          </RbsButton>
          <RbsButton
            data-t1="edit"
            role="button"
            color="link"
            onClick={
              () => history.push(
                isDefaultScope ? `/company/edit/${companyId}/subscriptions/benefits/edit/${rowData.row._original.id}`
                  : `/company/edit/${companyId}/subscriptions/benefits/editEmployeeGroup/${rowData.row._original.benefitEmployeesGroupsId}`,
              )
            }
          >
            {__('Edytuj')}
          </RbsButton>
          {isDefaultScope ? (
            <span>
              <RbsButton
                data-t1="changeGroup"
                role="button"
                color="link"
                onClick={() => changeBenefitGroup(rowData.row._original.id)}
                permission={subscriptionBenefitPermissionWrite}
              >
                {__('Zmień grupę')}
              </RbsButton>
              <RbsButton
                data-t1="delete"
                role="button"
                color="link"
                permission={subscriptionBenefitPermissionWrite}
                onClick={(e) => {
                  e.stopPropagation();
                  getUserConfirmationPopup(
                    __('Czy na pewno chcesz usunąć to świadczenie?'),
                    (confirm) => confirm && deleteBenefit(rowData.row._original.id),
                    __('Usuwanie świadczenia abonamentowego'),
                  );
                }}
              >
                {__('Usuń')}
              </RbsButton>
              <RbsButton
                data-t1="moveUp"
                disabled={rowData.index <= 0}
                permission={subscriptionBenefitPermissionWrite}
                role="button"
                color="link"
                onClick={() => moveBenefit(rowData.row._original.id, true)}
              >
                {__('Przesuń wyżej')}
              </RbsButton>
              <RbsButton
                data-t1="moveDown"
                disabled={rowData.index + 1 >= groupBenefits.length}
                permission={subscriptionBenefitPermissionWrite}
                role="button"
                color="link"
                onClick={() => moveBenefit(rowData.row._original.id, false)}
              >
                {__('Przesuń niżej')}
              </RbsButton>
            </span>
          ) : null}
        </div>
      ),
    },
  ];
  return (
    <>
      {isDefaultScope ? (
        <div className="listing-btn-container m-2 text-right">
          <RbsButton
            color="link"
            permission={subscriptionBenefitGroupPermissionWrite}
            href={`#/company/edit/${companyId}/subscriptions/benefits/new/${groupId}`}
          >
            <i className="pe-7s-plus pe-2x pe-va mr-1 float-left" />
            <div>{__('dodaj abonament')}</div>
          </RbsButton>
        </div>
      ) : null}
      <ContentLoading show={!isDefaultScope && fetchingBenefitsEmployeeGroups}>
        <DataTable
          id="subscriptionListing"
          key={`benefits-table-${benefitTableData.length}`}
          showPagination={false}
          columns={columns.filter(Boolean)}
          data={benefitTableData}
          noCards
          filterable={false}
          sortable={false}
        />
      </ContentLoading>
    </>
  );
}

const renderEmployeeGroupStatus = (config) => (
  <div className="row" key={config.employeeGroupId}>
    <div className="col-sm-9">{config.groupName}</div>
    <div className="col-sm-3">
      {!config.active ? <StatusDot background="red" />
        : <StatusDot />}
    </div>
  </div>
);

BenefitsList.propTypes = {
  companyId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupBenefits: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  employeeGroupId: PropTypes.string.isRequired,
  deleteBenefit: PropTypes.func.isRequired,
  moveBenefit: PropTypes.func.isRequired,
};
