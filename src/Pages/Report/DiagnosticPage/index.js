import React, { useState, useEffect } from 'react';
import {
  REPORT_SERVICE, isMockView, restApiRequest,
} from '../../../utils/Api';
import { dynamicNotification } from '../../../utils/Notifications';

let errorAlert = '';
const DiagnosticPage = () => {
  const [diagnose, setDiagnose] = useState({});

  useEffect(() => {
    getDiagnose();
  }, []);
  const getDiagnose = () => {
    const endpoint = '/audit/Diagnostic';

    fetchData(setDiagnose,
      endpoint,
      REPORT_SERVICE,
      'GET',
      {},
      [],
      'Błąd podczas pobierania danych diagnostycznych, nie można się połączyć z staticReportApi');
  };

  const rowList = (items) => {
    if (items) {
      return items.map((item) => <div>{item}</div>);
    }
    return null;
  };

  return (
    <div>
      <p>
        {errorAlert}
      </p>
      <p>
        Nazwa użytkownika: &nbsp;
        {diagnose.name}
      </p>
      <p>
        Rola: &nbsp;
        {diagnose.roleName}
      </p>
      <p>
        Grupy pracownicze: &nbsp;
        {rowList(diagnose.employeegroups)}
      </p>
      <p>
        Jednostki organizacyjne: &nbsp;
        {rowList(diagnose.organisationUnits)}
      </p>
      Tryb: &nbsp;
      {diagnose.mode}
      <p>
        Stan SubscriptionServiceApi: &nbsp;
        {diagnose.reportApiState}
      </p>
    </div>
  );
};

export default DiagnosticPage;

const fetchData = async (updateData, endpoint, service, method, { headers, params }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
      errorAlert = `!!!!${error}!!!!`;
    }
  }
};
