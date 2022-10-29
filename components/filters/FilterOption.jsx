import { useEffect, useState } from "react"

export default function FilterOption({ filters, setFilters, option, curOption }) {
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    (
      async () => {
        let description = curOption.description
        let modifiedFilter = filters[option]
        let index = modifiedFilter.indexOf(description);

        if (index > -1) {
          await setSelected(true)
        } else {
          await setSelected(false)
        }
      }
    )()
  }, [filters])

  const modifySelectedOptionFilter = async (description) => {
    let modifiedFilter = filters[option]
    let index = modifiedFilter.indexOf(description);

    if (index > -1) {
      modifiedFilter.splice(index, 1);
      setSelected(false)
    } else {
      modifiedFilter.push(description)
      setSelected(true)
    }

    await setFilters({ ...filters })
  }

  return (
    <div className="flex pb-2 cursor-pointer" onClick={() => modifySelectedOptionFilter(curOption.description)} >
      <div className={`h-5 w-5 border-[1px] border-white-50 mr-3 rounded-lg transition-all duration-500 ease-in-out bg-filter-accent ${selected ? "bg-opacity-75" : "bg-opacity-0"}`}></div>
      <button >
        <p className="text-roboto-condensed uppercase">{curOption.description} <span className="text-white-50 text-roboto">({curOption.count})</span></p>
      </button>
    </div>
  )
}