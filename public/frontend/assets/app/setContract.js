/* eslint-disable*/
let eventOnChainContract;

async function getContractsData(){
    let contracts = await fetch("/frontend/assets/app/contract.json")
    console.log(contracts)
    contracts = await contracts.json()
    console.log(contracts)
    return contracts
}

async function setPolygonContract() {
    const contracts = await getContractsData()
    const abi = contracts.NFT_MATIC_ABI
    const address = contracts.NFT_MATIC_ADDRESS
    eventonchainContract = new web3.eth.Contract(abi, address)
    console.log('Polygon Contract Set')
    console.log(eventonchainContract)
}


async function setCronosContract() {
    const contracts = await getContractsData()
    const abi = contracts.NFT_CRONOS_ABI
    const address = contracts.NFT_CRONOS_ADDRESS
    eventonchainContract = new web3.eth.Contract(abi, address)
    console.log('Cronos Contract Set')
    console.log(eventonchainContract)
}


async function setGnosisContract() {
    const contracts = await getContractsData()
    const abi = contracts.NFT_GNOSIS_ABI
    const address = contracts.NFT_GNOSIS_ADDRESS
    eventonchainContract = new web3.eth.Contract(abi, address)
    console.log('Gnosis Contract Set')
    console.log(eventonchainContract)
}