import { render, screen } from '@testing-library/react'
import Page from './page'

it('renderiza el Home', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument()
})
