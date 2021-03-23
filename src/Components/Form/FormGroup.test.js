import React from 'react';
// import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FormGroup from './FormGroup';
import '../../tests/setupTests';
import { LAYOUT_TWO_COLUMNS } from '../Layouts';

describe('<FormGroup />', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((init) => [init, setState]);

  // let wrapper;

  let title;
  let data;
  let invalidFields;
  let validateField;
  let formElements;

  beforeEach(() => {
    title = 'Test title';
    data = jest.fn();
    invalidFields = {};
    validateField = () => {
    };
    formElements = [{ push: jest.fn() }];
    // wrapper = shallow(<FormGroup
    //   title={title}
    //   formElements={formElements}
    //   data={data}
    //   invalidFields={invalidFields}
    //   validateField={validateField}
    // />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(<FormGroup
        title={title}
        formElements={formElements}
        data={data}
        invalidFields={invalidFields}
        validateField={validateField}
      />)
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  it('renders correctly with valid form elements', () => {
    formElements = [{
      id: 'fullName',
      dataOldSk: 'fullName',
      label: 'Pełna nazwa firmy',
      type: 'text',
      validation: ['required', {
        method: 'minLength',
        args: [3],
      }],
    }, {
      id: 'shortName',
      dataOldSk: 'shortName',
      label: 'Nazwa skrócona',
      type: 'text',
      validation: ['required', {
        method: 'minLength',
        args: [3],
      }],
    }, {
      id: 'street',
      dataOldSk: 'street',
      label: 'Ulica',
      type: 'text',
      validation: [{
        method: 'minLength',
        args: [3],
      }],
    }, {
      id: 'postcode',
      dataOldSk: 'postalCode',
      label: 'Kod pocztowy',
      type: 'text',
    }, {
      id: 'city',
      dataOldSk: 'city',
      label: 'Miasto',
      type: 'text',
    }, {
      id: 'nip',
      dataOldSk: 'nip',
      label: 'NIP',
      type: 'text',
      valueFormatter: 'only_digits',
      validation: [{
        method: 'minLength',
        args: [9],
      }],
    }, {
      id: 'phone',
      dataOldSk: 'phoneNumber',
      label: 'Telefon',
      type: 'text',
      valueFormatter: 'only_digits',
      validation: [{
        method: 'minLength',
        args: [9],
      }],
    }, {
      id: 'fax',
      dataOldSk: 'faxNumber',
      label: 'Fax',
      type: 'text',
      valueFormatter: 'only_digits',
      validation: [{
        method: 'minLength',
        args: [9],
      }],
    }, {
      id: 'industry',
      dataOldSk: 'industry',
      label: 'Branża',
      type: 'select',
      options: [{
        value: 'industry1',
        label: 'Branża 1',
      }, {
        value: 'industry2',
        label: 'Branża 2',
      }, {
        value: 'industry3',
        label: 'Branża 3',
      }],
    }, {
      id: 'companyType',
      dataOldSk: 'employer',
      label: 'Rodzaj firmy',
      type: 'radio',
      options: [{
        value: 'employer1',
        label: 'Klient-pracodawca',
      }],
    }, {
      id: 'additionalInfo',
      dataOldSk: 'additionalInfo',
      label: 'Informacje dodatkowe',
      type: 'textarea',
    }, {
      id: 'companyFeatureTypes',
      dataOldSk: 'companyFeatureTypes',
      label: 'Funkcjonalności',
      type: 'checkbox',
      options: [
        {
          value: 'option1',
          label: 'Funkcjonalnośc 1',
        },
        {
          value: 'option2',
          label: 'Funkcjonalnośc 2',
        },
        {
          value: 'option3',
          label: 'Funkcjonalnośc 3',
        },
        {
          value: 'option4',
          label: 'Funkcjonalnośc 4',
        },
        {
          value: 'option5',
          label: 'Funkcjonalnośc 5',
        },
        {
          value: 'option6',
          label: 'Funkcjonalnośc 6',
        },
        {
          value: 'option7',
          label: 'Funkcjonalnośc 7',
        },
        {
          value: 'option8',
          label: 'Funkcjonalnośc 8',
        },
        {
          value: 'option9',
          label: 'Funkcjonalnośc 9',
        },
        {
          value: 'option10',
          label: 'Funkcjonalnośc 10',
        },
        {
          value: 'option11',
          label: 'Funkcjonalnośc 11',
        },
        {
          value: 'option12',
          label: 'Funkcjonalnośc 12',
        },
      ],
    }, {
      id: 'activationDelayDays',
      dataOldSk: 'postponeActivationValue',
      label: 'Wstrzymanie aktywacji przez (w dniach)',
      type: 'number',
    }, {
      layout: LAYOUT_TWO_COLUMNS,
      formElements: [
        {
          id: 'layoutInput1',
          label: 'Layout input 1',
          type: 'text',
        },
        {
          id: 'layoutInput2',
          label: 'Layout input 2',
          type: 'text',
        },
        {
          id: 'layoutInput3',
          label: 'Layout input 3',
          type: 'text',
        },
        {
          id: 'layoutInput4',
          label: 'Layout input 4',
          type: 'text',
        },
      ],
    }, {
      id: 'senderEmail',
      dataOldSk: 'emailSender',
      label: 'Nadawca e-maili',
      type: 'text',
    }];
    const tree = renderer
      .create(<FormGroup
        title={title}
        formElements={formElements}
        data={data}
        invalidFields={invalidFields}
        validateField={validateField}
      />)
      .toJSON();

    expect(tree)
      .toMatchSnapshot();
  });

  // describe('Content input', () => {
  //   it('Should capture content correctly onChange', () => {
  //     const content = wrapper.dive().find('input').at(1);
  //     content.instance().value = 'Testing';
  //     content.simulate('change');
  //     expect(setState).toHaveBeenCalledWith('Testing');
  //   });
  // });
});
