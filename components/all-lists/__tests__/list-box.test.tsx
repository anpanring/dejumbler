import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ListBox } from '../list-box';
import { ListData } from '@/types/dejumbler-types';
import { SetStateAction } from 'react';
import React from 'react';
import { CurrentListContext } from '@/pages/all-lists';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockListData, mockListMetadata } from 'mocks/testing-utils';

const mockSetCurrentList = jest.fn();
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
