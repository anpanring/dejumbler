import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ListItem from '../../list-item';
import React from 'react';
import { CurrentListContext } from '@/pages/all-lists';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSetCurrentList = jest.fn();
const mockListMetadata = {
  id: '12345',
  name: 'Test List',
  type: 'Movies' as 'Movies',
};
const queryClient = new QueryClient();

describe('ListItem', () => {
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
          <ListItem
            itemData={{ name: 'Test Item', notes: 'test notes' }}
            listMetadata={mockListMetadata}
            view="list"
          />
        </CurrentListContext.Provider>
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Notes: test notes')).toBeInTheDocument();
  });
});
