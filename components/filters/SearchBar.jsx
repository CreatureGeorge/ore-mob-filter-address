import Image from "next/image"
import searchIcon from "../../public/images/icons/search.svg"

export default function SearchBar({placeholder, setFilters, filters}) {
  const search = (name) => {
    setFilters({
      ...filters,
      name
    })
  }
  return(
    <div className="flex p-1">
      <div className="relative w-7 h-7">
          <Image src={searchIcon} alt="search" fill sizes='100vw' />
      </div>
      <input 
      placeholder={placeholder} 
      className="w-full font-roboto h-7 bg-transparent duration-300 placeholder:text-white-75 text-sm p-2 mb-2 ml-2 focus:border-b-[1px] outline-none focus:border-white-30"
      onKeyUp={e => search(e.target.value)}></input>
    </div>
  )
}