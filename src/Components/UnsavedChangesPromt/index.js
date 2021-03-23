import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Prompt } from 'react-router-dom';

export default function UnsavedChangesPrompt({ message = 'Niezapisane zmiany zostaną utracone', children }) {
  const [changed, setChanged] = useState(false);
  const setIsEdited = useCallback((state) => {
    if (changed !== state) {
      setChanged(state);
    }
  }, [changed]);
  return (
    <>
      <Prompt
        when={changed}
        message={message}
      />
      {Array.isArray(children)
        ? children.map((node) => React.cloneElement(node, { setIsEdited }))
        : React.cloneElement(children, { setIsEdited })}
    </>
  );
}

UnsavedChangesPrompt.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
};

UnsavedChangesPrompt.defaultProps = {
  message: 'Niezapisane zmiany zostaną utracone.',
};
