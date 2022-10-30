import Head from 'next/head'
import { useState } from 'react'
import AddressSearchBar from '../components/AddressSearchBar'

export default function Home() {
  const [address, setAddress] = useState("")

  return (
    <div className={``}>
      <Head>
        <title>Ore Explorer - Address - by Odachi</title>
        <meta name="description" content="Address filter for Ore-mob" />
        <link rel="icon" href="/images/red-spider-lily.ico" />
      </Head>

      <main className={`flex flex-col min-h-screen justify-center items-center relative`}>
        <AddressSearchBar placeholder={`please search a valid address . . .`} setAddress={setAddress} />
        <div className="animate-pulse absolute z-0">
          <img fill="true" src={`/images/red-spider-lily.png`} alt="odachi" />
        </div>
      </main>
    </div>
  )
}