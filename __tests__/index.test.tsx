import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

import Home from '../pages/index';
import { server } from 'mocks/server';

describe('Home', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('when logged out', async () => {
    await act(async () => render(<Home />));
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
