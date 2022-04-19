<template>
	<div>
		<textarea v-model="messages" rows="10" cols="80" readonly></textarea>
		<br>
		<input/>
		<button>Send</button>
	</div>
</template>

<script>

export default {
  name: "App",
	data: function() {
    return {
      messages: ""
    };
  }
}

</script>

<style scoped>
textarea {
  resize: none;
}
input {
	width: 33.5rem;
}
</style>