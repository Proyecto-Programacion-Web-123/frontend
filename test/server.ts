import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  // ejemplo: mock para GET /api/ping
  http.get('/api/ping', () => HttpResponse.json({ ok: true })),

  // ejemplo: mock a tu backend local
  // http.get('http://localhost:3000/products', () => HttpResponse.json([{ id:1, name:'Zelda'}])),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
