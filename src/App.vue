<template>
  <div id="app">
    <smart-terminal :terminalId="1"></smart-terminal>
  </div>
</template>

<script>
import SmartTerminal from './components/SmartTerminal';

export default {
  name: 'App',
  components: {
    SmartTerminal
  },
  setup() {
  }
};
</script>

<style>
.terminal {
  width: 100%;
  height: 100%;
}
</style>
