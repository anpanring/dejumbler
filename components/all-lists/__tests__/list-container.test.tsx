import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ListContainer } from '../list-container';
import { CurrentListContextType, ListData } from '@/types/dejumbler-types';
import { createContext, SetStateAction } from 'react';
import React from 'react';
import { CurrentListContext } from '@/pages/all-lists';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSetCurrentList = jest.fn();
const mockSetListData = jest.fn();
const mockListItem = {
  __t: 'Album',
  _id: '664e3b7dc2899c9861398ff2',
  artURL: 'https://i.scdn.co/image/ab67616d0000b2732590c2d33bd70c8bf059591b',
  artist: 'Haley Heynderickx',
  name: 'I Need to Start a Garden',
  status: 'todo',
};
const mockListData = [
  {
    user: 'test',
    name: 'Test List',
    description: 'This is a test list',
    type: 'Movies' as 'Movies',
    _id: '12345',
    createdAt: '2023-01-01',
    slug: 'test-list',
    items: [mockListItem, mockListItem],
    __v: 0,
  },
];
const mockListMetadata = {
  id: '12345',
  name: 'Test List',
  type: 'Movies' as 'Movies',
};
const queryClient = new QueryClient();

describe('ListContainer', () => {
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
          <ListContainer lists={mockListData} setListData={mockSetListData} />
        </CurrentListContext.Provider>
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('This is a test list')).toBeInTheDocument();
  });

  it('open list', async () => {
    const user = userEvent.setup();

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <CurrentListContext.Provider
          value={{
            currentList: mockListMetadata,
            setCurrentList: mockSetCurrentList,
          }}
        >
          <ListContainer lists={mockListData} setListData={mockSetListData} />
        </CurrentListContext.Provider>
      </QueryClientProvider>,
    );

    // Assert
    const listLink = screen.getByText('Test List');
    expect(listLink).toBeInTheDocument();
    expect(screen.getByText('This is a test list')).toBeInTheDocument();

    await user.click(listLink);
    expect(mockSetCurrentList).toHaveBeenCalledWith(mockListMetadata);
  });
});
