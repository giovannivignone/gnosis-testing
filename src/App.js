import './App.css';
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { ethers } from 'ethers'
import { useState } from 'react';

export const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
};

const safeAddress = "0x90fB167d002A08115638B58D2b6b50d40ee5a1d1";

function App() {
  const [buttonText, setButtonText] = useState("Connect")
  const [provider, setProvider] = useState(null)

  const buttonFunction = async () => {
    if (window.web3) {
      provider ? await InitiateGnosisTransaction(): await connectAccount();
    } else {
      alert("Please install metamask")
    }
  }

  const connectAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!provider) {
      throw new Error("Unable to connect to metamask")
    }
    setProvider(provider)
    setButtonText("Initiate Gnosis transaction")
  }

  const InitiateGnosisTransaction = async() => {
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ethers: ethers, signer: signer})
    const safe = await Safe.create({ethAdapter: ethAdapter, safeAddress: safeAddress})
    const transaction = await safe.createTransaction([
      {
        to: "0x7778B343eF92c338a2fbaC055B0e03BCaB73dE08",
        value: "10000",
        data: "0x"
      },
      {
        to: "0x7778B343eF92c338a2fbaC055B0e03BCaB73dE08",
        value: "10000",
        data: "0x"
      }
    ])
    // Above creates a batched transaction to the multiSend smart contract built by Gnosis

    const transactionHash = await safe.getTransactionHash(transaction)
    const signature = await signer._signTypedData({
      version: '1',
      chainId: 4,
      },
      EIP712_SAFE_TX_TYPE,
      transaction.data
    )
    console.log(window.ethereum.selectedAddress)
    const data = {
      safe: safeAddress,
      signature: signature,
      sender: ethers.utils.getAddress(window.ethereum.selectedAddress),
      contractTransactionHash: transactionHash,
      to: ethers.utils.getAddress(transaction.data.to),
      value: transaction.data.value.toString(),
      data: transaction.data.data,
      operation: 0,
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      chainId: 4,
      gasToken: transaction.data.gasToken,
      refundReceiver: transaction.data.refundReceiver,
      nonce: transaction.data.nonce,
    };

    const response = await fetch(`https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/${safeAddress}/multisig-transactions/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response)
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonFunction}>
          {buttonText}
        </button>
      </header>
    </div>
  );
}

export default App;
