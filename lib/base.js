import { bech32 } from 'bech32'

const convert = (from, to) => str => Buffer.from(str, from).toString(to)

export const utf8ToHex = convert('utf8', 'hex')
export const hexToUtf8 = convert('hex', 'utf8')

export function returnStakeAddressFromBech32(addr) {
  if (addr.length == 58) return addr
  if (!addr.startsWith('addr')) return addr

  var addressWords = bech32.decode(addr, 1000);
  var payload = bech32.fromWords(addressWords.words);
  var addressDecoded = `${Buffer.from(payload).toString("hex")}`;

  var stakeAddressDecoded =
    "e1" + addressDecoded.substring(addressDecoded.length - 56);

  const stakeAddress = bech32.encode(
    "stake",
    bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, "hex"))),
    1000
  );

  return stakeAddress;
}

export async function getImage(fileName) {
  let fileResponse = await fetchGet(`/api/image/${fileName}`)
  return fileResponse
}

export async function getPod(tokenID) {
  let podsResponse = await fetchGet(`/api/token/${tokenID}`)
  return podsResponse
}

export async function getTokens(address) {
  // let oresResponse = await fetchGet(`http://localhost:3001/api/token/${address}`)
  let oresResponse = await fetchGet(`/api/token/${address}`)

  return oresResponse
}
async function fetchGet(url) {
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return false
  }

  return data
}