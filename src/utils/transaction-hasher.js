import { ethers } from 'ethers'

const EIP712_SAFE_TX_TYPE = {
    SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
}

export async function getTransactionHash(transaction, safeAddress) {
    console.log(transaction.data)
    return await ethers.utils._TypedDataEncoder.hash({verifyingContract: ethers.utils.getAddress(safeAddress)}, EIP712_SAFE_TX_TYPE, transaction.data)
}