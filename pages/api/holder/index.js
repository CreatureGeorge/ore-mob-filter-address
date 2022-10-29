import holders from "../../../lib/holders.json"

export default function handler(req,res) {
  res.status(200).json(holders)
}