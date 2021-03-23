import React, { useState, useEffect, useContext } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import Parameters from '../../NewReport/ReportsList/Report/parameters';
import { reportParameters } from '../../NewReport/ReportsList/mockData';
import {
  isMockView, restApiRequest, REPORT_SERVICE,
} from '../../../../utils/Api';
import Subscription from '../../NewReport/ReportsList/Report/Subscription';
import Panel from './panel';
import List from './list';
import { dynamicNotification } from '../../../../utils/Notifications';
import RbsContext from '../../../../utils/RoleBasedSecurity/RbsContext';
import { getAhrUrl } from '../../helpers/ahrHelper';

const EditSubscription = ({ match }) => {
  const [fetchedParameters, setFetchedParameters] = useState([]);
  const [parametersState, setParametersState] = useState([]);
  const [subscribeData, setSubscribeData] = useState(initialSubscribeInfo || {});
  const [report, setReport] = useState({ name: '', id: '' });
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSubPopup, setSavedSubPopup] = useState(false);
  const [subscribeDataToSend, setSubscribeDataToSend] = useState({});
  const [isGetBlockBtn, setIsGetBlockBtn] = useState(false);
  const [invalidParameters, setInvalidParameters] = useState([]);

  const { id } = match.params;
  const history = useHistory();
  const rbsContext = useContext(RbsContext);
  const isAhr = false;

  useEffect(() => {
    fetchSubscribeData(id);
  }, [id]);

  useEffect(() => {
  }, [subscribeDataToSend]);

  useEffect(() => {
    if (subscribeData.reportId && subscribeData.reportId !== 'test') {
      fetchParameters(id, subscribeData.reportId);
      fetchSubscribeList(id);
      fetchReportDetails(subscribeData.reportId);
    }
  }, [subscribeData, id]);

  useEffect(() => {
    const pArr = [];
    fetchedParameters.map((item) => {
      let defval = typeof item.defaultValue !== 'undefined' ? item.defaultValue : [];
      if (item.type === 'Multiselect' || item.type === 'Select') {
        const asd = [];
        item.defaultValue.map((d) => asd.push(item.selectOptions.find((a) => a.value === d)));
        // const asd = item.selectOptions.find((a) => a.value === item.defaultValue.map((b) => b));

        defval = asd;
      }
      pArr.push({ parameterName: item.parameterName, values: defval, label: item.label });
      return '';
    });
    setParametersState(pArr);
  }, [fetchedParameters]);

  useEffect(() => {
    if (invalidParameters.length === 0) {
      setIsGetBlockBtn(false);
    } else {
      setIsGetBlockBtn(true);
    }
  }, [invalidParameters]);

  const fetchParameters = (subId, reportId) => {
    fetchData(setFetchedParameters,
      `/subscription/parameters/${subId}&${reportId}`,
      REPORT_SERVICE,
      'GET',
      {},
      reportParameters,
      'Błąd podczas pobierania parametrów.');
  };

  const fetchSubscribeData = (subId) => {
    fetchData(setSubscribeData,
      `/subscription/subscribeData/${subId}`,
      REPORT_SERVICE,
      'GET',
      {},
      initialSubscribeInfo,
      'Błąd podczas pobierania danych wysyłki.');
  };

  const fetchSubscribeList = (subId) => {
    fetchData(setSubscriptionList,
      `/subscription/subscriptionList/${subId}`,
      REPORT_SERVICE,
      'GET',
      {},
      [],
      'Błąd podczas pobierania listy wysyłek.');
  };

  const handleSaveSubscribeClick = () => {
    subscribeDataToSend.subscribeFrequency.subscribeFrequencySelect = null;
    subscribeDataToSend.subscribeMethod.SubscribeMethodSelect = null;

    const requestBody = {
      subscriptionId: id,
      parameters: parseParameterState(parametersState),
      subscriptionData: subscribeDataToSend,
    };
    setIsSaving(true);
    fetchData(() => { setSavedSubPopup(true); },
      `/subscription/${id}`,
      REPORT_SERVICE,
      'PATCH',
      { body: requestBody },
      {},
      'Błąd podczas edycji wysyłki').then(() => { setIsSaving(false); });
  };

  const fetchReportDetails = (reportId) => {
    const setReportDetail = (data) => {
      setReport({ name: data.name, id: data.id });
    };
    fetchData(setReportDetail,
      `/reports/${reportId}`,
      REPORT_SERVICE,
      'GET',
      {},
      { name: 'raport', id: 'asd123' },
      'Błąd podczas pobierania danych raportu');
  };

  const subscribeNode = (
    <Subscription
      isEdit
      subscribeFunc={handleSaveSubscribeClick}
      subscribeData={subscribeData}
      subscriptionId={id}
      setSubscribeDataToEditSend={setSubscribeDataToSend}
      isSaving={isSaving}
      isGetBlockBtn={isGetBlockBtn}
    />
  );

  const deleteSubscription = () => {
    fetchData(() => { history.push(getAhrUrl(`/report/subscriptions?reportName=${report.name}`, isAhr)); },
      `/subscription/${id}`,
      REPORT_SERVICE,
      'Delete',
      { },
      {},
      'Błąd podczas usuwania wysyłki.');
  };

  const closeSubPopup = () => setSavedSubPopup(false);

  const setInvalidParametersFunc = (d, push) => {
    if (push) {
      if (!invalidParameters.includes(d)) {
        const arr = [...invalidParameters];
        arr.push(d);
        setInvalidParameters(arr);
      }
    } else if (!push && invalidParameters.includes(d)) {
      let arr = [...invalidParameters];
      arr = arr.filter((item) => item !== d);
      setInvalidParameters(arr);
    }
  };

  const canDeleteSub = (isAhr && subscribeData.isCreator) || !isAhr;
  return (
    <>
      <Panel deleteSubscription={deleteSubscription} reportName={report.name} canDelete={canDeleteSub} />
      <Parameters
        parameters={fetchedParameters}
        parametersState={parametersState}
        setParametersState={setParametersState}
        subscription={subscribeNode}
        setInvalidParameters={setInvalidParametersFunc}
        isEdit
        isAhr={isAhr}
        isCreator={subscribeData.isCreator}
      />
      <List subscriptionList={subscriptionList} isAhr={isAhr} />
      <Modal isOpen={savedSubPopup} toggle={closeSubPopup} unmountOnClose size="sm">
        <ModalHeader toggle={closeSubPopup}>Powiadomienie</ModalHeader>
        <ModalBody>
          Pomyślnie edytowano wysyłkę
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={closeSubPopup}>Ok</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

EditSubscription.propTypes = {
  match: matchPropTypes.isRequired,
};

export default EditSubscription;

const fetchData = async (updateData, endpoint, service, method, { headers, params, body }, mockData, error) => {
  if (isMockView()) {
    updateData(mockData);
  } else {
    try {
      const result = await restApiRequest(service, endpoint, method, { headers, params, body }, {});
      updateData(result);
    } catch (e) {
      console.error(e);
      dynamicNotification(error || e.message || 'błąd', 'error');
    }
  }
};

const parseParameterState = (params) => {
  const newParams = [];
  params.map((item) => newParams.push({ ...item }));

  for (let i = 0; i < newParams.length; i += 1) {
    const element = newParams[i].values;

    const arr = [];
    if (element.value) { arr.push(element); }
    if (element.length === 0) { arr.push({ label: '', value: '' }); }

    for (let j = 0; j < element.length; j += 1) {
      const element2 = element[j];

      if (typeof element2.label === 'undefined') {
        arr.push({ label: element2, value: element2 });
      } else {
        arr.push(element2);
      }
    }
    newParams[i].values = arr;
  }
  return newParams;
};

const initialSubscribeInfo = {
  reportId: 'test',
  note: '',
  subscribeMethod: {
    subscribeMethod: { label: '', value: '' },
    messageTitle: '',
    recipients: [
      { value: 'm@q.pl', label: 'm@q.pl' },
      { value: 't@q.pl', label: 't@.pl' },
    ],
    hiddenRecipients: [
      { value: 'b@q.pl', label: 'bz@q.pl' },
    ],
    format: { label: 'xls', value: 1 },
    messageContent: '<b>test</b>',
    ahrList: [],
  },
  subscribeFrequency:
  {
    subscribeFrequency: { label: '', value: '' },
    sendDate: new Date().toISOString().slice(0, 10),
    sendStartDate: new Date().toISOString().slice(0, 10),
    sendTime: '10:00',
    dayOfWeek: [],
    daysOfMonth: { label: 1, value: 1 },
    daysSendAmount: { label: 1, value: 1 },
    daysToSend: [{ index: 1, select: { label: 1, value: 1 } }],
    sendMonthStart: { value: 1, label: 'styczeń' },
    repeatEvery: '1',
    occurrence: '',
  },
};
