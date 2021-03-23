import { renderHook } from '@testing-library/react-hooks';
import useCities from './useCities';
import { waitToLoadMocks } from '../../../tests/helpers';

const mockCities = ['Warszawa', 'Wrocław', 'Kraków'];

describe('useCities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns cities options options', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCities),
    }));
    const { result } = renderHook(() => useCities(true));
    await waitToLoadMocks();
    expect('value' in result.current[0] && 'label' in result.current[0]).toBeTruthy();
  });
  it('returns cities array', async () => {
    global.fetch = jest.fn((urlPath, options) => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCities),
    }));
    const { result } = renderHook(() => useCities());
    await waitToLoadMocks();
    expect(typeof result.current[0] === 'string').toBeTruthy();
  });
});
