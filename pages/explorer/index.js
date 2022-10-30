import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Image from "next/image";
import { getHolders, getTokens, returnStakeAddressFromBech32 } from "../../lib/base";
import { useRouter } from "next/router";

import filterImg from "../../public/images/icons/filter.png"
import resetImg from "../../public/images/icons/reset.png"
import closeImg from "../../public/images/icons/close.png"

import Card from "../../components/token/Card";
import Filters from "../../components/filters/Filters";
import Modal from "../../components/token/Modal";

const policyID = `062b1da3d344c1e6208ef908b2d308201e7ff6bcfddf0f606249817f`

const sortTokens = (array) => {
  return array.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

const grabAllOptions = (options, curToken, prefix = "") => {
  Object.keys(curToken).map((key) => {
    let keyValue = ""

    let keyUpper = key.toLowerCase()
    if (keyUpper == "image" || keyUpper == "name" || keyUpper == "copyright" || keyUpper == "project" || keyUpper == "mediatype" || keyUpper == "files" || keyUpper == "description") return

    if (prefix != "")
      keyValue = `${prefix}.${key}`
    else
      keyValue = key

    if (typeof curToken[key] === 'object') {
      grabAllOptions(options, curToken[key], key)
      return
    }
    if (options[keyValue]) {
      let option = options[keyValue].find(o => o.description === curToken[key])
      if (!option)
        options[keyValue].push({ description: curToken[key], count: 1 })
      else
        option.count++
    } else {
      options[keyValue] = [{ description: curToken[key], count: 1 }]
    }
  })
}

export default function Explorer({ _address, _showntokens, _filters, _options }) {
  const router = useRouter()

  const [allTokens, setAllTokens] = useState([])
  const [shownTokens, setShownTokens] = useState([])
  const [filteredTokens, setFilteredTokens] = useState([])
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const [filters, setFilters] = useState([])
  const [filterOptions, setFilterOptions] = useState([])
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0)

  const [hasMore, setHasMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [curToken, setCurToken] = useState(null)

  const getMoreTokens = async () => {
    const newTokens = filteredTokens.slice(shownTokens.length, shownTokens.length + 13)
    setShownTokens((shownTokens) => [...shownTokens, ...newTokens])
  }

  useEffect(() => {
    (
      async () => {
        if (!router.isReady) return;

        if (!router.query.address) {
          router.push('/')
          setInvalid(true)   
        } else {
          let address = await returnStakeAddressFromBech32(router.query.address)

          const tokens = await getTokens(address)

          if (tokens == 'invalid-address') {
            router.push('/')
            setInvalid(true)
            return
          }

          setAllTokens(tokens)
          setFilteredTokens(tokens)
          setShownTokens(tokens.slice(0, 48))

          let options = {}
          let filters = { name: "" }

          tokens.map(
            (token) => {
              grabAllOptions(options, token)
            }
          )

          Object.keys(options).map(key => {
            filters[key] = []
          })

          setFilters(filters)
          setFilterOptions(options)
        }
      }
    )()
  }, [router.isReady])

  useEffect(() => {
    let empty = true

    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) empty = false
    });

    let tokens = allTokens

    if (tokens.length == 0) return

    if (!empty) {
      tokens = allTokens.filter(token => {
        let foundAll = true

        let number = token.name.substring(6)

        if (number == Number(filters.name) && filters.name != "") {
          return true
        } else if (number != Number(filters.name) && filters.name != "") {
          return false
        }

        Object.keys(filters).map(trait => {
          if (trait == "name" || filters[trait].length == 0 || !foundAll) return

          let traitArray = trait.split('.')

          let traitFound = false

          filters[trait].forEach(filterTrait => {
            if (traitArray.length == 1 && token[trait]) {
              if (token[trait] == filterTrait) traitFound = true
            } else if (traitArray.length > 1 && token[traitArray[0]]) {
              if (token[traitArray[0]][traitArray[1]]) {
                if (token[traitArray[0]][traitArray[1]] == filterTrait) traitFound = true
              }
            }
          });

          foundAll = traitFound
        })

        return foundAll
      })
    }

    let filterCount = 0

    Object.keys(filters).map(trait => {
      if (trait == "name") return

      filterCount += filters[trait].length
    })

    sortTokens(tokens)

    setAppliedFiltersCount(filterCount)
    setFilteredTokens(tokens)

    setShownTokens(tokens.slice(0, 48))
  }, [filters])

  useEffect(() => {
    setHasMore((filteredTokens.length > shownTokens.length) ? true : false)
  }, [shownTokens, filteredTokens])

  const selectedFilters = () => {
    let userSelectedFilters = []

    Object.keys(filters).map(trait => {
      if (trait == "name") return
      if (filters[trait] == []) return

      filters[trait].forEach(filterTrait => {

        userSelectedFilters.push({ trait: trait, option: filterTrait })
      })
    })

    return (
      <div className="grid grid-flow-col gap-x-1 content-center ml-2 overflow-hidden overflow-x-auto scrollbar-thin">
        {
          userSelectedFilters.map(selectedFilter => {
            return (
              <button onClick={() => removeFilter(selectedFilter)} className="flex flex-nowrap items-center border-[1px] rounded-xl px-2 py-1 text-xs text-center w-auto max-h-[25px] " key={`${selectedFilter.trait}.${selectedFilter.option}`}>
                <p className="font-bold whitespace-nowrap">{selectedFilter.trait} : <span className="font-normal">{selectedFilter.option}</span></p>
                <div className="w-3 h-3 relative ml-1">
                  <Image src={closeImg} alt="close" />
                </div>
              </button>
            )
          })
        }
      </div>
    )
  }

  const removeFilter = async (filter) => {
    let modifiedFilter = filters[filter.trait]
    let index = modifiedFilter.indexOf(filter.option);

    if (index > -1) {
      modifiedFilter.splice(index, 1);
    }

    await setFilters({ ...filters })
  }

  const resetFilter = () => {
    Object.keys(filters).map(trait => {
      if (trait == "name") {
        filters[trait] = ""
        return
      } else {
        filters[trait] = []
      }

      setFilters({ ...filters })
    })
  }

  const showMobileFilterMenu = () => {
    return (
      <div className={`grid grid-cols-1 bg-white-100 place-items-end h-screen w-full fixed z-[70] pointer transition-all duration-500 ${showMobileFilter ? 'visible bg-opacity-50 opacity-100' : 'invisible opacity-0'} `}>
        <div className='w-full h-full col-start-1 col-end-2 row-start-1 row-end-2' onClick={() => setShowMobileFilter(!showMobileFilter)} ></div>
        <div className={`bg-eerie-black p-3 h-full overflow-hidden flex flex-col col-start-1 col-end-2 row-start-1 row-end-2 transition-all duration-500 ${showMobileFilter ? 'min-w-[30px] max-w-[320px] w-[100vw] sm:max-w-[100vw] sm:w-[70vw] md:w-[50%] bg-opacity-80 opacity-100' : 'opacity-0 w-0 max-w-0'}`}>
          <div className="flex justify-between border-b-[1px] mb-2 pb-2 border-white-30">
            <h3 className="text-xl font-roboto-condensed text-white-75">Filters</h3>
            <button className="text-white-50 w-10 h-10 focus:outline-none absolute z-30 top-0 right-0 m-1" onClick={() => setShowMobileFilter(!showMobileFilter)}>
              <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current rotate-45"}></span>
                <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current -rotate-45"}></span>
              </div>
            </button>
          </div>
          <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-white-30 scrollbar-track-white-20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}>
            <Filters filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
          </div>
        </div>
      </div >
    )
  }

  return (
    <>
      <div className="flex h-screen w-[full] mx-auto justify-center items-left font-roboto uppercase text-white-90">
        <div className="grid w-[90%] pt-[40px] content-start">
          <div className="flex justify-between items-center overflow-hidden mb-3">
            <h3 className="font-roboto-condensed font-bold text-white lg:block hidden lg:text-3xl">Filters</h3>
            <div className="flex justify-between w-full lg:justify-end">
              <h3 className="font-roboto font-bold text-white md:text-3xl lg:text-4xl text-[0px] md:block">{`ORE-MOB `}<span className="text-crimson text-3xl" >{`| ${filteredTokens.length}`}</span></h3>
              <div className="flex">
                <button title="Reset filters" className="flex items-center p-2 w-10 h-10 focus:outline-none" onClick={() => resetFilter()}>
                  <div className="w-8 h-8 relative">
                    <Image src={resetImg} alt="reset filters" />
                  </div>
                </button>
                <button title="Filters" className="flex items-center p-2 w-10 h-10 focus:outline-none lg:hidden" onClick={() => setShowMobileFilter(!showMobileFilter)}>
                  <div className="w-8 h-8 relative">
                    <Image src={filterImg} alt="filter" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-flow-col overflow-hidden">
            <div className="border-t-[1px] border-white-50 pt-3 mr-4 lg:grid items-start hidden lg:h-full pr-1 lg:w-[25vw] overflow-hidden">
              <Filters filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
            </div>
            <div className="flex flex-col overflow-hidden border-t-[1px] pt-3 lg:w-[63.5vw] border-white-50">
              <div className="flex mb-1">
                <h3 className="text-roboto-condensed whitespace-nowrap">Filters <span className="border-[1px] px-1 rounded-lg font-thin bg-white-20">{appliedFiltersCount}</span></h3>
                {selectedFilters()}
              </div>
              <div id="scrollableDiv" className="grid overflow-y-visible mb-2 pr-4 scrollbar-thin scrollbar-thumb-white-30 scrollbar-track-white-20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <InfiniteScroll
                  dataLength={undefined ? 0 : shownTokens.length}
                  next={getMoreTokens}
                  className="grid w-full h-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2 pt-2 px-2"
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b className="opacity-10"></b>
                    </p>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {
                    (shownTokens != [])
                      ?
                      shownTokens.map(token => {
                        return <Card key={token.name} token={token} setShowModal={setShowModal} setCurToken={setCurToken} />
                      })
                      :
                      <></>
                  }
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
        <Modal className="z-[30]" showModal={showModal} setShowModal={setShowModal} curToken={curToken}/>
        {showMobileFilterMenu()}
      </div>
    </>
  )
}