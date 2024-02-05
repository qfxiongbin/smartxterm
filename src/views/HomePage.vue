<template>
     <div class="content">
      <div class="message">{{ msg }}</div>
    </div>
</template>

<script>
export default {
  setup() {
    const msg = 'Welcome to SmartXterm!'
    return { msg }
  }
}

</script>

<style scoped>
.content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message {
  color: gray;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
}
</style>