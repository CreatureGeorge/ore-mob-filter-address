import Link from "next/link";

export default function Loading({ loading }) {
  return (
    <div className={`overflow-hidden z-[30] fixed top-0 left-0 bg-white-100 bg-opacity-100 w-full h-full place-items-center grid transition-all duration-500 ${(loading == true ? 'visible bg-opacity-50 opacity-100' : 'invisible opacity-0')}`}>
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 text-black m-2 place-items-center grid z-0">
        <div className="relative w-10 h-10 animate-spin">
          <img fill="true" src={`/higanbana.svg`} alt="odachi" />
        </div>
        <p className="font-thin text-xl mt-2">Loading...</p>
        <Link href="/">
          <div className="flex justify-center items-center">
            <p className="tracking-widest font-thin text-lg lowercase mt-10">return home</p>
          </div>
        </Link>
      </div>
    </div>
  )
}