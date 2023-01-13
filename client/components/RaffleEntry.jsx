import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ABI, CONTRACT_ADDRESSES } from "../constants"

const RaffleEntry = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)

  const raffleAddress = chainId in CONTRACT_ADDRESSES ? CONTRACT_ADDRESSES[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")

  const [numPlayers, setNumPlayers] = useState(0)
  const [recentWinner, setRecentWinner] = useState("0x0")
  const [raffleState, setRaffleState] = useState(0)

  const [loading, setLoading] = useState(false)

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
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  const { runContractFunction: getRaffleState } = useWeb3Contract({
    abi: ABI,
    contractAddress: raffleAddress,
    functionName: "getRaffleState",
    params: {},
  })

  const getData = async () => {
    if (isWeb3Enabled) {
      const fee = await getEntranceFee()
      const numofPlayers = await getNumberOfPlayers()
      const winner = await getRecentWinner()
      const state = await getRaffleState()
      setNumPlayers(numofPlayers.toString())
      setEntranceFee(fee)
      setRecentWinner(winner)
      setRaffleState(state)
    }
  }

  useEffect(() => {
    getData()
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    await tx.wait(1)
    console.log(tx)
    getData()
    setLoading(false)
  }

  return (
    <div className="flex flex-col mt-10 sm:flex-row  justify-between ">
      {raffleAddress ? (
        <>
          <div className="p-8 bg-slate-100 text-[1.4rem] rounded-lg px-28">
            <span>Entrace Fee {ethers.utils.formatEther(entranceFee)} ETH</span>
            <div className="flex justify-center items-center mt-5 rounded-md bg-slate-300 p-4">
              {loading ? (
                <div className=" border-white border-b-2 h-8 w-8  rounded-full animate-spin"></div>
              ) : (
                <div
                  className="p-2 w-full text-center "
                  onClick={async () => {
                    setLoading(true)
                    await enterRaffle({
                      onSuccess: handleSuccess,
                      onError: (error) => {
                        setLoading(false)
                        console.log(error)
                      },
                    })
                  }}
                >
                  Enter
                </div>
              )}
            </div>
          </div>
          <div className="flex   flex-col p-4 text-[1.3rem]">
            <span>Contract Address : {raffleAddress}</span>
            <span>Total Players : {numPlayers}</span>
            <span>Recent Winner : {recentWinner}</span>
            <span>RaffleState : {raffleState}</span>
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
