import _tokens from "../../../lib/metadata.json"
import _holders from "../../../lib/holders.json"
import { hexToUtf8, returnStakeAddressFromBech32, utf8ToHex } from "../../../lib/base"
import { grabAssetAddress, grabAccountInfo, grabAllAssetsFromStake } from "../../../external/blockfrost"

const policyID = `062b1da3d344c1e6208ef908b2d308201e7ff6bcfddf0f606249817f`
const handlePolicyID = `f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a`

export default async function handler(req, res) {
  const address = req.query.id
  const accountTokens = await grabAccountTokenByPolicy(policyID, address)
  
  if (accountTokens.length > 0) {
    let metadata = _tokens[policyID]

    let tokens = []

    Object.entries(metadata).map(token => {
      let tokenObj = {}
      tokenObj[token[0]] = token[1]

      tokens.push(tokenObj)
    })

    const filteredTokens = tokens.filter(function (token) {
      let name = Object.keys(token)
      if (accountTokens.includes(`${policyID}.${name}`)) return true
      return false
    })

    let orderedTokens = []

    filteredTokens.map(token => {
      orderedTokens.push(Object.values(token)[0])
    })

    sortTokens(orderedTokens)

    res.status(200).json(orderedTokens)
  } else {
    res.status(200).json('invalid-address')
  }
}

const sortTokens = (array) => {
  return array.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

const validateStakeAddress = async (address) => {
  if (address[0] == '$') {
    let handle = utf8ToHex(address.substring(1))
    let assetAddr = await grabAssetAddress(`${handlePolicyID}${handle}`)
    if (!assetAddr) return false

    address = assetAddr[0].address
  }
  let stakeAddr = returnStakeAddressFromBech32(address)
  let stakeAddrResponse = await grabAccountInfo(stakeAddr)

  return (stakeAddrResponse != false) ? stakeAddr : false
}

const grabAccountTokenByPolicy = async (policyID, address) => {
  let stakeAddr = await validateStakeAddress(address)
  if (stakeAddr != false) {
    let assets = []

    let page = 1
    let assetData = await grabAllAssetsFromStake(stakeAddr, page)

    while (assetData.length > 0) {
      assetData.map(asset => {
        if (asset.unit.includes(policyID)){
          let assetName = asset.unit.replace(policyID, '')
          assets.push(`${policyID}.${hexToUtf8(assetName)}`)
        }
      })

      page++
      assetData = await grabAllAssetsFromStake(stakeAddr, page)
    }

    return assets
  } else {
    console.log('invalid stake address!')
    return []
  }
}