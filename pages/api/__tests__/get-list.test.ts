/**
 * @jest-environment node
 */
import handler from '../get-list';
import { createMocks } from 'node-mocks-http';
import dbConnect from '../../../lib/mongodb';
import List from '@/models/List';

jest.mock('next-auth', () => {
  const originalModule = jest.requireActual('next-auth');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: 'admin' },
  };
  return {
    __esModule: true,
    ...originalModule,
    getServerSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' };
    }),
  };
});

jest.mock('../../../lib/mongodb', () => jest.fn());

describe('get-list', () => {
  it('should return data with status 200', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '12345',
      },
    });
    List.findById = jest.fn().mockResolvedValue({
      name: 'Mocked List',
      items: [
        {
          name: 'Mocked Item 1',
          type: 'movie',
          year: 2021,
          director: 'Mocked Director',
          artURL: 'https://example.com/mock-image.jpg',
        },
      ],
    });

    await handler(req, res);

    expect(dbConnect).toHaveBeenCalled();
    expect(List.findById).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
  });
});
