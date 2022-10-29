import { useEffect, useState } from "react"
import FilterOption from "./FilterOption"
import SearchBar from "./SearchBar"

export default function Filter({ filters, setFilters, option, options }) {  
  const [show, setShow] = useState(false)

  const [searchOption, setSearchOption] = useState("")

  const [fullOptions, setFullOptions] = useState([])
  const [filteredOptions, setFilteredOptions] = useState([])

  useEffect(() => {
    (
      async () => {
        await setFullOptions(options)
        await setFilteredOptions(options)
      }
    )()
  },[])

  useEffect(() => {
    let searchOptions = fullOptions.filter(curOption => {
      if (searchOption == "") return true
      let s = (searchOption.toString()).toLowerCase()
      return (curOption.description.toLowerCase().includes(s))
    })

    setFilteredOptions(searchOptions)
  }, [searchOption])

  return (
    <div className="text-white uppercase overflow-hidden pb-2">
      <div onClick={() => setShow(!show)} className="flex hover:cursor-pointer items-center border-b-[1px] border-dashed py-0 w-full uppercase text-xs md:text-base font-roboto-condensed z-10">
        <p className={`transition-all duration-500 ease-in-out z-10 w-full text-white-75 ${(!show) ? "font-normal" : "font-bold"}`}>{option}</p>
        <div className="text-white-50 w-10 h-10 focus:outline-none z-30 relative">
            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span aria-hidden="true" className={`block absolute h-0.5 w-5 bg-current transition-all duration-500 ease-in-out ${(!show) ? "rotate-90" : "rotate-180 opacity-0" } `}></span>
              <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current -rotate-180"}></span>
            </div>
          </div>
      </div>
      <div className={`rounded-l-xl scrollbar-thin scrollbar-thumb-white-30 scrollbar-track-white-20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full text-xs bg-chinese-black-25 p-1 text-white-75 z-0 transition-all duration-500 ease-in-out ${(!show) ? 'invisible opacity-0 -translate-y-10 h-0' : 'visible opacity-100 translate-y-0 h-auto max-h-[400px] mt-2 '}`}>
        <SearchBar placeholder={`Search for specific ${option} . . .`} setFilters={setSearchOption}/>
        {
          filteredOptions.map(curOption => {
            return (
              <FilterOption key={curOption.description} filters={filters} setFilters={setFilters} option={option} curOption={curOption}/>
            )
          })
        }
      </div>
    </div>
  )
}