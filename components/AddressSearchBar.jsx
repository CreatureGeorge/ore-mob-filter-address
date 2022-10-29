import { useRouter } from "next/router";
import { useState } from "react";


export default function AddressSearchBar({ placeholder, setAddress }) {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [invalid, setInvalid] = useState(false)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      validateAddress()
    }
  }

  const inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const validateAddress = async () => {
    if (searchText == "$koin") setInvalid(true)
    else setInvalid(false)

    setAddress(searchText)

    router.push(`/explorer?address=${searchText}`)
  }

  return (
    <div className="flex flex-row justify-center items-center z-10">
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value) }
        onKeyUp={inputHandler}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className={`h-7 p-5 rounded-lg border-2 bg-gray-500 first-letter 
        w-[90vw] md:w-[50vw] outline-none duration-300 
        shadow-[22px_22px_40px_4px_rgba(255,255,255,0.3)] 
        text-base tracking-widest font-thin text-white-90
        ${!invalid ? "placeholder-white-50 border-chinese-black-50" : "placeholder-red-500 border-red-600"} 
        placeholder:tracking-widest placeholder:font-thin`}
      ></input>
      <button className={`duration-500 ${searchText != "" ? "visible opacity-100" : "invisible opacity-0"} ml-2 text-white-50 focus:outline-none outline-none bg-transparent`}
       onClick={() => {setSearchText(""); setInvalid(false)}}>
        <div className="w-5">
          <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current rotate-45"}></span>
          <span aria-hidden="true" className={"block absolute h-0.5 w-5 bg-current -rotate-45"}></span>
        </div>
      </button>
    </div>
  )

}