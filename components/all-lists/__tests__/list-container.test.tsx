import '@testing-library/jest-dom';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import { ListContainer } from '../list-container';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGetList from '@/lib/hooks/useGetList';
import { server } from 'mocks/server';
import { mockListMetadata } from 'mocks/testing-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import TestWrapper from 'mocks/test-wrapper';

const mockSetListData = jest.fn();
const queryClient = new QueryClient();
describe('ListContainer', () => {
  beforeAll(async () => {
    server.listen();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useGetList(mockListMetadata), {
      wrapper,
    });
    await waitFor(() => expect(result.current.data).toBeDefined());
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders', async () => {
    render(
      <TestWrapper queryClient={queryClient}>
        <ListContainer
          currentList={mockListMetadata}
          setCurrentList={mockSetListData}
        />
      </TestWrapper>,
    );

    // Assert
    expect(screen.getByText('I Need to Start a Garden')).toBeInTheDocument();
    expect(screen.getByText("Mother Earth's Plantasia")).toBeInTheDocument();
  });

  it('can edit item', async () => {
    server.use(
      http.post('/api/edit-list-item', ({ request, params, cookies }) => {
        return HttpResponse.json({
          notes: 'Hello, World!',
        });
      }),
    );

    render(
      <TestWrapper queryClient={queryClient}>
        <ListContainer
          currentList={mockListMetadata}
          setCurrentList={mockSetListData}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('I Need to Start a Garden')).toBeInTheDocument();
    expect(screen.getByText("Mother Earth's Plantasia")).toBeInTheDocument();

    // Click the edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons).toHaveLength(2);
    const editButton = editButtons[0];
    await userEvent.click(editButton);

    // Type into the textarea
    const textArea = await screen.findByRole('textbox');
    expect(textArea).toBeInTheDocument();
    await userEvent.type(textArea, 'Hello, World!');

    // Click the save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    await userEvent.click(saveButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText(/hello, world!/i)).toBeInTheDocument();
    });
  });
});
