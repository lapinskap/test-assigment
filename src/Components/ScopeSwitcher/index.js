/* eslint-disable function-call-argument-newline */
import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'reactstrap';
import { AsyncAutocomplete, Autocomplete } from '../FormElements/Autocomplete';
import { getCompaniesOptionsFetchMethod } from '../FormElements/Autocomplete/commonFetchMethods';
import __ from '../../utils/Translations';
import useEmployeeGroups from '../../utils/hooks/company/useEmployeeGroups';

export default function ScopeSwitcher({
  changeScope, scope, skipCompany,
}) {
  const { companyId = '', employeeGroupId = '' } = scope;
  const employeeGroups = useEmployeeGroups(true, 'companyId', companyId, false, !companyId);

  const changeCompany = (option) => {
    const value = option ? option.value : null;
    if (value !== companyId) {
      changeScope(value, value ? employeeGroupId : null);
    }
  };

  const changeEmployeeGroup = (option) => {
    const value = option ? option.value : null;
    if (value !== employeeGroupId) {
      changeScope(companyId, value);
    }
  };
  return (
    <Row>
      {!skipCompany ? (
        <Col>
          <Row>
            <Col sm="auto" className="mt-2">
              {__('Firma')}
              :
            </Col>
            <Col>
              <AsyncAutocomplete
                value={companyId}
                onChange={changeCompany}
                fetchOptions={getCompaniesOptionsFetchMethod(companyId)}
                placeholder={__('Konfiguracja Domyślna')}
              />
            </Col>
          </Row>
        </Col>
      ) : null}
      <Col>
        {companyId ? (
          <Row>
            <Col sm="auto" className="mt-2">
              {__('Grupa pracownicza')}
              :
            </Col>
            <Col>
              <Autocomplete value={employeeGroupId} onChange={changeEmployeeGroup} options={employeeGroups} placeholder="Dowolna grupa" />
            </Col>
          </Row>
        ) : null}
      </Col>
    </Row>
  );
}

ScopeSwitcher.propTypes = {
  changeScope: PropTypes.func.isRequired,
  scope: PropTypes.shape({
    companyId: PropTypes.string,
    employeeGroupId: PropTypes.string,
  }).isRequired,
  skipCompany: PropTypes.bool,
};

ScopeSwitcher.defaultProps = {
  skipCompany: false,
};
