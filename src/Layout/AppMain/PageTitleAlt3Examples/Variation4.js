import React from 'react';

import { ButtonGroup, Button } from 'reactstrap';

const TitleComponent4 = () => (
  <>
    <ButtonGroup size="sm">
      <Button className="btn-shadow" color="primary">
        Today
      </Button>
      <Button className="btn-shadow" color="primary">
        Yesterday
      </Button>
      <Button className="btn-shadow" color="primary">
        Last Month
      </Button>
    </ButtonGroup>
  </>
);
export default TitleComponent4;
