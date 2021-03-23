import React, { useState } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import {
  Button, Input, InputGroup, InputGroupAddon, Card, CardHeader, CardBody,
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import DataLoading from '../../../Components/Loading/dataLoading';
import { useCompanyId, useCompanyName } from '../../Company/CompanyContext';

export default () => {
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState('');
  const companyName = useCompanyName();
  const companyId = useCompanyId();
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
          heading={`Dostępy dla firmy ${companyName} (ID: ${companyId})`}
          pushToHistory
          breadcrumbs={[]}
        />
        <Card>
          <CardHeader>
            Token dostępowy
          </CardHeader>
          <CardBody>
            <DataLoading
              fetchedData={token}
              isMock
              updateData={(res) => setToken(res.token)}
              endpoint="/ahr/token/value"
            >
              <InputGroup>
                <Input disabled type={showToken ? 'text' : 'password'} value={token} />
                <InputGroupAddon addonType="append">
                  <Button data-t1="accessTokenShow" onClick={() => setShowToken(!showToken)}>Pokaż token</Button>
                </InputGroupAddon>
              </InputGroup>
            </DataLoading>
          </CardBody>
        </Card>
      </CSSTransitionGroup>
    </>
  );
};
