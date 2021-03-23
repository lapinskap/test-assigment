import React from 'react';
import renderer from 'react-test-renderer';
import FormElement from './FormElement';
import '../../tests/setupTests';

describe('<FormElement />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  let label; let id; let type; let value; let
    validation;

  beforeEach(() => {
    label = 'Test label';
    id = 'fullName';
    type = 'text';
    value = undefined;
    validation = ['required', { method: 'minLength', args: [3] }];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly as type text', () => {
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type title', () => {
    type = 'title';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type button', () => {
    type = 'button';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type datetime', () => {
    type = 'datetime';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type wysiwyg', () => {
    type = 'wysiwyg';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type file', () => {
    type = 'file';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type numberRange', () => {
    type = 'numberRange';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type dateRange', () => {
    type = 'dateRange';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type date', () => {
    type = 'date';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type number', () => {
    type = 'number';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type boolean', () => {
    type = 'boolean';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type textarea', () => {
    type = 'textarea';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type select', () => {
    type = 'select';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type radio', () => {
    type = 'radio';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as type ipv4', () => {
    type = 'ipv4';
    const tree = renderer
      .create(<FormElement
        type={type}
        label={label}
        id={id}
        value={value}
        validation={validation}
      />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
