import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ListContainer } from '../list-container';
import React from 'react';
import { CurrentListContext } from '@/pages/all-lists';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetList from '@/lib/hooks/useGetList';
import { server } from 'mocks/server';

const mockSetCurrentList = jest.fn();
const mockSetListData = jest.fn();

const mockListMetadata = {
  id: '12345',
  name: 'Test List',
  type: 'Movies' as 'Movies',
};
const queryClient = new QueryClient();

describe('ListContainer', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders', async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetList(mockListMetadata), {
      wrapper,
    });
    await waitFor(() => expect(result.current.data).toBeDefined());

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <CurrentListContext.Provider
          value={{
            currentList: mockListMetadata,
            setCurrentList: mockSetCurrentList,
          }}
        >
          <ListContainer
            currentList={mockListMetadata}
            setCurrentList={mockSetListData}
          />
        </CurrentListContext.Provider>
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('I Need to Start a Garden')).toBeInTheDocument();
    expect(screen.getByText("Mother Earth's Plantasia")).toBeInTheDocument();
  });
});
