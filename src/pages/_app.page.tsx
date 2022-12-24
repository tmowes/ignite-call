import '../libs/dayjs'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { QueryClientProvider } from '@tanstack/react-query'

import { globalStyles } from '../styles/global'
import { queryClient } from '../libs/react-query'

globalStyles()

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
