import { act } from 'react-test-renderer';

export const wait = (timeout = 100) => act(
  () => new Promise((resolve) => {
    setTimeout(resolve, timeout);
  }),
);

export const waitToLoadMocks = () => wait(100);
