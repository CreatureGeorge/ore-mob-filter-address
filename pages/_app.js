import Layout from '../components/layout/Layout'
import { Analytics } from '@vercel/analytics/react';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex w-full min-h-full bg-eerie-black">
      <Layout >
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </div>
  )
}

export default MyApp
