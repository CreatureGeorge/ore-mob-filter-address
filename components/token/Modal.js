import { useEffect, useState } from "react";

import downloadIcon from "../../public/images/icons/download.png"
import cnftjungleIcon from "../../public/images/links/cnftjungle.png"

import externalIcon from "../../public/images/icons/external.png"

import Image from "next/image";
import { utf8ToHex } from "../../lib/base";
import Link from "next/link";

const policyID = `062b1da3d344c1e6208ef908b2d308201e7ff6bcfddf0f606249817f`

export default function Modal({ curToken, showModal, setShowModal }) {
  const [token, setToken] = useState(null)
  const [imgPath, setImgPath] = useState("")
  const [tokenNumber, setTokenNumber] = useState("0000")

  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    (
      async () => {
        if (showModal) {
          await setToken(curToken)
          const CID = curToken.image.substring(7)
          const imgPath = `https://u25.mypinata.cloud/ipfs/${CID}`

          const sortedMetadata = Object.keys(curToken)
            .sort((a, b) => {
              if (a == "Accessories") return 1

              if (a < b)
                return -1;
              if (a > b)
                return 1;
              return 0;
            })
            .reduce((acc, key) => {
              acc[key] = curToken[key];
              return acc
            }, {})

          await setToken(sortedMetadata)
          await setImgPath(imgPath)
          await setTokenNumber(sortedMetadata.name.substring(6))


        } else {
          setShowModal(false)
          setShowInfo(false)
        }
      }
    )()
  }, [showModal])

  const resetModal = async () => {
    setShowModal(false)
    setShowInfo(false)

    setTimeout(() => { setImgPath("") }, 500)
  }



  const modalDescription = () => {
    if (token == null) { return <></> }

    const number = token.name.substring(6)

    return (
      <div className={`grid grid-flow-row grid-row-3 h-full gap-y-2`}>
        <div className="flex flex-col overflow-hidden">
          <div className="bg-chinese-black-50 rounded-xl">
            <div className="font-roboto flex gap-x-1 sm:grid px-4 py-2 text:xs md:text-xl">
              <p className="text-white font-normal">ORE-MOB | <span className="font-extrabold">{token.MOB}</span></p>
              <p className="text-[#B02626] font-extrabold">{`#${number}`}</p>
            </div>
          </div>
          <div className="text-black text-base gap-2 my-3 overflow-hidden scrollbar-thin scrollbar-thumb-white-30 scrollbar-track-white-20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            <div className="grid grid-cols-2 gap-3">
              {
                Object.keys(token).map(trait => {
                  let keyLower = trait.toLowerCase()
                  if (keyLower == "project" || keyLower == "image" || keyLower == "copyright" || keyLower == "mediatype" || keyLower == "name" || keyLower == "accessories" || keyLower == "files" || keyLower == "description") return

                  return (
                    <div key={trait} className="bg-white-30 rounded-md px-1 sm:px-7 py-2 text-chinese-black-75 font-roboto">
                      <p className="font-thin text-xs">{trait}:</p>
                      <p className="font-[500] text-sm">{`${token[trait]}`}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

      </div>
    )
  }

  const externalLinks = () => {
    if (token == null) { return <></> }

    const hexName = utf8ToHex(token.name)

    let cardanoScanLink = `https://cardanoscan.io/token/${policyID}${hexName}`
    let cnftJungleLink = `https://www.cnftjungle.io/collections/${policyID}?assetId=${policyID}.${token.name}`

    return (
      <div className="flex-none grid grid-flow-col truncate gap-x-1 max-h-[40px]">
        <Link className="bg-chinese-black-25 rounded-lg font-roboto px-2 py-2 flex max-h-[35px] items-center gap-x-1" href={`/api/image/${tokenNumber}.jpg`}>
          <div className="relative aspect-square h-full">
            <Image src={downloadIcon} fill />
          </div>
          <p className="text-white font-thin sm:font-bold text-xs">Download</p>
          <div className="relative aspect-square h-0 sm:h-full ml-auto">
            <Image src={externalIcon} fill />
          </div>
        </Link>
        <a className="bg-chinese-black-25 rounded-lg font-roboto px-2 py-2 flex max-h-[35px] items-center gap-x-2" href={`${cnftJungleLink}`} target="_blank" rel="noopener noreferrer">
          <div className="relative aspect-square h-full">
            <Image src={cnftjungleIcon} fill />
          </div>
          <p className="text-white font-bold text-[0px] sm:text-xs">CNFT<span className="font-thin text-xs">Jungle</span></p>
          <div className="relative aspect-square h-0 sm:h-full ml-auto">
            <Image src={externalIcon} fill />
          </div>
        </a>
      </div>
    )
  }

  const desktopModal = () => {
    return (
      <div className={`hidden lg:grid bg-eerie-black drop-shadow-2xl w-[95%] max-w-6xl transform z-100 rounded-xl items-center justify-center overflow-hidden flex-col grid-cols-2 col-start-1 col-end-2 row-start-1 row-end-2`}>
        <div className="grid inset-0 h-full object-contain">
          <Image src={`/images/0000.jpg`} fill="true" alt="goerge" className="object-contain col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 z-0" />
          <img src={imgPath} fill="true" className="object-contain col-start-1 col-end-2 row-start-1 row-end-2 z-10" alt={`token image`} />
          <div className="col-start-1 col-end-2 row-start-1 row-end-2 place-items-center grid z-0">
            <div className="m-2 place-items-center relative w-[7vw] animate-spin grid z-0 opacity-50">
              <img fill="true" src={`/higanbana.svg`} alt="odachi" />
            </div>
          </div>
        </div>
        <div className="overflow-hidden aspect-square col-start-2 col-end-3 z-20">
          <div className=" py-10 px-10 flex flex-col h-full">
            {modalDescription()}
            {externalLinks()}
          </div>

          <button className="text-white-50 w-10 h-10 focus:outline-none absolute z-30 top-0 right-0" onClick={resetModal}>
            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current rotate-45"}></span>
              <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current -rotate-45"}></span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  const mobileModal = () => {
    return (
      <div className={`grid bg-eerie-black w-[95%] sm:w-[85%] md:w-[75%] z-100 rounded-xl items-center justify-center overflow-hidden lg:hidden  col-start-1 col-end-2 row-start-1 row-end-2`}>
        <div className="grid inset-0 h-full object-contain col-start-1 col-end-2 row-start-1 row-end-2 relative z-10 " onClick={resetModal}>
          <Image src={`/images/0000.jpg`} fill="true" alt="goerge" className="object-contain col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 z-0" />
          <img src={imgPath} fill="true" className="object-contain col-start-1 col-end-2 row-start-1 row-end-2 z-10" alt={`token image`} />
          <div className="col-start-1 col-end-2 row-start-1 row-end-2 place-items-center grid z-0">
            <div className="m-2 place-items-center relative min-w-10 w-[14vw] animate-spin grid z-0 opacity-50">
              <img fill="true" src={`/higanbana.svg`} alt="odachi" />
            </div>
          </div>
        </div>
        <div className="grid overflow-hidden col-start-1 col-end-2 row-start-1 row-end-2 aspect-square relative h-full">
          <div className={`overflow-hidden p-2 sm:p-5 transition-all duration-500 ease-in-out ${showInfo ? "opacity-100 bg-white-50 z-20" : "opacity-0 z-0"}`}>
            {modalDescription()}
          </div>
        </div>
        <div className="bg-white-90 p-2 sm:py-5 flex">
          <button className="bg-chinese-black-25 rounded-full p-1 mr-5 focus:outline-none z-30 " onClick={() => { setShowInfo(!showInfo) }}>
            <img src="/images/icons/info.png" />
          </button>
          <div className="grow">
            {externalLinks()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`overflow-hidden z-[30] fixed top-0 left-0 bg-white-100 bg-opacity-80 w-full h-full place-items-center grid transition-all duration-500 ${(showModal == true ? 'visible bg-opacity-50 opacity-100' : 'invisible opacity-0')}`}>
        <div className='w-full h-full col-start-1 col-end-2 row-start-1 row-end-2 border-2' onClick={resetModal} ></div>
        {desktopModal()}
        {mobileModal()}
      </div>
    </>
  )
}