import React, { useState } from 'react';
import { Label } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import PropTypes from 'prop-types';
import ValidationMessage from '../Form/ValidationMessage';

export default function Wysiwyg({
  id, label, translatorTrigger, value, height, disabled, onChange, tooltip, belowLabelComponent, className, errorMessage, validateField, validation,
}) {
  const [removeListener, setRemoveListener] = useState(null);
  const onUpdate = (event) => {
    let data = event.editor.getData();
    if (data) {
      data = fromEditorValueParser(data);
    }
    onChange(id, data);
    validateField(id, data, validation);
  };

  return (
    <div className="input-group-omb">
      {label ? (
        <Label data-t1={`${id}Label`} for={id}>
          {label}
          {' '}
          {tooltip}
          {' '}
          {translatorTrigger}
        </Label>
      ) : null}
      {belowLabelComponent ? <div>{belowLabelComponent}</div> : null}
      <div className={className} data-t1={id} style={{ opacity: disabled ? 0.6 : 1 }}>
        <CKEditor
          id={id}
          data={toEditorValueParser(value)}
          onChange={onUpdate}
          onMode={(event) => {
            const editable = event.editor.editable();
            if (event.editor.mode !== 'source') {
              if (removeListener) {
                removeListener();
              }
            } else {
              const listenerObject = editable.attachListener(editable, 'input', () => {
                let data = event.editor.getData();
                if (data) {
                  data = fromEditorValueParser(data);
                }
                onChange(id, data);
                validateField(id, data, validation);
              });
              setRemoveListener(() => listenerObject.removeListener);
            }
          }}
          height={1}
          onAfterPaste={onUpdate}
          onAfterCommandExec={onUpdate}
          config={{
            height: height || 150,
          }}
          readOnly={disabled}
        />
        <ValidationMessage message={errorMessage} />
      </div>
    </div>
  );
}

const toEditorValueParser = (value) => (value ? value.replace(/ó/g, '&oacute;') : null);
const fromEditorValueParser = (value) => (value ? value.replace(/&oacute;/g, 'ó') : null);

Wysiwyg.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.node,
  belowLabelComponent: PropTypes.node,
  value: PropTypes.string,
  errorMessage: PropTypes.string,
  translatorTrigger: PropTypes.node,
  height: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  validateField: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.array,
};

Wysiwyg.defaultProps = {
  id: '',
  label: '',
  tooltip: null,
  belowLabelComponent: null,
  value: '',
  errorMessage: '',
  translatorTrigger: null,
  height: null,
  disabled: false,
  className: '',
  validateField: () => {},
  validation: [],
};
