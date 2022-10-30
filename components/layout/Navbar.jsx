import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const changeMenuState = () => {
    if (open) setOpen(false)
    else setOpen(true)
  }

  return (
    <div className="fixed inset-x-0 top-0 flex justify-center z-[30] bg-transparent m-auto border-2 mt-10 med:mx-20">
      <div className="flex flex-col opacity-100 text-sm font-outfit cursor-pointer" onClick={() => setOpen(false)}>
        <Link href="/">
          <div className="flex justify-center items-center">
            <img className="h-10" src={`/images/red-spider-lily.png`} alt="odachi" />
            <p className="text-white-90 tracking-widest text-2xl">HOME</p>
          </div>
        </Link>
      </div>
    </div>
  )
}