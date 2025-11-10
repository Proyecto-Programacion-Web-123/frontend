import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Products from './Products'


const server = setupServer(
  http.get('/api/products', () =>
    HttpResponse.json({ message: 'boom' }, { status: 500 })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Products (errores)', () => {
  it('muestra un mensaje/alerta cuando el API falla', async () => {
    render(<Products />)
    const alert = await screen.findByText(/error|falló|inténtalo de nuevo/i)
    expect(alert).toBeInTheDocument()
  })
})
