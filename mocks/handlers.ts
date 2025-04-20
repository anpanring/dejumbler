import { http, HttpResponse } from 'msw';

const mockListItem = {
  __t: 'Album',
  _id: '664e3b7dc2899c9861398ff2',
  artURL: 'https://i.scdn.co/image/ab67616d0000b2732590c2d33bd70c8bf059591b',
  artist: 'Haley Heynderickx',
  name: 'I Need to Start a Garden',
  status: 'todo',
};

const mockListItem2 = {
  __t: 'Album',
  _id: '664e3ba4c2899c98613990a8',
  artURL: 'https://i.scdn.co/image/ab67616d0000b27319112975fac887f75c0b095b',
  artist: 'Mort Garson',
  name: "Mother Earth's Plantasia",
  status: 'todo',
};

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
];
