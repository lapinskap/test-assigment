import React, { useState } from 'react';
import {
  Card, CardBody,
} from 'reactstrap';
import Loader from 'react-loader-advanced';
import { Loader as LoaderAnim } from 'react-loaders';
import PropTypes from 'prop-types';
import Pagination from '../../../../../Components/DataTableControlled/pagination';

const Parameters = ({ report, fetchRenderedHtml, isLoading }) => {
  const [actualPage, setActualPage] = useState(1);

  const createHtml = () => ({ __html: report.htmlRender });
  const spinner = <LoaderAnim color="#545cd8" type="line-scale" active />;

  return (
    <>
      <Loader
        message={spinner}
        contentBlur={0}
        show={isLoading}
        messageStyle={{ position: 'absolute', top: '5%', right: '50%' }}
      >
        <Card>
          <CardBody>
            <div style={{ minHeight: '250px' }}>
              <div className="row">
                <Pagination
                  page={actualPage}
                  pageSize={10}
                  pages={report.totalPages ?? 1}
                  availablePageSizes={[]}
                  onPageChange={(p) => { setActualPage(p); fetchRenderedHtml(p); }}
                  onPageSizeChange={() => { }}
                />
              </div>
              <div className="row">
                { /* eslint-disable react/no-danger */}
                <div className="col-md-12" dangerouslySetInnerHTML={createHtml()} />
              </div>
            </div>
          </CardBody>
        </Card>
      </Loader>
    </>
  );
};

Parameters.propTypes = {
  report: PropTypes.objectOf.isRequired,
  fetchRenderedHtml: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Parameters;
