<template>
  <div>
    <header class="header">
    </header>
    <MainContent />
    <br><br><br>
    <IpfsInfo />
    <br><br><br>
    <ChatWindow />
  </div>
</template>

<script>
import MainContent from "./components/MainContent.vue";
import IpfsInfo from "./components/IpfsInfo.vue";
import ChatWindow from "./components/ChatWindow.vue";

export default {
  name: "App",
  components: {
    IpfsInfo,
    MainContent,
    ChatWindow
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  flex-direction: column;
}

.ipfs-logo {
  height: 200px;
}

.heart {
  fill: red;
  position: relative;
  top: 5px;
  width: 50px;
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.header {
  display: flex;
  gap: 24px;
}
</style>
