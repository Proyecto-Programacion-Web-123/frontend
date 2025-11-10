import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hello from './Hello'

describe('Hello (accesibilidad)', () => {
  it('dispara onHola al presionar Enter y Space', async () => {
    const user = userEvent.setup()
    const onHola = vi.fn()

    render(<Hello name="Lu" onHola={onHola} />)

    const btn = screen.getByRole('button', { name: /hola/i })
    btn.focus()

    // Enter
    await user.keyboard('{Enter}')
    // Space
    await user.keyboard(' ')
    expect(onHola).toHaveBeenCalledTimes(2)
  })
})
