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
    <button @click="(async () => cipherText = await this.$root.$MetaMask.encryptMessage(this.encryptionKey, this.messageToEncrypt))">Encrypt message</button>
    <div>Ciphertext: {{ cipherText }}</div>
    <button @click="(async () => clearText = await this.$root.$MetaMask.decryptMessage(this.provider, this.address, this.cipherText))">Decrypt message</button>
    <div>Cleartext: {{ clearText }}</div>
  </div>
</template>

<script>
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
      var result = await this.$root.$MetaMask.login()
      this.address = result[0]
      this.provider = result[1]

      this.accounts = await this.$root.$MetaMask.getAccount(this.provider)
      this.encryptionKey = await this.$root.$MetaMask.getEncryptionKey(this.provider, [this.accounts[0]])
    }
  }
};

// https://github.com/MetaMask/eth-sig-util/blob/main/src/encryption.ts


</script>