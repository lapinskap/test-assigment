import React from 'react';
import { Alert, Button } from 'reactstrap';

const NoAccessPage = () => (
  <div className="p-3">
    <Alert color="danger">
      You don't have access to be here.
      <Button color="link" onClick={() => {}}>Logout</Button>
    </Alert>
  </div>
);

export default NoAccessPage;
