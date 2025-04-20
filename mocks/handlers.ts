import { http, HttpResponse } from 'msw';
import {
  mockListItem,
  mockListItem2,
  mockSearchResults,
} from './testing-utils';

export const handlers = [
  http.get('/api/get-list', ({ request, params, cookies }) => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      user: 'test',
      name: 'Test List',
      description: 'This is a test list',
      type: 'Movies' as 'Movies',
      _id: '12345',
      createdAt: '2023-01-01',
      slug: 'test-list',
      items: [mockListItem, mockListItem2],
      __v: 0,
    });
  }),

  http.get('/api/search', ({ request, params, cookies }) => {
    return HttpResponse.json(mockSearchResults);
  }),
];
