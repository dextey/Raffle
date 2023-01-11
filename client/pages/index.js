import Header from "../components/Header"
import RaffleEntry from "../components/RaffleEntry"

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="py-5">
          <div className="text-[4rem] font-medium">Welcome to Raffle</div>
          <div>
            <p className="text-[1.3rem] pt-6">
              Enter the raffle and get a chance to win ETHs every week
            </p>
          </div>

          <RaffleEntry />
        </div>
      </div>
    </>
  )
}
