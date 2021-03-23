import renderer from 'react-test-renderer';
import {
  getEditableCell,
  getToggleSwitchCell,
  getEditableSelectCell,
  getEditableCheckboxesCell,
} from './editableCells';
import '../../tests/setupTests';

describe('<getEditableCell />', () => {
  let componentRenderer; let data; let updateData; const type = 'text'; let disableDependsOn = null; let
    cellInfo;

  beforeEach(() => {
    data = [
      {
        randomField: 'Random value',
      },
    ];
    updateData = () => ({});
    cellInfo = {
      index: 0,
      column: {
        id: 'randomField',
      },
    };
    componentRenderer = getEditableCell(data, updateData, type, disableDependsOn);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with disableDependsOn prop', () => {
    disableDependsOn = true;
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('<getToggleSwitchCell />', () => {
  let componentRenderer; let data; let updateData; const type = 'text'; const disableDependsOn = null; let
    cellInfo;

  beforeEach(() => {
    data = [
      {
        style: undefined,
        id: 1,
      },
    ];
    updateData = () => ({});
    cellInfo = {
      index: 0,
      column: {
        id: 1,
      },
    };
    componentRenderer = getToggleSwitchCell(data, updateData, type, disableDependsOn);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('<getEditableSelectCell />', () => {
  let componentRenderer; let data; let updateData; let options = []; let
    cellInfo;

  beforeEach(() => {
    data = [
      { isEnabled: 1 },
    ];
    updateData = () => ({});
    cellInfo = {
      index: 0,
      column: {
        id: 'isEnabled',
      },
    };
    options = [
      { value: 0, label: 'Nie' },
      { value: 1, label: 'Tak' },
    ];
    componentRenderer = getEditableSelectCell(data, updateData, options);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('<getEditableCheckboxesCell />', () => {
  let componentRenderer; let data; let updateData; let options = []; let
    cellInfo;

  beforeEach(() => {
    data = [
      { features: ['option_1', 'option_2'] },
    ];
    updateData = () => ({});
    cellInfo = {
      index: 0,
      column: {
        id: 'features',
      },
    };
    options = [
      { value: 'option_1', label: 'Opcja 1' },
      { value: 'option_2', label: 'Opcja 2' },
      { value: 'option_3', label: 'Opcja 3' },
    ];
    componentRenderer = getEditableCheckboxesCell(data, updateData, options);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with props', () => {
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without data prop', () => {
    data = [];
    const tree = renderer
      .create(componentRenderer(cellInfo))
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
