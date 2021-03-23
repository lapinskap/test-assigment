import React, { useState, useCallback } from 'react';

import { Button } from 'reactstrap';
import Form from './form';

export default () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const closeForm = useCallback(() => {
    setOpenNewForm(false);
  }, []);

  return (
    <>
      <div>
        <Button data-t1="chargeDown" color="link" className="m-3" onClick={() => setOpenNewForm(true)}>
          + Wykonaj rozładowanie
        </Button>
      </div>
      {openNewForm ? <Form close={closeForm} isOpen={Boolean(openNewForm)} /> : null}
    </>
  );
};
