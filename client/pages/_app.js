import "../styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Raffle</title>
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  )
}

export default MyApp
