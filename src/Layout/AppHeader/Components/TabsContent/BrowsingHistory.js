import React from 'react';
import {
  ListGroupItem,
  ListGroup,
} from 'reactstrap';
import {
  faFileSignature,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import __ from '../../../../utils/Translations';
import { getBrowsingHistory, TYPE_EDIT, TYPE_LISTING } from '../../../../utils/browsingHistory';

const getIconByType = (type) => {
  switch (type) {
    case TYPE_LISTING:
      return faFileAlt;
    case TYPE_EDIT:
    default:
      return faFileSignature;
  }
};

const getColorByType = (type) => {
  switch (type) {
    case TYPE_LISTING:
      return 'text-primary';
    case TYPE_EDIT:
    default:
      return 'text-danger';
  }
};

export default function BrowsingHistory({ close }) {
  const history = getBrowsingHistory();
  return (
    <div className="drawer-section p-0">
      <div className="files-box">
        <ListGroup flush>
          {
            history.length ? history.map(({ type, path, title }) => (
              <Link key={path} to={path} onClick={close}>
                <ListGroupItem className="pt-2 pb-2 pr-2">
                  <div className="widget-content p-0">
                    <div className="widget-content-wrapper">
                      <div className={`widget-content-left fsize-2 mr-3 ${getColorByType(type)} center-elem`}>
                        <FontAwesomeIcon icon={getIconByType(type)} />
                      </div>
                      <div className="widget-content-left">
                        <div className="font-weight-normal">
                          {__(title)}
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroupItem>
              </Link>
            )) : (
              <strong className="m-3">{__('Brak historii przeglądanych obiektów')}</strong>
            )
}
        </ListGroup>
      </div>
    </div>
  );
}
BrowsingHistory.propTypes = {
  close: PropTypes.func.isRequired,
};
