<template>
  <div>
    <h1>IPFS & MetaMask Demo</h1>
    <p>This demo showcases how a decentralized and transparent but still secure chat app could work.</p>
    <p>It's also a demo for MetaMask, which is used for authentication and IPFS, which is used for the DB and general data.</p>
    <p>To start log in with your MetaMask wallet:</p>
    <button @click="web3Login()">Log in with MetaMask</button>
    <div>Address: {{ address }}</div>
    <br>
    <button @click="getEncryptionKey()">Get encryption key</button>
    <div>Encryption key: {{ encryptionKey }}</div>
    <div>Message to encrypt:</div>
    <input v-model="messageToEncrypt"/>
    <br>
    <button @click="encryptMessage()">Encrypt message</button>
    <div>Ciphertext: {{ cipherText }}</div>
    <button @click="decryptMessage()">Decrypt message</button>
    <div>Cleartext: {{ clearText }}</div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

export default {
  name: "MainContent",
  data() {
    return {
      provider: null,
      accounts: [],
      address: "",
      encryptionKey: "",
      messageToEncrypt: "",
      cipherText: "",
      clearText: ""
    }
  },
  methods: {
    async web3Login() {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask first.');
        return;
      }
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.address = await this.provider.getSigner().getAddress();
    },
    async getAccount() {
      this.accounts = await this.provider.send('eth_accounts')
    },
    async getEncryptionKey() {
      await this.getAccount()
      this.encryptionKey = await this.provider.send('eth_getEncryptionPublicKey', [this.accounts[0]])
    },
    async encryptMessage() {
      var encryptKey = this.encryptionKey
      var encryptMessage = this.messageToEncrypt
      this.cipherText = stringifiableToHex(
        encrypt(
          encryptKey,
          encryptMessage
        )
      )
    },
    async decryptMessage() {
      this.clearText = await this.provider.send('eth_decrypt', [this.cipherText, this.address])
    }
  }
};

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}

// https://github.com/MetaMask/eth-sig-util/blob/main/src/encryption.ts
function encrypt(publicKey, data) 
{
  // generate ephemeral keypair
  const ephemeralKeyPair = nacl.box.keyPair();

  // assemble encryption parameters - from string to UInt8
  try {
    var pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
  } catch (err) {
    throw new Error('Bad public key');
  }

  const msgParamsUInt8Array = naclUtil.decodeUTF8(data);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  // encrypt
  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey,
  );

  // handle encrypted data
  const output = {
    version: 'x25519-xsalsa20-poly1305',
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    ciphertext: naclUtil.encodeBase64(encryptedMessage),
  };
  // return encrypted msg data
  return output;
}

</script>