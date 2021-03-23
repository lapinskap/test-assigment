import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ExportButton from './exportButton';
import '../../tests/setupTests';
import { clearSessionData, initSession } from '../../utils/RoleBasedSecurity/Session';
import { waitToLoadMocks } from '../../tests/helpers';

describe('exportButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
    clearSessionData();
  });

  test('export page', async () => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    const fetchSpy = jest.fn((path) => {
      expect(path).toBe('/test_path?itemsPerPage=20&page=2&order%5BsortA%5D=desc');
      return Promise.resolve({
        ok: true,
        blob: () => {},
      });
    });
    global.fetch = fetchSpy;
    global.window.URL = {
      createObjectURL: () => {},
    };
    initSession();

    const { container } = render(<ExportButton
      service="test"
      path="/test_path"
      fileName="test_filename"
      permissions="test_permission"
      filters={[]}
      sort={{
        key: 'sortA',
        value: 'desc',
      }}
      page={2}
      pageSize={20}
    />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);
    await waitToLoadMocks();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  test('export filtered', async () => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    const fetchSpy = jest.fn((path) => {
      expect(path).toBe('/test_path?itemsPerPage=150000&test=1234');
      return Promise.resolve({
        ok: true,
        blob: () => {},
      });
    });
    global.fetch = fetchSpy;
    global.window.URL = {
      createObjectURL: () => {},
    };
    initSession();

    const { container } = render(<ExportButton
      service="test"
      path="/test_path"
      fileName="test_filename"
      permissions="test_permission"
      filters={[{
        id: 'test',
        value: 1234,
      }]}
      sort={null}
      page={2}
      pageSize={20}
    />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[2]);
    await waitToLoadMocks();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  test('block filtered when no filters', async () => {
    const fetchSpy = jest.fn();

    const { container } = render(<ExportButton
      service="test"
      path="/test_path"
      fileName="test_filename"
      permissions="test_permission"
      filters={[]}
      sort={null}
      page={2}
      pageSize={20}
    />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[2]);
    await waitToLoadMocks();
    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });
  test('export all', async () => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    const fetchSpy = jest.fn((path) => {
      expect(path).toBe('/test_path?itemsPerPage=150000');
      return Promise.resolve({
        ok: true,
        blob: () => {},
      });
    });
    global.fetch = fetchSpy;
    global.window.URL = {
      createObjectURL: () => {},
    };
    initSession();

    const { container } = render(<ExportButton
      service="test"
      path="/test_path"
      fileName="test_filename"
      permissions="test_permission"
      filters={[{
        id: 'test',
        value: 1234,
      }]}
      sort={null}
      page={2}
      pageSize={20}
    />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[3]);
    await waitToLoadMocks();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  test('export filtered with additionalFilters', async () => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    const fetchSpy = jest.fn((path) => {
      expect(path).toBe('/test_path?itemsPerPage=150000&test=1234&name=test');
      return Promise.resolve({
        ok: true,
        blob: () => {},
      });
    });
    const handleAdditionalFiltersSpy = jest.fn((filters) => {
      expect(filters.length).toBe(1);
      return [
        { id: 'name', value: 'test' },
      ];
    });
    global.fetch = fetchSpy;
    global.window.URL = {
      createObjectURL: () => {},
    };
    initSession();

    const { container } = render(<ExportButton
      service="test"
      path="/test_path"
      fileName="test_filename"
      permissions="test_permission"
      filters={[{
        id: 'test',
        value: 1234,
      }]}
      sort={null}
      page={2}
      pageSize={20}
      handleAdditionalFilters={handleAdditionalFiltersSpy}
    />);
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[2]);
    await waitToLoadMocks();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(handleAdditionalFiltersSpy).toHaveBeenCalledTimes(1);
  });
});
