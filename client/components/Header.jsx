import Connect from "./Connect"
import Link from "next/link"

const Header = () => {
  return (
    <div className="w-full h-20 bg-slate-200  flex justify-between items-center ">
      <span className="mx-7 text-4xl font-bold">Raffle</span>
      <div className="flex gap-4 text-xl text-bold m-10 items-center font-medium">
        <span>
          <Link href={"/"}> #home </Link>{" "}
        </span>
        <span>
          <Link href={"/rules"}>#rules</Link>
        </span>
        <Connect />
      </div>
    </div>
  )
}

export default Header
