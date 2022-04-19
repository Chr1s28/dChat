<template>
  <div>
    <h2>IPFS Status</h2>
    <h3>{{ status }}</h3>
    <div v-if="online" class="ipfs-info">
      <h3>
        ID: <span id="ipfs-info-id">{{ id }}</span>
      </h3>
      <h3>
        Agent version: <span id="ipfs-info-agent">{{ agentVersion }}</span>
      </h3>
      <img id="fucker" :src="imageUrl"/>
    </div>
  </div>
</template>

<script>
import { createInstance } from 'orbit-db'

export default {
  name: "IpfsInfo",
  data: function() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: "",
      online: false,
      imageUrl: ""
    };
  },
  mounted: function() {
    this.getIpfsNodeInfo();
  },
  methods: {
    async getIpfsNodeInfo() {
      try {
        // Await for ipfs node instance.
        this.$root.ipfsNode = await this.$ipfs;
        
        // Call ipfs `id` method.
        // Returns the identity of the Peer.
        const { agentVersion, id } = await this.$root.ipfsNode.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS";
        this.online = this.$root.ipfsNode.isOnline();

        await this.createOrbitDBInstance()

        for await (var chunk of this.$root.ipfsNode.cat("QmX2pWKRSBHQAFNG17DR496LRwD251b6cgwJ28fktt2WhG")) {
          var content = [];
          content.push(chunk)
          this.imageUrl = URL.createObjectURL(new Blob(content, {type: 'image/png'}));
        }

      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    },
    async createOrbitDBInstance() {
      this.$root.orbitDB = await createInstance(this.$root.ipfsNode)
    }
  }
};
</script>
