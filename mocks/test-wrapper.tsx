import { CurrentListContext } from "@/pages/all-lists";
import { QueryClientProvider } from "@tanstack/react-query";
import { mockListMetadata } from 'mocks/testing-utils';

const mockSetCurrentList = jest.fn();

const TestWrapper = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentListContext.Provider
        value={{
          currentList: mockListMetadata,
          setCurrentList: mockSetCurrentList,
        }}
      >
        {children}
      </CurrentListContext.Provider>
    </QueryClientProvider>
  );
};

export default TestWrapper;
