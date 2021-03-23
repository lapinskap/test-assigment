import React, { useContext } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReportsList from './ReportsList';
import { getAhrUrl } from '../helpers/ahrHelper';
import RbsContext from '../../../utils/RoleBasedSecurity/RbsContext';

const NewReport = () => {
  const rbsContext = useContext(RbsContext);
  const isAhr = rbsContext.userInfo.isAhr();
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
          heading="Raporty predefiniowane"
          breadcrumbs={[
            { title: 'Raporty', link: getAhrUrl('/report', isAhr) },
          ]}
        />
        <ReportsList isAhr={isAhr} />
      </CSSTransitionGroup>
    </>
  );
};

export default NewReport;
NewReport.propTypes = {
};
