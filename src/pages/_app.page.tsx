import type { AppProps } from 'next/app'

import { globalStyles } from '../styles/global'

globalStyles()

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  return <Component {...pageProps} />
}
