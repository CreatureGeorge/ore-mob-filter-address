// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const axios = require('axios');

require('dotenv').config();

export async function grabAssetsFromPolicyFromPage(policy, page=1) {
  let assetsOfPolicyResponse = await callBlockfrostGet({
    method: 'get',
    url: `${process.env.BLOCKFROSTAPIURL}assets/policy/${policy}?page=${page}&count=100`,
    headers: {
      'project_id': `${process.env.BLOCKFROSTAPI}`
    }
  })
  return assetsOfPolicyResponse
}
export async function grabAssetMetadata(assetID) {
    let assetInfoResponse = await callBlockfrostGet({
        method: 'get',
        url: `${process.env.BLOCKFROSTAPIURL}assets/${assetID}`,
        headers: {
            'project_id': `${process.env.BLOCKFROSTAPI}`
        }
    })
    return assetInfoResponse
}

export async function grabAssetAddress(assetID) {
  let assetAddrResponse = await callBlockfrostGet({
    method: 'get',
    url: `${process.env.BLOCKFROSTAPIURL}assets/${assetID}/addresses`,
    headers: {
        'project_id': `${process.env.BLOCKFROSTAPI}`
    }
})
return assetAddrResponse
}

export async function grabAccountInfo(stakeAddr) {
  let accountInfoResponse = await callBlockfrostGet({
    method: 'get',
    url: `${process.env.BLOCKFROSTAPIURL}accounts/${stakeAddr}`,
    headers: {
        'project_id': `${process.env.BLOCKFROSTAPI}`
    }
})
return accountInfoResponse

}
export async function grabAllAssetsFromStake(stakeAddress, page=1) {
  let accountAssets = await callBlockfrostGet({
    method: 'get',
    url: `${process.env.BLOCKFROSTAPIURL}accounts/${stakeAddress}/addresses/assets?page=${page}&count=100`,
    headers: {
      'project_id': `${process.env.BLOCKFROSTAPI}`
    }
  })
  return accountAssets
}

async function callBlockfrostGet(getCall) {
    let response = await axios(
        getCall
    )
        .then(response => {
            console.log(`${response.status} ${response.statusText} : [${response.config.method}] ${response.config.url} ${(response.config.data) ? response.config.data : ''}`)
            return response.data
        })
        .catch(error => {
            if (error.response === undefined) //add to error log
              console.log(`INVALID api request, no response`)
            else                              //add to error log
              console.log(`${error.response.status} ${error.response.statusText} : [${error.config.method}] ${error.config.url} ${(error.config.data) ? error.config.data : ''}`)
            return false
        });

    return response
}