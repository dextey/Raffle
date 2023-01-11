import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ABI, CONTRACT_ADDRESSES } from "../constants"

const RaffleEntry = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)

  const raffleAddress = chainId in CONTRACT_ADDRESSES ? CONTRACT_ADDRESSES[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  useEffect(() => {
    ;(async () => {
      if (isWeb3Enabled) {
        const fee = await getEntranceFee()
        setEntranceFee(fee)
      }
    })()
  }, [isWeb3Enabled])

  return (
    <div className="flex flex-col mt-10 sm:flex-row  justify-between ">
      {raffleAddress ? (
        <>
          <div className="p-8 bg-slate-100 text-[1.4rem] rounded-lg px-28">
            <span>Entrace Fee {ethers.utils.formatEther(entranceFee)} ETH</span>
            <button
              className="p-4 w-full mt-5 rounded-md bg-slate-300"
              onClick={async () => {
                await enterRaffle()
              }}
            >
              Enter
            </button>
          </div>
          <div className="flex   flex-col p-4 text-[1.3rem]">
            <span>Contract Address : </span>
            <span>Next date:</span>
          </div>
          <div></div>
        </>
      ) : (
        <div className="p-2 px-9 rounded-lg bg-blue-100 text-[1.2rem">
          Raffle is not available in this newtwork
        </div>
      )}
    </div>
  )
}

export default RaffleEntry
