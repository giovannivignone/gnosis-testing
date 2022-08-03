
import { SafeTransaction } from '@gnosis.pm/safe-core-sdk-types'
import { ethers } from 'ethers'
import Web3 from 'web3'

const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8"

function encodeTransactionData(transaction:SafeTransaction): string {
    const web3 = new Web3()
    const { to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce} = transaction.data
    const safeTxHash = ethers.utils.keccak256(
                web3.eth.abi.encodeParameters([],
                    [SAFE_TX_TYPEHASH,
                    to,
                    value,
                    ethers.utils.keccak256(data),
                    operation,
                    safeTxGas,
                    baseGas,
                    gasPrice,
                    gasToken,
                    refundReceiver,
                    nonce]
                )
            );
    return safeTxHash//web3.utils.encodePacked("0x19", "0x01", domainSeparator(), safeTxHash);
}

function getTransactionHash(transaction:SafeTransaction): string {
    return ethers.utils.keccak256(encodeTransactionData(transaction));
}