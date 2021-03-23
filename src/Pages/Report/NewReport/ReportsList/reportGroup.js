import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Button,
} from 'reactstrap';
import { CSSTransitionGroup } from 'react-transition-group';
import ReportListByGroup from './reportListByGroup';

const ReportGroup = ({ group, companyId }) => {
  const toggle = () => setIsOpen(!isOpen);
  const [isOpen, setIsOpen] = useState(false);

  const angleDirection = isOpen ? 'up' : 'down';
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
        <div>
          <Card style={{ marginBottom: '10px' }}>
            <CardBody style={{ paddingBottom: '0', paddingTop: '0' }}>
              <CardTitle style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggle}>
                <div className="row">
                  <div className="col-md-10" style={{ marginTop: '15px' }}>
                    {group.reportGroupName}
                  </div>
                  <div className="col-md-2 text-right">
                    <Button color="link">
                      <i className={`pe-7s-angle-${angleDirection} pe-3x`} />
                    </Button>
                  </div>
                </div>
              </CardTitle>
              {isOpen && <ReportListByGroup description={group.reportGroupDescription} groupId={group.reportGroupId} companyId={companyId} />}
            </CardBody>
          </Card>
        </div>
      </CSSTransitionGroup>
    </>
  );
};

ReportGroup.propTypes = {
  group: PropTypes.objectOf.isRequired,
  companyId: PropTypes.string.isRequired,
};

export default ReportGroup;
