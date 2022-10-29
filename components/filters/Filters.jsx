import SearchBar from "./SearchBar"
import Filter from "./Filter"

export default function Filters({ filters, setFilters, filterOptions }) {
  return (
    <div className="flex flex-col overflow-hidden h-full w-full ">
      <SearchBar placeholder={`Search by serial . . .`} filters={filters} setFilters={setFilters} ></SearchBar>
      <div className="scrollbar-thin scrollbar-thumb-white-0 scrollbar-track-white-0 scrollbar-thumb-rounded-full scrollbar-track-rounded-full w-full h-full ">
        {
          Object.keys(filterOptions).map(key => {
            let filterOption = filterOptions[key]
            return <Filter key={key} filters={filters} setFilters={setFilters} option={key} options={filterOption} />
          })
        }
      </div>
    </div>
  )
}