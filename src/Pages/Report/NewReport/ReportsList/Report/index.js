import React, { useState, useEffect, useContext } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { match as matchPropTypes } from 'react-router-prop-types';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import Panel from './panel';
import Parameters from './parameters';
import RenderReport from './renderReport';
import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import {
  reportParameters, reportDetails, htmlReportRenderMock, mockFormat,
} from '../mockData';
import {
  isMockView, restApiRequest, REPORT_SERVICE, getServiceHost,
} from '../../../../../utils/Api';
import { getSession } from '../../../../../utils/RoleBasedSecurity/Session';
import Subscription from './Subscription';
import { dynamicNotification } from '../../../../../utils/Notifications';
import RbsContext from '../../../../../utils/RoleBasedSecurity/RbsContext';
import { getAhrUrl } from '../../../helpers/ahrHelper';

const ReportDetail = ({ match }) => {
  const [parametersState, setParametersState] = useState([]);
  const [fetchedParameters, setFetchedParameters] = useState([]);
  const [reportDetail, setReportDetail] = useState({});
  const [renderedReport, setRenderedReport] = useState('');
  const [formatOptions, setFormatOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSubPopup, setSavedSubPopup] = useState(false);
  const [isGetBlockBtn, setIsGetBlockBtn] = useState(false);
  const [invalidParameters, setInvalidParameters] = useState([]);

  const rbsContext = useContext(RbsContext);

  const isAhr = rbsContext.userInfo.isAhr();

  const reportId = match.params.id;

  useEffect(() => {
    fetchReportDetails(reportId);
    fetchParameters(reportId);
  }, [reportId]);

  useEffect(() => {
    const pArr = [];

    fetchedParameters.map((item) => {
      let defval = typeof item.defaultValue !== 'undefined' ? item.defaultValue : [];
      if (item.type === 'Multiselect' || item.type === 'Select') {
        const asd = item.selectOptions.find((a) => a.value === item.defaultValue[0]);

        defval = asd;
      }
      pArr.push({ parameterName: item.parameterName, values: defval, label: item.label });
      return '';
    });
    setParametersState(pArr);
  }, [fetchedParameters]);

  useEffect(() => {
    setIsLoading(false);
  }, [renderedReport]);

  useEffect(() => {
    if (invalidParameters.length === 0) {
      setIsGetBlockBtn(false);
    } else {
      setIsGetBlockBtn(true);
    }
  }, [invalidParameters]);

  const fetchParameters = (id) => {
    fetchData(setFetchedParameters,
      `/reports/parameters/${id}`,
      REPORT_SERVICE,
      'GET',
      {},
      reportParameters,
      'Błąd podczas pobierania parametrów');
  };

  const closeSubPopup = () => setSavedSubPopup(false);

  const fetchReportDetails = (id) => {
    fetchData(setReportDetail, `/reports/${id}`, REPORT_SERVICE, 'GET', {}, reportDetails, 'Błąd podczas pobierania danych raportu');
  };

  const fetchRenderedHtml = (page) => {
    setIsLoading(true);
    const requestBody = {
      reportId: reportDetail.id,
      page,
      companyId: '1',
      parameters: parseParameterState(parametersState),
    };
    fetchData(setRenderedReport,
      '/reports/static/html',
      REPORT_SERVICE,
      'POST',
      { body: requestBody },
      htmlReportRenderMock,
      'Błąd podczas generowania podglądu raportu')
      .then(() => { setIsLoading(false); });
  };

  const fetchFormatOptions = () => {
    fetchData(setFormatOptions, '/reports/static/formats', REPORT_SERVICE, 'GET', {}, mockFormat, 'Błąd podczas pobierania dostępnych formatów');
  };

  const downloadReport = async (format, callback, toArchive) => {
    if (!isMockView()) {
      const chosenFormat = formatOptions.find((x) => x.renderFormatId === Number(format));
      const session = getSession();
      const server = getServiceHost(REPORT_SERVICE);
      const url = `${server}/reports/static/file/${chosenFormat.renderFormatId}`;

      const requestBody = JSON.stringify({
        reportId: reportDetail.id,
        reportGroupId: reportDetail.groupId,
        parameters: parseParameterState(parametersState),
        toArchive,
      });

      fetch(url,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            Authorization: `Bearer ${await session.getValidAccessToken()}`,
          },
          body: requestBody,

          // 1. Convert the data into 'blob'
        })
        .then((response) => response.blob()).then((blob) => {
          if (blob.size !== 0) {
            // 2. Create blob link to download
            const urlfile = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = urlfile;
            link.setAttribute('download', `${reportDetail.name}.${chosenFormat.fileExtension}` /* ${this.state.file} */);
            // 3. Append to html page
            document.body.appendChild(link);
            // 4. Force download
            link.click();
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);
            callback(true);
          } else {
            callback(false);
          }
        });// .then(() => callback())
    } else {
      callback(false);
    }
  };

  const handleSubscribeClick = (data) => {
    const requestBody = { parameters: parseParameterState(parametersState), subscriptionData: data };
    requestBody.subscriptionData.reportId = reportId;
    setIsSaving(true);

    fetchData(() => { setSavedSubPopup(true); },
      '/subscription',
      REPORT_SERVICE,
      'POST',
      { body: requestBody },
      {},
      'Błąd podczas zapisywania wysyłki')
      .then(() => { setIsSaving(false); });
  };

  const subscribeNode = (
    <Subscription
      isEdit={false}
      subscribeFunc={handleSubscribeClick}
      subscribeData={initialSubscribeInfo}
      reportId={reportId}
      isSaving={isSaving}
      setSubscribeDataToEditSend={() => { }}
      isGetBlockBtn={isGetBlockBtn}
      isAhr={isAhr}
    />
  );

  const reportHeading = typeof reportDetail.name !== 'undefined' ? reportDetail.name : '';

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
          heading={reportHeading}
          breadcrumbs={[
            { title: 'Raporty', link: getAhrUrl('/report', isAhr) },
            { title: 'Lista Raportów', link: getAhrUrl('/report/predefined_reports', isAhr) },
          ]}
        />
        <div className="report-detail-margin-bottom">
          <Panel
            showReport={fetchRenderedHtml}
            download={downloadReport}
            fetchFormatOptions={fetchFormatOptions}
            formatOptions={formatOptions}
            reportName={reportDetail.name}
            isGetBlockBtn={isGetBlockBtn}
            isAhr={isAhr}
          />
        </div>
        <div className="report-detail-margin-bottom">
          <Parameters
            className="report-detail-margin-bottom"
            parameters={fetchedParameters}
            parametersState={parametersState}
            setParametersState={setParametersState}
            subscription={subscribeNode}
            setInvalidParameters={setInvalidParametersFunc}
            isGetBlockBtn={isGetBlockBtn}
          />
        </div>
        <div className="report-detail-margin-bottom">
          {(renderedReport || isLoading)
            && (
              <RenderReport
                className="report-detail-margin-bottom"
                report={renderedReport}
                fetchRenderedHtml={fetchRenderedHtml}
                isLoading={isLoading}
              />
            )}
        </div>
      </CSSTransitionGroup>
      <Modal isOpen={savedSubPopup} toggle={closeSubPopup} unmountOnClose size="sm">
        <ModalHeader toggle={closeSubPopup}>Powiadomienie</ModalHeader>
        <ModalBody>
          Pomyślnie zapisano wysyłkę
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={closeSubPopup}>Ok</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

ReportDetail.propTypes = {
  match: matchPropTypes.isRequired,
};
export default ReportDetail;

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
  note: '',
  subscribeMethod: {
    subscribeMethod: { label: 'Nie wybrano', value: -1 },
    messageTitle: '',
    recipients: [],
    hiddenRecipients: [],
    format: { label: 'Nie wybrano', value: -1 },
    messageContent: '',
    ahrList: [],
  },
  subscribeFrequency:
  {
    subscribeFrequency: { label: 'Nie wybrano', value: -1 },
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
