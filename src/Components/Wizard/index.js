import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import __ from '../../utils/Translations';

const getStepFromLocation = ({ hash }) => (hash ? +hash.replace('#', '') : 0);

export default function Wizard({
  steps, showNavigation, initAllowedStep, saveButtonLabel,
}) {
  const history = useHistory();
  const urlStep = getStepFromLocation(history.location);
  const [showPreviousBtn, setShowPreviousBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [maxAllowedStep, setMaxAllowedStep] = useState(initAllowedStep);
  const [currentStep, setCurrentStep] = useState(0);
  const [navState, setNavState] = useState(getNavStates(0, steps.length));
  const wizard = useRef();
  const { submit, blockSteps } = steps[currentStep];

  useEffect(() => {
    if (urlStep !== currentStep) {
      changeNavState(urlStep);
    }
    if (maxAllowedStep === 0) {
      setMaxAllowedStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, urlStep]);

  const changeNavState = (nextStepRequest) => {
    let nextStep;
    if (nextStepRequest >= maxAllowedStep) {
      nextStep = maxAllowedStep;
    } else {
      nextStep = nextStepRequest;
    }

    if (nextStep < steps.length) {
      setNavState(getNavStates(nextStep, steps.length));
      setCurrentStep(nextStep);
      if (nextStep !== nextStepRequest) {
        history.replace({
          hash: `${nextStep}`,
        });
      }
      if (nextStep >= maxAllowedStep) {
        setMaxAllowedStep(nextStep + 1);
      }
    }
    const { showPreviousBtn: previousBtn, showNextBtn: nextBtn } = checkNavState(nextStep, steps.length);
    setShowPreviousBtn(previousBtn);
    setShowNextBtn(nextBtn);
  };

  const changeStep = (step) => {
    history.push({
      hash: `${step}`,
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleKeyDown = (e) => {
    if (e.which === 13) {
      submitStep();
    }
  };

  const handleOnClick = (e) => {
    if (blockSteps) {
      return;
    }
    const step = +e.currentTarget.value;
    if (step > currentStep) {
      submitStep();
    } else {
      changeStep(step);
    }
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      changeStep(currentStep + 1);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      changeStep(currentStep - 1);
    }
  };

  const getClassName = (className, i) => `${className}-${navState.styles[i]}${blockSteps ? ' step-blocked' : ''}`;

  const renderSteps = () => steps.map((step, i) => (
    <li
      data-t1={`step${i + 1}`}
      role="presentation"
      className={getClassName('form-wizard-step', i)}
      onClick={handleOnClick}
        // eslint-disable-next-line react/no-array-index-key
      key={i}
      value={i}
    >
      <em>{i + 1}</em>
      <span>{step.name}</span>
    </li>
  ));

  const submitStep = () => {
    const submitButton = wizard.current.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.click();
    } else {
      next();
    }
  };

  const onSubmit = async () => {
    if (submit && await submit()) {
      next();
    }
  };

  return (
    <div className="wizard" role="presentation" ref={wizard} data-t1="wizard">
      <ol className="forms-wizard">{renderSteps()}</ol>
      <h5 className="m-3"><strong>{steps[currentStep].name}</strong></h5>
      {React.cloneElement(steps[currentStep].component, { next: submit ? onSubmit : next })}
      <div className="divider" />
      <div className="clearfix">
        {!blockSteps ? (
          <div style={showNavigation ? {} : { display: 'none' }}>
            <Button
              data-t1="previousStep"
              color="secondary"
              className="btn-shadow float-left btn-wide btn-pill"
              outline
              style={showPreviousBtn ? {} : { display: 'none' }}
              onClick={previous}
            >
              {__('Wróć')}
            </Button>
            <Button
              data-t1="nextStep"
              color="primary"
              className="btn-shadow btn-wide float-right btn-pill btn-hover-shine"
              style={showNextBtn ? {} : { display: 'none' }}
              onClick={submitStep}
            >
              {submit ? __(saveButtonLabel) : __('Dalej')}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const STEP_STATE_DONE = 'done';
const STEP_STATE_DOING = 'doing';
const STEP_STATE_TODO = 'todo';

const getNavStates = (index, length) => {
  const styles = [];
  for (let i = 0; i < length; i += 1) {
    if (i < index) {
      styles.push(STEP_STATE_DONE);
    } else if (i === index) {
      styles.push(STEP_STATE_DOING);
    } else {
      styles.push(STEP_STATE_TODO);
    }
  }
  return {
    current: index,
    styles,
  };
};

const checkNavState = (currentStep, stepsLength) => {
  if (currentStep > 0 && currentStep < stepsLength - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true,
    };
  }
  if (currentStep === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true,
    };
  }
  return {
    showPreviousBtn: true,
    showNextBtn: false,
  };
};

Wizard.propTypes = {
  showNavigation: PropTypes.bool,
  initAllowedStep: PropTypes.number,
  saveButtonLabel: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  steps: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.node,
    name: PropTypes.string,
    validation: PropTypes.func,
    submit: PropTypes.func,
    blockSteps: PropTypes.bool,
  })).isRequired,
};

Wizard.defaultProps = {
  showNavigation: true,
  initAllowedStep: 0,
  saveButtonLabel: 'Zapisz',
};
