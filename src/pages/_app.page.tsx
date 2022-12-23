import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { globalStyles } from '../styles/global'

globalStyles()

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
