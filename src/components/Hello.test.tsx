import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hello from './Hello'

it('muestra el nombre y dispara onHola', async () => {
  const user = userEvent.setup()
  const fn = vi.fn()

  render(<Hello name="Lu" onHola={fn} />)

  // El accessible name viene del aria-label="hola"
  const btn = screen.getByRole('button', { name: /hola/i })
  expect(btn).toBeInTheDocument()

  // Verifica también el texto visible
  expect(btn).toHaveTextContent(/hola,\s*lu/i)

  await user.click(btn)
  expect(fn).toHaveBeenCalledTimes(1)
})
