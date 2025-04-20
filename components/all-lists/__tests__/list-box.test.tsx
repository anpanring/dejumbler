import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { ListBox } from '../list-box';
import { CurrentListContextType, ListData } from '@/types/dejumbler-types';
import { createContext, SetStateAction } from 'react';
import React from 'react';
import { CurrentListContext } from '@/pages/all-lists';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSetCurrentList = jest.fn();
const mockListData = {
  user: 'test',
  name: 'Test List',
  description: 'This is a test list',
  type: 'Movies' as 'Movies',
  _id: '12345',
  createdAt: '2023-01-01',
  slug: 'test-list',
  items: [{}, {}],
  __v: 0,
};
const mockListMetadata = {
  id: '12345',
  name: 'Test List',
  type: 'Movies' as 'Movies',
};
const queryClient = new QueryClient();

describe('ListBox', () => {
  it('renders', () => {
    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <CurrentListContext.Provider
          value={{
            currentList: mockListMetadata,
            setCurrentList: mockSetCurrentList,
          }}
        >
          <ListBox
            listData={mockListData}
            setListData={function (value: SetStateAction<ListData[]>): void {
              throw new Error('Function not implemented.');
            }}
            selected={false}
          />
        </CurrentListContext.Provider>
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('This is a test list')).toBeInTheDocument();
  });
});
