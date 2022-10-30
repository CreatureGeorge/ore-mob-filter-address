export default function Card({ token, setShowModal, setCurToken }) {
  //const router = useRouter();

  const tokenNumber = token.name.substring(6)
  const imgPath = `https://oremob.io/all-cards/ap/${tokenNumber.toString().padStart(4, '0')}.jpg`

  const podClick = async () => {
    // await router.push(`/pods/?id=${token[0]}`,`/pods/?id=${token[0]}`,{shallow: true})
    await setCurToken(token)
    setShowModal(true)
  }

  return (
      <a className="group w-full h-full ease-in duration-300 relative cursor-pointer" onClick={podClick}>
        <div className="grid object-contain">
          <img src="/images/0000.jpg" className="col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 z-0"/>
          <img src={imgPath} fill="true" className="border-2 col-start-1 col-end-2 row-start-1 row-end-2 transition-all duration-300 rounded-lg ease-in-out md:group-hover:scale-105 md:group-hover:shadow-sm mb-1 shadow-xl" />
        </div>
        <div className="font-roboto px-2 py-1 text-xs">
          <p className="text-white-90 font-normal">ORE-MOB// <span className="font-extrabold">{token.MOB}</span></p>
          <p className="text-red-500 font-extrabold">{`#${tokenNumber}`}</p>
        </div>
      </a>
  )
}