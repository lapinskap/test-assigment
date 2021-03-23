import React, { useState, useCallback } from 'react';
import {
  Alert, Button, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import DataTableControlled from '../../../../Components/DataTableControlled';
import __ from '../../../../utils/Translations';
import Popup from '../../../../Components/Popup/popup';

export default function HistoryPreview({ close, isOpen, isBeingRestored }) {
  const [data, setData] = useState(mockData);
  const [count, setCount] = useState(0);
  const fetchData = useCallback(async () => {
    setData(mockData);
    setCount(mockData.length);
  }, []);

  const columns = () => [
    {
      Header: isBeingRestored ? 'Aktualne wartości' : 'Przed zmianami',
      accessor: 'before',
    },
    {
      Header: isBeingRestored ? 'Po przywróceniu' : 'Po zmianach',
      accessor: 'after',
    },
  ];

  return (
    <Popup id="attributesHistoryPreviewPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
      <ModalHeader toggle={() => close()} />
      { isBeingRestored ? (
        <Alert color="danger">
          { __('Uwaga! Zamierzasz zmienić wiele wartości. Zapoznaj się z poniższą listą zmian, które zostaną wprowadzone.'
          + 'Aby potwierdznić operację przywrócenia, kliknij w przycisk Przywróć.') }
          <Button color="danger" className="d-block btn-actions-pane-right">{ __('Przywróć') }</Button>
        </Alert>
      ) : null }
      <DataTableControlled
        id="tourismAttributesHistoryPreviewListing"
        columns={columns}
        data={data}
        count={count}
        fetchData={fetchData}
        filterable
      />
    </Popup>
  );
}

export const mockData = [
  {
    objectId: '1',
    before: 'Tekst tekstowy',
    after: 'Nowy tekst',
  },
  {
    objectId: '2',
    before: 'Tekst tekstowy',
    after: 'Nowy tekst',
  },
  {
    objectId: '3',
    before: 'Anonim',
    after: 'Nowy tekst',
  },
  {
    objectId: '4',
    before: 'Zbigniew Wodecki',
    after: 'Nowy tekst',
  },
  {
    objectId: '5',
    before: 'Tekst tekstowy',
    after: 'Opis',
  },
  {
    objectId: '6',
    before: 'Tekst tekstowy',
    after: 'Opis',
  },
  {
    objectId: '7',
    before: 'Anna Nowak',
    after: 'Opis',
  },
  {
    objectId: '8',
    before: 'Tekst tekstowy',
    after: 'Opis',
  },
  {
    objectId: '9',
    before: 'Tekst tekstowy',
    after: 'Opis',
  },
  {
    objectId: '10',
    before: 'Anna Nowak',
    after: 'Opis',
  },
];

HistoryPreview.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  isBeingRestored: PropTypes.bool.isRequired,
};
