export default function Hello({ name = 'world', onHola }) {
  return (
    <button onClick={onHola} aria-label="hola">
      Hola, {name}
    </button>
  )
}
