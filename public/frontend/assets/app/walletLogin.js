/* eslint-disable*/

let accountConnected
let isConnected = false
let web3

function setSelectedAccount (account) {
  accountConnected = account
}

function setIsConnected (val) {
  isConnected = val
}

function setWeb3 (web3provider) {
  web3 = web3provider
}

async function connectWallet () {
  const provider = window.ethereum

  if (typeof provider !== 'undefined') {
    await provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        setSelectedAccount(accounts[0])
        setIsConnected(true)
        console.log(`Selected account is ${accounts[0]}`)
      })
      .catch((err) => {
        console.log(err)
      })

    window.ethereum.on('connect', function (accounts) {
      setSelectedAccount(accounts[0])
      console.log(`Selected account is ${accounts[0]}`)
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      setSelectedAccount(accounts[0])
      console.log(`Selected account changed to ${accounts[0]}`)
    })

    window.ethereum.on('disconnect', function (err) {
      setSelectedAccount(null)
      setIsConnected(true)
    })

    const web3 = new Web3(provider)
    setWeb3(web3)

    return web3
  } else {
    throw new Error('No Wallet Provider Detected')
  }
}

async function getAndVerifySignature (email) {
  let requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'same-origin',
    redirect: 'follow'
  }

  const signDataresponse = await fetch('/user/auth/signingdata', requestOptions)
  let resData = await signDataresponse.json()
  console.log(resData)
  const signature = await web3.eth.personal.sign(resData.data.signingData, accountConnected)
  console.log(signature)

  requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signer: accountConnected, email, signature }),
    credentials: 'same-origin',
    redirect: 'follow'
  }
  const verifySignatureResponse = await fetch('/user/auth/cryptologin', requestOptions)
  resData = await verifySignatureResponse.json()
  console.log(resData)
  if (resData.data.result) {
    window.location.href = '/user/dashboard'
  } else {
    // eslint-disable-next-line no-undef
    showErrorToast('Invalid Signature')
  }
}



document.getElementById('connect-wallet-button').addEventListener('click', async (e) => {
  e.preventDefault()
  const emailAddress = document.getElementById('user_email').value
  if(!emailAddress) alert("Please enter Email")
  else{
    console.log('Connecting Wallet')
    await connectWallet()
    console.log('Verifying Signature')
    await getAndVerifySignature(emailAddress)
  }
})


async function connectSequenceWallet () {
  const wallet = await sequence.initWallet('polygon')

  const connectDetails = await wallet.connect({
    app: 'EventOnChain',
    authorize: false,
  })
  console.log('user accepted connect?', connectDetails.connected)
  console.log('users signed connect proof to valid their account address:', connectDetails.proof)


  const address = await wallet.getAddress()
  console.log(address)
  setSelectedAccount(address)
  setIsConnected(true)

  await wallet.openWallet()

  const web3 = new Web3(wallet.getProvider())
  console.log(web3)
  setWeb3(web3)

  return web3

}

document.getElementById('sequence-wallet-button').addEventListener('click', async (e) => {
  e.preventDefault()
  const emailAddress = document.getElementById('user_email').value
  if(!emailAddress) alert("Please enter Email")
  else{
    console.log('Connecting Wallet')
    await connectSequenceWallet()
    console.log('Verifying Signature')
    await getAndVerifySignature(emailAddress)
  }
})
