import { ethers } from "ethers";
import { encrypt, stringifiableToHex } from "./crypt-utils"

export default {
    install: (app) => {
        app.config.globalProperties.$MetaMask = new Object()
        app.config.globalProperties.$MetaMask.login = async function () {
            if (!window.ethereum) {
                alert('MetaMask not detected. Please install MetaMask first.');
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const address = await provider.getSigner().getAddress();
            return [address, provider]
        }
        app.config.globalProperties.$MetaMask.getAccount = async function (provider) {
            const accounts = await provider.send('eth_accounts')
            return accounts
        }
        app.config.globalProperties.$MetaMask.getEncryptionKey = async function (provider, account) {
            const encryptionKey = await provider.send('eth_getEncryptionPublicKey', account)
            return encryptionKey
        }
        app.config.globalProperties.$MetaMask.encryptMessage = async function (encryptionKey, message) {
            const cipherText = stringifiableToHex(
              encrypt(
                encryptionKey,
                message
              )
            )
            console.log(cipherText)
            return cipherText
        }
        app.config.globalProperties.$MetaMask.decryptMessage = async function (provider, address, cipherText) {
            const clearText = await provider.send('eth_decrypt', [cipherText, address])
            return clearText
        }
    }
}