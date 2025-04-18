import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

jest.mock('next-auth/react');
import { useSession, signIn, signOut } from 'next-auth/react';

const mockUseSession = useSession as jest.Mock;
(signIn as jest.Mock).mockImplementation(() => jest.fn());
(signOut as jest.Mock).mockImplementation(() => jest.fn());

import Home from '../pages/index';
import AllLists from '../pages/all-lists';

describe('Home', () => {
  it('when logged out', () => {
    mockUseSession.mockReturnValue({
      status: 'unauthenticated',
      data: null,
    });

    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }));

    render(<Home />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('when logged in', () => {
    mockUseSession.mockReturnValue({
      status: 'authenticated',
      data: {
        user: {
          name: 'test',
        },
      },
    });

    // useRouter.mockImplementation(() => ({
    //     route: "/all-lists",
    //     pathname: "",
    //     query: "",
    //     asPath: "",
    // }));

    render(<AllLists lists={[]} />);

    screen.debug();

    expect(screen.getByText('All Lists')).toBeInTheDocument();
  });
});
