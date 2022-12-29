import Connect from "./Connect"

const Header = () => {
  return (
    <div className="w-full h-20 bg-slate-200  flex justify-between items-center ">
      <span className="mx-7 text-4xl font-bold">Raffle</span>
      <div className="flex gap-2 text-xl text-bold m-10 items-center">
        <span>home</span>
        <span>rules</span>
        <Connect />
      </div>
    </div>
  )
}

export default Header
