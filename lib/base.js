import { bech32 } from 'bech32'

export async function getPod(tokenID) {
  let podsResponse = await fetchGet(`/api/token/${tokenID}`)
  return podsResponse
}

export async function getTokens(address) {
  // let oresResponse = await fetchGet(`http://localhost:3000/api/token/${address}`)
  let oresResponse = await fetchGet(`https://ore-mob-filter-address.vercel.app/api/token/${address}`)

  return oresResponse
}

export async function getHolders(policyID) {
  // let holdersResponse = await fetchGet(`https://publicapi.cnftpredator.tools/owners/${policyID}`)
  let holdersResponse = await fetchGet(`/api/holder`)

  if (holdersResponse != false && holdersResponse["owners"] != null) {
    let holdersArray = {}

    holdersResponse["owners"].map(holder => {
      if (holdersArray[holder.stake])
        holdersArray[holder.stake].push(holder.asset_name)
      else
        holdersArray[holder.stake] = [holder.asset_name]
    })

    return holdersArray
  } else
    return []
}

async function fetchGet(url) {
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return false
  }

  return data
}

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