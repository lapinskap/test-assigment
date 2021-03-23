import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader as LoaderAnim } from 'react-loaders';
import Form from '../../../../../../Components/Form';
import ContentLoading from '../../../../../../Components/Loading/contentLoading';
import Popup from '../../../../../../Components/Popup/popup';

export default function FinancingPopup({
  close, isOpen, data, employeeId,
}) {
  const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;
  const onChange = useCallback((key, value) => {
    const updatedData = { ...data };
    updatedData[key] = value;
  }, [data]);

  return (
    <Popup id="financingEditPopup" isOpen={isOpen} toggle={() => close()} unmountOnClose size="lg">
      <ContentLoading
        message={spinner}
        show={false}
      >
        <Form
          id="financingEditForm"
          data={data}
          config={{
            defaultOnChange: onChange,
            stickyTitle: true,
            isInPopup: true,
            togglePopup: close,
            title: 'Dofinansowanie kolonii',
            groupsAsColumns: true,
            onSubmit: () => {
              setTimeout(() => {
                close();
              }, 500);
            },
            buttons: [
              {
                size: 'lg',
                color: 'light',
                onClick: () => {
                  close();
                },
                className: 'mr-2',
                text: 'Wróć',
              },
              {
                size: 'lg',
                color: 'primary',
                className: 'mr-2',
                text: 'Przydziel',
                type: 'submit',
              },
            ],
            formGroups: [
              {
                formElements: [
                  {
                    component: <p>Pracownik:</p>,
                  },
                  {
                    component: <p>Komentarz:</p>,
                  },
                  {
                    component: <p>Kwota dofinansowania:</p>,
                  },
                  {
                    component: <p>Źródło:</p>,
                  },
                ],
              },
              {
                formElements: [
                  {
                    component:
  <p>
    Katarzyna Jóźwiak
    {employeeId}
  </p>,
                  },
                  {
                    component: <p>{data.comment ? data.comment : 10}</p>,
                  },
                  {
                    component: <p>{data.amount ? data.amount : 10}</p>,
                  },
                  {
                    component: <p>old-Ogólny ZFŚS</p>,
                  },
                ],
              },
            ],
          }}
        />
      </ContentLoading>
    </Popup>
  );
}

FinancingPopup.propTypes = {
  close: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    comment: PropTypes.string,
    amount: PropTypes.string,
  })).isRequired,
  isOpen: PropTypes.bool.isRequired,
};
