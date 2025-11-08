import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'TERMN',
  description: 'Where all games converge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/iconono.png" type="image/png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900&family=Monoton&family=Orbitron:wght@400..900&family=Rubik+Mono+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400&display=swap" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/f098ca90ec.js" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
