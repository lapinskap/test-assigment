import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Input, Table } from 'reactstrap';
import RbsButton from '../../../../../../../utils/RoleBasedSecurity/SecurityComponents/RbsButton';
import { employeeEmployeePermissionWrite } from '../../../../../../../utils/RoleBasedSecurity/permissions';

export default function ChargeUpsList({ data }) {
  const [inputsValue, setInputsValue] = useState({});
  const updateInputValue = (e) => {
    const updatedData = { ...inputsValue };
    updatedData[e.target.name] = e.target.value;
    setInputsValue(updatedData);
  };

  return (
    <Table className="mb-0">
      <thead>
        <tr>
          <th>Nazwa banku</th>
          <th className="text-center">Aktualne saldo</th>
          <th className="text-center">Kwota doładowania/rozładowania</th>
          <th className="text-center">Doładuj/rozładuj</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, id, points }) => (
          <tr key={id}>
            <td>
              <Input type="select" name="select" id="exampleSelect" aria-selected={name}>
                <option>{name}</option>
              </Input>
            </td>
            <td className="text-center">{points}</td>
            <td>
              <Input
                value={inputsValue[id]}
                name={id}
                type="number"
                placeholder="Wartość operacji"
                onChange={updateInputValue}
              />
            </td>
            <td className="text-center">
              <RbsButton
                permission={employeeEmployeePermissionWrite}
                color="link"
                onClick={() => inputsValue[id]}
              >
                Wykonaj
              </RbsButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

ChargeUpsList.propTypes = {
  data: PropTypes.arrayOf({
    name: PropTypes.string,
    id: PropTypes.string,
    points: PropTypes.string,
  }).isRequired,
};
