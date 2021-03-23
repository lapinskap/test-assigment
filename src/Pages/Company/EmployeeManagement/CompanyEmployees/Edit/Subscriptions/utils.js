import React from 'react';
import { Link } from 'react-router-dom';
import { getIdFromIri } from '../../../../../../utils/jsHelpers/iriConverter';
import { IRI_PREFIX } from '../../../../../../utils/hooks/benefit/useBenefits';

export const POPUP_TYPE_RESIGN = 'resign';
export const POPUP_TYPE_CANCEL = 'cancel';
export const POPUP_TYPE_CHANGE = 'change';
export const POPUP_TYPE_SUSPEND = 'suspend';
export const POPUP_TYPE_BLOCK = 'block';

export const STATUS_CANCELED = 'canceled';
export const STATUS_PENDING = 'pending';
export const STATUS_ACTIVE = 'active';
export const STATUS_DENIED = 'denied';
export const STATUS_RESIGNED = 'resigned';
export const STATUS_SUSPENDED = 'suspended';

export const statusesOptions = [
  { value: STATUS_ACTIVE, label: 'Aktywny' },
  { value: STATUS_CANCELED, label: 'Anulacja' },
  { value: STATUS_RESIGNED, label: 'Rezygnacja' },
  { value: STATUS_SUSPENDED, label: 'Zawieszony' },
  { value: STATUS_PENDING, label: 'Oczekujący' },
];

export const benefitIdColumn = (cellInfo) => {
  const iri = cellInfo.row[cellInfo.column.id];
  if (!iri) {
    return null;
  }
  const { company } = cellInfo.columnProps.rest;
  const id = getIdFromIri(iri, IRI_PREFIX);

  return (
    <div className="d-block w-100 text-center">
      <Link to={`/company/edit/${company}/subscriptions/benefits/edit/${id}`}>{id}</Link>
    </div>
  );
};
