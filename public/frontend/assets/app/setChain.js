/* eslint-disable*/

async function switchChain (networkName, chainId, RpcUrl) {
    const chainIdHex = web3.utils.toHex(chainId)
    try {
      web3.utils.toHex(51)
      alert(`Please connect to ${networkName} to continue`)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: networkName,
                rpcUrls: [RpcUrl] /* ... */
              }
            ]
          })
        } catch (addError) {
          alert(`Please connect to ${networkName} to continue`)
        }
      }
      // handle other "switch" errors
    }
  }
  
  
  

// window.ethereum.on('chainChanged', function (chainId) {
//     console.log(`Chain changed to ${chainId}`)
//     if (chainId != '0x33') {
//     switchChain()
//     }
// })
  

async function setPolygonChain(){
    const chainId = await web3.eth.getChainId()
    if(chainId != 80001){
        await switchChain("Polygon Testnet",80001,"https://rpc-mumbai.maticvigil.com/")
        await setPolygonContract()
    }else{
        await setPolygonContract()
    }
}


async function setCronosChain(){
    const chainId = await web3.eth.getChainId()
    if(chainId != 338){
        await switchChain("Cronos Testnet",338,"https://cronos-testnet-3.crypto.org:8545")
        await setCronosContract()
    }else{
        await setCronosContract()
    }
} 

async function setGnosisChain(){
    const chainId = await web3.eth.getChainId()
    if(chainId != 100){
        await switchChain("Gnosis Chain Mainnet",100,"https://rpc.gnosischain.com")
        await setGnosisContract()
    }else{
        await setGnosisContract()
    }
} 
  