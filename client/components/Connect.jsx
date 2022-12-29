import { useMoralis } from "react-moralis"

const Connect = () => {
  const { enableWeb3, account } = useMoralis()

  return (
    <div>
      {account ? (
        <div>{account}</div>
      ) : (
        <button
          className="px-4 p-2  bg-blue-200 hover:bg-blue-500  hover:text-white rounded-full font-bold ml-3"
          onClick={async () => {
            await enableWeb3()
          }}
        >
          Connect wallet
        </button>
      )}
    </div>
  )
}

export default Connect
