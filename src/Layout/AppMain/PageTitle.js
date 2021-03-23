import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import Breadcrumbs from './Breadcrumbs';

const PageTitle = ({
  enablePageTitleIcon,
  enablePageTitleSubheading,
  heading,
  breadcrumbs,
  breadcrumbsHeading,
  icon = 'pe-7s-graph icon-gradient bg-ripe-malin',
}) => {
  useEffect(() => {
    document.title = heading;
  }, [heading]);

  return (
    <>
      <div className="app-page-title app-page-title-simple">
        <div className="page-title-wrapper">
          <div className="page-title-heading">
            <div>
              <div className="page-title-head center-elem">
                <span className={cx('d-inline-block pr-2', {
                  'd-none': !enablePageTitleIcon,
                })}
                >
                  <i className={icon} />
                </span>
                <span className="d-inline-block" data-t1="pageTitle">{heading}</span>
              </div>
              <div className={cx('page-title-subheading opacity-10', {
                'd-none': !enablePageTitleSubheading,
              })}
              >
                {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} heading={breadcrumbsHeading || heading} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  enablePageTitleIcon: state.ThemeOptions.enablePageTitleIcon,
  enablePageTitleSubheading: state.ThemeOptions.enablePageTitleSubheading,
});

export default connect(mapStateToProps)(PageTitle);

PageTitle.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
  enablePageTitleIcon: PropTypes.bool,
  enablePageTitleSubheading: PropTypes.bool,
  pushToHistory: PropTypes.bool,
  heading: PropTypes.string.isRequired,
  breadcrumbsHeading: PropTypes.string,
  icon: PropTypes.string,
  historyElementType: PropTypes.string,
};

PageTitle.defaultProps = {
  enablePageTitleIcon: true,
  enablePageTitleSubheading: true,
  icon: '',
  historyElementType: 'edit',
  pushToHistory: false,
  breadcrumbsHeading: null,
};
