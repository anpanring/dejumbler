import '@testing-library/jest-dom';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import { SearchBar } from 'components/search';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from 'mocks/server';
import { mockListMetadata } from 'mocks/testing-utils';
import userEvent from '@testing-library/user-event';

const queryClient = new QueryClient();

describe('SearchBar', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders', async () => {
    render(<SearchBar listContext={mockListMetadata} />);
  });

  it('can search', async () => {
    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <SearchBar listContext={mockListMetadata} />
      </QueryClientProvider>,
    );

    const searchInput: HTMLInputElement =
      screen.getByPlaceholderText(/Search movies/);
    expect(searchInput).toBeInTheDocument();
    searchInput.focus();
    await userEvent.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('The Brand New Testament')).toBeInTheDocument();
    });
  });
});
