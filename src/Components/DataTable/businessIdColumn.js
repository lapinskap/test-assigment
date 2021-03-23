import React, { useState } from 'react';
import PropTypes from 'prop-types';
import __ from '../../utils/Translations';

export default function BusinessIdColumn({ row, column }) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const value = row._original[column.id] || '';
  const start = value.slice(0, 30);
  const end = value.slice(30);
  return (
    <div
      className="text-center business-id-column"
      title={value}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCopied(false);
      }}
    >
      <span className="business-id-start">
        {start}
      </span>
      <span className="business-id-end">
        {end}
      </span>
      {isHovered && document.queryCommandSupported('copy') ? (
        <em
          className={`business-id-copy${copied ? ' business-id-copied' : ''}`}
          role="presentation"
          title={__('Kopiuj')}
          onClick={
                        () => {
                          const copyInput = document.createElement('input');
                          copyInput.value = value;
                          document.body.appendChild(copyInput);
                          copyInput.select();
                          document.execCommand('Copy');
                          copyInput.remove();
                          setCopied(true);
                          setTimeout(() => setCopied(false), 150);
                        }
                    }
        >
          <i className="pe-7s-copy-file btn-icon-wrapper" />
        </em>
      ) : null}
    </div>
  );
}

BusinessIdColumn.propTypes = {
  row: PropTypes.shape({
    _original: PropTypes.shape({}),
  }).isRequired,
  column: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
