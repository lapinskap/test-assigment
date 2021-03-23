import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Input, FormGroup, InputGroup, Label,
} from 'reactstrap';
import __ from '../../utils/Translations';

export default function CopiableField({ label, content }) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!content) {
    return null;
  }
  return (
    <FormGroup>
      <Label>
        {__(label)}
        :
      </Label>
      <InputGroup>
        <div
          className="copiable-field"
          title={content}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCopied(false);
          }}
        >
          <Input value={content} disabled />
          {isHovered && document.queryCommandSupported('copy') ? (
            <em
              className={`copy-icon${copied ? ' copied' : ''}`}
              role="presentation"
              title={__('Kopiuj')}
              onClick={
                   () => {
                     const copyInput = document.createElement('input');
                     copyInput.value = content;
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
      </InputGroup>
    </FormGroup>
  );
}

CopiableField.propTypes = {
  content: PropTypes.string,
  label: PropTypes.string,
};

CopiableField.defaultProps = {
  content: null,
  label: null,
};
