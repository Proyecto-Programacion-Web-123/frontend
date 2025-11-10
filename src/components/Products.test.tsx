import { render, screen } from '@testing-library/react'
import { server } from '@/../test/server'
import { http, HttpResponse } from 'msw'
import Products from './Products'

it('lista los productos', async () => {
  server.use(
    http.get('/api/products', () => HttpResponse.json([{ id:1, name:'Zelda' }]))
  )
  render(<Products />)
  expect(await screen.findByText(/Zelda/i)).toBeInTheDocument()
})
