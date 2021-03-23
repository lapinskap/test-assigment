import PropTypes from 'prop-types';
import React from 'react';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { faHome } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ breadcrumbs, heading }) {
  return (
    <Breadcrumb data-t1="breadcrumbs">
      <BreadcrumbItem data-t1="breadcrumbsItem">
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </BreadcrumbItem>
      {breadcrumbs.map(({ title, link }) => (
        <BreadcrumbItem key={link} data-t1="breadcrumbsItem">
          <Link to={link}>
            {title}
          </Link>
        </BreadcrumbItem>
      ))}
      <BreadcrumbItem key="active-breadcrumb" active data-t1="breadcrumbsActiveItem">{heading}</BreadcrumbItem>
    </Breadcrumb>
  );
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
  heading: PropTypes.string.isRequired,
};
