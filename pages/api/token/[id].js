import _tokens from "../../../lib/metadata.json"
import _holders from "../../../lib/holders.json"

const policyID = `062b1da3d344c1e6208ef908b2d308201e7ff6bcfddf0f606249817f`

export default function handler(req, res) {
  const address = req.query.id

  let holdersArray = {}

  _holders["owners"].map(holder => {
    if (holdersArray[holder.stake])
      holdersArray[holder.stake].push(holder.asset_name)
    else
      holdersArray[holder.stake] = [holder.asset_name]
  })

  if (holdersArray[address]) {
    const holder = holdersArray[address]

    let metadata = _tokens[policyID]

    let tokens = []

    Object.entries(metadata).map(token => {
      let tokenObj = {}
      tokenObj[token[0]] = token[1]

      tokens.push(tokenObj)
    })

    const filteredTokens = tokens.filter(function (token) {
      let name = Object.keys(token)
      if (holder.includes(`${policyID}.${name}`)) return true
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