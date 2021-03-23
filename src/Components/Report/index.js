/* eslint-disable function-call-argument-newline */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Button, Modal, ModalBody, ModalHeader, Card, CardBody,
} from 'reactstrap';
import { Loader as LoaderAnim } from 'react-loaders';
import Form from '../Form';
import FormTitle from '../Form/FormTitle';
import FormElement from '../Form/FormElement';
import DataTable from '../DataTable';
import ContentLoading from '../Loading/contentLoading';
import ButtonsList from '../ButtonsList';
import useCompanies from '../../utils/hooks/company/useCompanies';

export default function Report({
  isCompanyDepended = false,
  companyDataFetch,
  title,
  submitMethod,
  resultConfig,
  formGroups = [],
  groupsAsColumns = true,
}) {
  const [company, setCompany] = useState(0);
  const [formData, setFormData] = useState({});
  const [showData, setShowData] = useState(false);
  const [reportData, setReportData] = useState(null);

  const companyOptions = useCompanies(true);

  const onChange = (key, value) => {
    const updatedData = { ...formData };
    updatedData[key] = value;
    setFormData(updatedData);
  };

  const selectCompany = async (field, value) => {
    await companyDataFetch(field);
    setCompany(value);
  };

  const buttons = [
    {
      size: 'lg',
      color: 'danger',
      className: 'mr-2',
      text: 'Wyczyść',
      onClick: () => {
        setShowData(false);
        setReportData(null);
        setFormData({});
      },

    },
    {
      size: 'lg',
      color: 'primary',
      className: 'mr-2',
      text: 'Generuj',
      onClick: async () => {
        setReportData(null);
        setShowData(true);
        const result = await submitMethod(formData);
        setReportData(result);
      },
    },

  ];

  if (reportData) {
    buttons.push({
      size: 'lg',
      color: 'primary',
      className: 'mr-2',
      text: 'Pokaż',
      onClick: async () => {
        setShowData(true);
      },
    });
  }

  return (
    <>
      <Card>
        <FormTitle title={title} stickyTitle={false} buttons={<ButtonsList buttons={buttons} />} />
        <CardBody>
          {isCompanyDepended ? (
            <FormElement value={company} onChange={selectCompany} type="select" options={companyOptions} label="Firma" />
          ) : null}
          {company || !isCompanyDepended ? (
            <Form
              data={formData}
              config={
                               {
                                 noCards: true,
                                 defaultOnChange: onChange,
                                 groupsAsColumns,
                                 formGroups,
                               }
                           }
            />
          ) : null}
        </CardBody>
      </Card>
      {showData ? (
        <Result
          title={title}
          data={reportData}
          resultConfig={resultConfig}
          isOpen={showData}
          close={() => setShowData(false)}
        />
      ) : null}
    </>
  );
}
const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;

const Result = ({
  isOpen, close, title, resultConfig, data,
}) => (
  <>
    <Modal isOpen={isOpen} toggle={close} unmountOnClose size="lg" className="modal-xxl" style={{ maxHeight: '80vh' }}>
      <ModalHeader toggle={close}>{title}</ModalHeader>
      <ModalBody>
        <div className="text-right">
          <Button className="m-1" color="success" onClick={close}>
            Eksportuj
          </Button>
          <Button className="m-1" color="primary" onClick={close}>
            Drukuj
          </Button>
        </div>
        <ContentLoading
          message={spinner}
          show={!data}
          useBlur={false}
          backgroundStyle={{ zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        >
          <DataTable
            columns={resultConfig}
            data={data || []}
          />
        </ContentLoading>

      </ModalBody>
    </Modal>
  </>
);

export const generateFakeReportData = (config) => new Promise(((resolve) => {
  setTimeout(() => {
    const result = [];
    const resultCount = Math.floor(Math.random() * 40) + 1;
    for (let i = 0; i < resultCount; i += 1) {
      const item = {};
      config.forEach(({ accessor }) => {
        item[accessor] = `Lorem ipsum ${Math.floor(Math.random() * 10)}`;
      });
      result.push(item);
    }
    resolve(result);
  }, 2000);
}));

Report.propTypes = {
  companyDataFetch: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  formGroups: PropTypes.array,
  groupsAsColumns: PropTypes.bool,
  isCompanyDepended: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  resultConfig: PropTypes.array,
  submitMethod: PropTypes.func,
  title: PropTypes.string,
};

Report.defaultProps = {
  companyDataFetch: null,
  formGroups: [],
  groupsAsColumns: true,
  isCompanyDepended: false,
  resultConfig: {},
  submitMethod: null,
  title: '',
};

Result.propTypes = {
  close: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isOpen: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  resultConfig: PropTypes.any,
  title: PropTypes.string,
};

Result.defaultProps = {
  close: null,
  data: [],
  isOpen: false,
  resultConfig: {},
  title: '',
};
