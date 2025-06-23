import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Favicon básico */}
        <link rel="icon" href="/icon/favicon.png" type="image/png" />
        
        {/* Opcional: Para melhor compatibilidade */}
        <link rel="shortcut icon" href="/icon/favicon.png" />
        <link rel="apple-touch-icon" href="/icon/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}