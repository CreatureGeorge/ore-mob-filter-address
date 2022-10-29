import tokens from "../../../lib/metadata.json"

export default function handler(req,res) {
  res.status(200).json(tokens)
}