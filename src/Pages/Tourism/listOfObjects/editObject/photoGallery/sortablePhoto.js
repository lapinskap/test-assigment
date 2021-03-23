import React from 'react';
import PropTypes from 'prop-types';
import { MAX_SINGLE_IMAGE_HEIGHT, MAX_SINGLE_IMAGE_WIDTH } from './selectablePhoto';
import AppConfig from '../../../../../config/appConfig';

const SortablePhoto = ({
  photo,
}) => {
  const imgStyle = {
    zIndex: 100,
    maxWidth: MAX_SINGLE_IMAGE_WIDTH,
    maxHeight: MAX_SINGLE_IMAGE_HEIGHT,
    height: photo.height,
    width: photo.width,
  };

  return (
    <div role="presentation" style={imgStyle}>
      <img
        style={{
          maxWidth: MAX_SINGLE_IMAGE_WIDTH,
          maxHeight: MAX_SINGLE_IMAGE_HEIGHT,
        }}
        alt={photo.name}
        src={`${AppConfig.get('mediaUrl')}${photo.src}`}
        width={photo.width}
        height={photo.height}
      />
    </div>
  );
};

export default SortablePhoto;
SortablePhoto.propTypes = {

  photo: PropTypes.shape({
    name: PropTypes.string,
    alt: PropTypes.string,
    height: PropTypes.number,
    src: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
};
