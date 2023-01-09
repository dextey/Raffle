import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const Connect = () => {
  const { enableWeb3, account, Moralis } = useMoralis()

  const checkConnection = async () => {
    const connected = localStorage.getItem("walletConnect")
    if (connected) {
      await enableWeb3()
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        localStorage.removeItem("walletConnect")
      }
    })
  }, [])

  const connectWallet = async () => {
    localStorage.setItem("walletConnect", true)
    await enableWeb3()
  }

  return (
    <div>
      {account ? (
        <div className="flex px-4 p-2">
          <span className="font-bold font-mono px-4 p-2 rounded-full bg-sky-100">
            {account.slice(0, 10) + "..." + account.slice(35, account.length)}
          </span>
        </div>
      ) : (
        <button
          className="px-4 p-2  bg-blue-200 hover:bg-blue-500  hover:text-white rounded-full font-bold ml-3"
          onClick={connectWallet}
        >
          Connect wallet
        </button>
      )}
    </div>
  )
}

export default Connect
