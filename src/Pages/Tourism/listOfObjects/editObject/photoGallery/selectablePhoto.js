import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'reactstrap';
import __ from '../../../../../utils/Translations';
import AppConfig from '../../../../../config/appConfig';

const Checkmark = (
  <div
    style={{
      left: '4px', top: '4px', position: 'absolute', zIndex: '1', opacity: 1,
    }}
  >
    <svg
      style={{ fill: 'white', position: 'absolute' }}
      width="24px"
      height="24px"
    >
      <circle cx="12.5" cy="12.2" r="8.292" />
    </svg>
    <svg
      style={{ fill: '#06befa', position: 'absolute' }}
      width="24px"
      height="24px"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </svg>
  </div>
);

export const MAX_SINGLE_IMAGE_WIDTH = '375px';
export const MAX_SINGLE_IMAGE_HEIGHT = '282px';

const selectedImgStyle = {
  transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
};
const cont = {
  backgroundColor: '#eee',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
};

const imgStyle = {
  maxWidth: MAX_SINGLE_IMAGE_WIDTH,
  maxHeight: MAX_SINGLE_IMAGE_HEIGHT,
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
};

const SelectablePhoto = ({
  photo,
  selected,
  markAsSelected,
  deletePhoto,
  openPopup,
}) => {
  const sx = (100 - (30 / photo.width) * 100) / 100;
  const sy = (100 - (30 / photo.height) * 100) / 100;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

  return (
    <>
      <div
        style={{
          height: photo.height,
          width: photo.width,
          maxWidth: MAX_SINGLE_IMAGE_WIDTH,
          maxHeight: MAX_SINGLE_IMAGE_HEIGHT,
          ...cont,
        }}
        className={!selected ? 'not-selected' : ''}
        onClick={() => markAsSelected(!selected)}
        role="presentation"
      >
        <img
          className="no-dragging"
          alt={photo.name}
          style={selected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }}
          src={`${AppConfig.get('mediaUrl')}${photo.src}`}
          width={photo.width}
          height={photo.height}
        />
        {selected ? (
          <>
            <div style={{
              left: 0,
              top: 0,
              position: 'absolute',
              zIndex: '1',
              width: '100%',
              height: '100%',
              backgroundColor: 'gray',
              opacity: 0.6,
            }}
            />
            <div style={{
              left: 0,
              top: 0,
              position: 'absolute',
              zIndex: '2',
              width: '100%',
              height: '100%',
            }}
            >
              {Checkmark}
              <div className="text-center pt-4 text-white">
                <div>
                  {__('Tytuł obrazka')}
                  :
                </div>
                <div>
                  {photo.name || <span className="font-italic">{__('brak')}</span>}
                </div>
                <div>
                  {__('Tekst alternatywny')}
                  :
                </div>
                <div>
                  {photo.alt || <span className="font-italic">{__('brak')}</span>}
                </div>

                <Button
                  data-t1="delete"
                  className="m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto();
                  }}
                >
                  Usuń
                </Button>
                <Button
                  data-t1="edit"
                  className="m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup();
                  }}
                >
                  Edytuj
                </Button>
              </div>
            </div>
          </>
        ) : null}
        <style>{'.not-selected:hover{outline:2px solid #06befa}'}</style>
      </div>
    </>
  );
};

export default SelectablePhoto;

SelectablePhoto.propTypes = {
  openPopup: PropTypes.func.isRequired,
  markAsSelected: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  photo: PropTypes.shape({
    name: PropTypes.string,
    alt: PropTypes.string,
    height: PropTypes.number,
    src: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
};
